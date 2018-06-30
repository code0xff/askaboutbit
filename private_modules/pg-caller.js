const pg = require('pg');

let client;

exports.openConnection = (dbConfig) => {
    client = new pg.Client(dbConfig);
    client.connect();
}

exports.query = (sql) => {
    return new Promise((resolve, reject) => {
        client
        .query(sql, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

exports.select = (sql) => {
    return new Promise((resolve, reject) => {
        client
        .query(sql, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result.rows);
        });
    });
}
