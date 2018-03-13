const express = require('express');
const request = require('sync-request');
const app = express();
const bodyParser = require('body-parser');
const coinapi = require('./private_modules/coinapi.js');
const dbapi = require('./private_modules/dbapi.js');
const dd = require('./private_modules/dd.js');

let e_exchanges = ['bithumb', 'coinnest', 'coinrail', 'korbit', 'upbit', 'coinone'];
let k_exchanges = ['빗썸', '코인네스트', '코인레일', '코빗', '업비트', '코인원'];
let e_coins = ['btc', 'eth', 'xrp', 'bch', 'qtum', 'btg', 'eos', 'tron', 'etc', 'ada', 'neo'];
let k_coins = ['비트코인', '이더리움', '리플', '비트코인캐시', '퀀텀', '비트코인골드',
'이오스', '트론', '이더리움클래식', '에이다', '네오'];

app.use(bodyParser.json());

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
        if(content.indexOf('안녕') !== -1 || content.indexOf('hello') !== -1 || content.indexOf('hi') !== -1) {
            resolve(dd.getDD("hello"));
        } else if(content.indexOf('도움') !== -1 || content.indexOf('help') !== -1) {
            resolve(dd.getDD("help"));
        } else if(content.indexOf('핫키시작') !== -1) {
            dbapi.checkHotkey(user_key)
            .then(data => {
                let checkSum = parseInt(data);
                if(checkSum === 0) {
                    dbapi.startHotkey(user_key);
                    resolve(dd.getDD("hotkey_start_success"));
                } else {
                    resolve(dd.getDD("hotkey_start_fail"));
                }
            })
            .catch(err => console.log(err));
        } else if(content.indexOf('핫키등록') !== -1) {
            dbapi.checkHotkey(user_key)
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
                        dbapi.setHotkey(hotkeyNumber, user_key, menu);
                        resolve(hotkeyNumber + "번 핫키에 " + menu + " 등록되었습니다.");
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

                dbapi.setAlarm(user_key, exchange, coin, price, email);
                resolve(dd.getDD("alarm_register_success").replace("$1", email));
            }
        } else if (parseInt(content)) {
            let hotkey = parseInt(content);

            if (hotkey === 9) {
                dbapi.getHotkeyMenuList(user_key)
                .then(data => resolve(data + dd.getDD("hotkey_call_all")));
            } else if (hotkey <= 0 || hotkey > 5) {
                resolve(dd.getDD("hotkey_call_fail1"));
            } else {
                dbapi.getHotkeyMenu(hotkey, user_key)
                    .then((data) => {
                    content = data;
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
