const pg = require('pg');
const dbinfo = require('./dbinfo.js');

const config = dbinfo.getDBInfo();

exports.startHotkey = function (userKey) {
    const client = new pg.Client(config);

    client.connect();
    let sql = "";
    for (let i = 1; i <= 5; i++) {
        sql += "INSERT INTO HOTKEY_INFO VALUES (" + i + ", '" + userKey + "', '',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);";
    }
    client
        .query(sql)
        .then(() => {
            console.log('Data created successfully!');
            client.end(console.log('Closed client connection'));
        })
        .catch(err => console.log(err));
};

exports.setHotkey = function (hotkeyNumber, userKey, menu) {
    const client = new pg.Client(config);

    client.connect();
    let sql = "UPDATE HOTKEY_INFO SET MENU = '" + menu + "', UPDATE_DATE = CURRENT_TIMESTAMP WHERE HOTKEY_NUMBER = " + hotkeyNumber + " AND USER_KEY = '" + userKey + "';";

    client
        .query(sql)
        .then(() => {
            console.log('Data updated successfully!');
            client.end(console.log('Closed client connection'));
        })
        .catch(err => console.log(err));
};

exports.getHotkeyMenu = function (hotkeyNumber, userKey) {
    return new Promise((resolve, reject) => {
        const client = new pg.Client(config);
        let menu = "";

        client.connect();
        let sql = "SELECT MENU FROM HOTKEY_INFO WHERE HOTKEY_NUMBER = " + hotkeyNumber + " AND USER_KEY = '" + userKey + "';";
        client
            .query(sql)
            .then((data) => {
                let rows = data.rows;
                rows.map((row) => {
                    menu = row.menu;
                });

                console.log(menu + " is called by " + userKey);
                client.end(console.log('Closed client connection'));

                resolve(menu);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

exports.getHotkeyMenuList = function (userKey) {
    return new Promise((resolve, reject) => {
        const client = new pg.Client(config);
        let menulist = "";

        client.connect();
        let sql = "SELECT HOTKEY_NUMBER, MENU FROM HOTKEY_INFO WHERE USER_KEY = '" + userKey + "' ORDER BY HOTKEY_NUMBER;";
        client
            .query(sql)
            .then((data) => {
                let rows = data.rows;
                rows.map((row) => {
                    let hotkeyNumber = row.hotkey_number;
                    let menu = row.menu;

                    menulist += "hotkey" + hotkeyNumber + " : " + menu + "\n";
                });

                client.end(console.log('Closed client connection'));
                resolve(menulist);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

exports.checkHotkey = function (userKey) {
    return new Promise((resolve, reject) => {
        const client = new pg.Client(config);

        let checkSum = 0;
        client.connect();
        let sql = "SELECT COUNT(*) AS check_sum FROM HOTKEY_INFO WHERE USER_KEY = '" + userKey + "';";
        client
            .query(sql)
            .then((data) => {
                let rows = data.rows;
                rows.map((row) => {
                    checkSum = row.check_sum;
                });

                client.end(console.log('Closed client connection'));
                resolve(checkSum);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};
