const express = require('express');
const request = require('sync-request');
const app = express();
const bodyParser = require('body-parser');
const coinapi = require('./private_modules/coinapi.js');
const qf4n = require('./private_modules/queryfactory-for-node')
const dd = require('./private_modules/dd.js');

let e_exchanges = ['bithumb', 'korbit', 'upbit', 'coinone'];
let k_exchanges = ['빗썸', '코빗', '업비트', '코인원'];
let e_coins = ['btc', 'eth', 'xrp', 'bch', 'qtum', 'btg', 'eos', 'trx', 'etc', 'ada', 'neo'];
let k_coins = ['비트코인', '이더리움', '리플', '비트코인캐시', '퀀텀', '비트코인골드',
'이오스', '트론', '이더리움클래식', '에이다', '네오'];

app.use(bodyParser.json());
qf4n.createQueryFactory(__dirname, '/resources/config');

app.get('/keyboard', function(req, res) {
    let keyboard = {
        "type": "text"
    };
    res.send(keyboard);
});

function getExchangeInfo (exchange, coin) {
    let res = "";

    for (let i = 0; i < coin.length; i++) {
        let ret = request('GET', coinapi.geturl(exchange, coin[i]));
        let obj = JSON.parse(ret.getBody().toString("utf8"));

        res += coin[i].toUpperCase() + " " + coinapi.priceWithCommas(parseInt(coinapi.getprice(exchange, obj), 10)) + "원\n";

    }
    res += coinapi.gethomeurl(exchange);
    return res;
}

function getCoinInfo (exchange, coin) {
    let res = "";

    for (let i = 0; i < exchange.length; i++) {
        if (coinapi.getCoinlist(exchange[i]).indexOf(coin) === -1) continue;

        let ret = request('GET', coinapi.geturl(exchange[i], coin));
        let obj = JSON.parse(ret.getBody().toString("utf8"));

        res += exchange[i].toUpperCase() + " " +
        coinapi.priceWithCommas(parseInt(coinapi.getprice(exchange[i], obj))) + "원\n";
    }
    res += dd.getDD("all_exchanges").replace("$1", coin.toUpperCase());
    return res;
}

