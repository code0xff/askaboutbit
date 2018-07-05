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
    let values = [];
    if (param) {
        const keys = Object.keys(param);
    
        for (let i = 1; i <= keys.length; i++) {
            let key = keys[i - 1];
            sql = sql.replace(new RegExp(':' + key, 'g'), ('$' + i));
            values.push(param[key]);
        }
    }
    return {
        sql,
        values
    };
}
