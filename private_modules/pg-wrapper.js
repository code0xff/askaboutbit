const pg = require('pg');

let client;

exports.openConnection = (dbConfig) => {
    client = new pg.Client(dbConfig);
    client.connect();
}

exports.query = (sql, param) => {
    const data = insertParam(sql, param);
    return new Promise((resolve, reject) => {
        client
        .query(data.sql, data.values, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

exports.select = (sql, param) => {
    const data = insertParam(sql, param);
    return new Promise((resolve, reject) => {
        client
        .query(data.sql, data.values, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result.rows);
        });
    });
}

const insertParam = (sql, param) => {
    if (!param) return sql;

    const keys = Object.keys(param);
    let values = [];
    for (let i = 1; i <= keys.length; i++) {
        let key = keys[i - 1];
        sql = sql.replace(':' + key, ('$' + i));
        values.push(param[key]);
    }
    const data = {
        sql,
        values
    }
    return data;
}