function getMessage (content, user_key) {
    content = content.toLowerCase();

    return new Promise((resolve, reject) => {
        if(content.indexOf('안녕') !== -1 || content.indexOf('hello') !== -1) {
            resolve(dd.getDD("hello"));
        } else if(content.indexOf('도움') !== -1 || content.indexOf('help') !== -1) {
            resolve(dd.getDD("help"));
        } else if(content.indexOf('핫키시작') !== -1) {
            const param = {
                "userKey": user_key
            }
            qf4n.select("checkHotkey", param)
            .then(data => {
                let checkSum = parseInt(data[0].check_sum);
                if(checkSum === 0) {
                    for (let i = 1; i <= 5; i++) {
                        let param = {
                            hotkeyNumber: i,
                            userKey: user_key
                        }
                        qf4n.insert('startHotkey', param)
                        .then((result)=> {
                            if ( i == 5) {
                                resolve(dd.getDD("hotkey_start_success"));
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            resolve(dd.getDD("hotkey_start_fail"));
                        })
                    }
                } else {
                    resolve(dd.getDD("hotkey_start_fail"));
                }
            })
            .catch((err) => {
                console.log(err)
            });
        } else if(content.indexOf('핫키등록') !== -1) {
            const param = {
                "userKey": user_key
            }
            qf4n.select("checkHotkey", param)
            .then(data => {
                let checkSum = parseInt(data);
                if(checkSum === 0) {
                    resolve(dd.getDD("hotkey_register_fail1"));
                } else {
                    let input = content.split(' ');
                    if (input.length < 3) {
                        resolve(dd.getDD("hotkey_register_fail2"));
                    }
                    if (parseInt(input[1])) {
                        let hotkeyNumber = parseInt(input[1]);
                        let menu = input[2];
                        if (hotkeyNumber <= 0 || hotkeyNumber > 5) {
                            resolve(dd.getDD("hotkey_register_fail3"));
                        }
                        const param = {
                            menu: menu,
                            hotkeyNumber: hotkeyNumber,
                            userKey: user_key
                        }
                        qf4n.update('setHotkey', param)
                        .then((result) =>{
                            resolve(hotkeyNumber + "번 핫키에 " + menu + " 등록되었습니다.");
                        })
                        .catch((error) => {
                            console.log(error);
                            resolve(dd.getDD("hotkey_register_fail4"));
                        })
                    } else {
                        resolve(dd.getDD("hotkey_register_fail4"));
                    }
                }
            })
            .catch(err => console.log(err));
        } else if (content.indexOf('알림등록') !== -1) {
            let input = content.split(' ');
            if (input.length < 5) {
                resolve(dd.getDD("alarm_fail"));
            } else {
                let exchange = input[1];
                let coin = input[2];
                let price = input[3];
                let email = input[4];

                const param = {
                    userKey: user_key, 
                    exchange: exchange, 
                    coin: coin, 
                    price: price, 
                    email: email
                }

                qf4n.insert('setAlarm', param)
                .then((result) => {
                    resolve(dd.getDD("alarm_register_success").replace("$1", email));
                }) 
                .catch((error) => {
                    console.log(error);
                });
            }
        } else if (parseInt(content)) {
            let hotkey = parseInt(content);

            if (hotkey === 9) {
                const param = {
                    userKey: user_key
                }
                qf4n.select('getHotkeyMenuList', param)
                .then((data) => {
                    let result = '';
                    data.map((object) => {
                        result += ("hotkey" + object.hotkey_number + ": " + object.menu + "\n");
                    });
                    resolve(result + dd.getDD("hotkey_call_all"))
                })
                .catch((error) => {
                    console.log(error);
                });
            } else if (hotkey <= 0 || hotkey > 5) {
                resolve(dd.getDD("hotkey_call_fail1"));
            } else {
                const param = {
                    hotkeyNumber: hotkey,
                    userKey: user_key
                }
                qf4n.select('getHotkeyMenu', param) 
                    .then((data) => {
                        content = data[0].menu;
                        console.log(content);
                        for (let i = 0; i < e_exchanges.length; i++) {
                            if(content.indexOf(e_exchanges[i]) !== -1 || content.indexOf(k_exchanges[i]) !== -1) {
                                resolve(getExchangeInfo(e_exchanges[i], coinapi.getCoinlist(e_exchanges[i])));
                            }
                        }
                        for (let i = 0; i < e_coins.length; i++) {
                            if(content.indexOf(e_coins[i]) !== -1 || content.indexOf(k_coins[i]) !== -1) {
                                resolve(getCoinInfo(e_exchanges, e_coins[i]));
                            }
                        }

                        resolve(dd.getDD("hotkey_call_fail2").replace("$1", hotkey));
                }).catch(err => {
                    console.log(err);
                    resolve(dd.getDD("network_error"));
                });
            }
        } else {
            for (let i = 0; i < e_exchanges.length; i++) {
                if(content.indexOf(e_exchanges[i]) !== -1 || content.indexOf(k_exchanges[i]) !== -1) {
                    resolve(getExchangeInfo(e_exchanges[i], coinapi.getCoinlist(e_exchanges[i])));
                }
            }
            for (let i = 0; i < e_coins.length; i++) {
                if(content.indexOf(e_coins[i]) !== -1 || content.indexOf(k_coins[i]) !== -1) {
                    resolve(getCoinInfo(e_exchanges, e_coins[i]));
                }
            }

            resolve(dd.getDD("menu_fail"));
        }
    });
}

app.post('/message', function(req, res){
    let user_key = decodeURIComponent(req.body.user_key); // user's key
    let type = decodeURIComponent(req.body.type); // message type
    let content = decodeURIComponent(req.body.content); // user's message

    console.log(user_key + " " + type + " " + content);

    getMessage(content, user_key)
        .then((text) => {
            let answer = {
                "message":{
                    "text": text
                 }
            };
            res.send(answer);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.listen(4000, function() {
    console.log('Connect 4000 port!');
});
