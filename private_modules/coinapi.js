exports.gethomeurl = (exchange) => {
    switch(exchange) {
        case "bithumb":
            return "https://www.bithumb.com";
        case "korbit":
            return "https://www.korbit.co.kr";
        case "upbit":
            return "https://upbit.com/coin_list";
        case "coinone":
            return "https://coinone.co.kr";
    }
};

exports.geturl = (exchange, currency) => {
    return makeurl(exchange, currency);
};

exports.getprice = (exchange, obj) => {
    switch(exchange) {
        case "bithumb":
            return obj.data.closing_price;
        case "korbit":
            return obj.last;
        case "upbit":
            return obj[0].tradePrice;
        case "coinone":
            return obj.last;
    }
};

exports.priceWithCommas = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

exports.getCoinlist = (exchange) => {
    let coin = {
        "bithumb": ['btc', 'eth', 'etc', 'xrp', 'bch', 'qtum', 'btg', 'eos'],
        "korbit": ['btc', 'eth', 'etc', 'xrp', 'bch', 'btg'],
        "upbit": ['btc', 'etc', 'ada', 'xrp', 'eth', 'qtum', 'bch', 'btg', 'trx'],
        "coinone": ['btc', 'bch', 'eth', 'etc', 'xrp', 'qtum', 'btg']
        };
    return coin[exchange];
};

function makeurl (exchange, currency) {
    var url = getapi(exchange) + currency;
    // coinrail: btc-krw
    // korbit: btc_krw
    switch (exchange) {
        case "korbit":
            return url + "_krw";
        case "coinone":
            return url + "&format=json";
        default:
            return url;
    }
}

function getapi (exchange) {
    switch(exchange) {
        case "bithumb":
            return "https://api.bithumb.com/public/ticker/";
        case "korbit":
            return "https://api.korbit.co.kr/v1/ticker?currency_pair=";
        case "upbit":
            return "https://crix-api-endpoint.upbit.com/v1/crix/candles/days?code=CRIX.UPBIT.krw-";
        case "coinone":
            return "https://api.coinone.co.kr/ticker/?currency=";
    }
}
