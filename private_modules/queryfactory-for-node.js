const jsonHandler = require('./json-handler');
let connection;

let queryFactory = {};

exports.createQueryFactory = (projectPath, configPath) => {
    const config = jsonHandler.loadMapperConfig(projectPath, configPath);
    const module = setConnection(config.database);
    connection = require(module);
    if (connection) {
        connection.openConnection(config.connection);
    } else {
        console.log('database informaiton is not valid. please check database name.(you can only use mysql, postgresql.)')
    }
    queryFactory = jsonHandler.loadQueries(projectPath, config.mappers);
}

exports.insert = (key, param) => {
    return new Promise((resolve, reject) => {
        const sql = getQuery('insert', key);

        connection.query(sql, param)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

exports.select = (key, param) => {
    return new Promise((resolve, reject) => {
        const sql = getQuery('select', key);

        connection.select(sql, param)
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

exports.update = (key, param) => {
    return new Promise((resolve, reject) => {
        const sql = getQuery('update', key);

        connection.query(sql, param)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

exports.delete = (key, param) => {
    return new Promise((resolve, reject) => {
        const sql = getQuery('delete', key);

        connection.query(sql, param)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const getQuery = (type, key) => {
    if (queryFactory[type][key] === undefined) {
        console.log(key + ' is not in ' + type + ' queries. please check mapper file.');
        return;
    }
    return queryFactory[type][key];
}

const setConnection = (param) => {
    const database = param.toLowerCase();
    switch (database) {
        case 'mysql':
            return './mysql-wrapper';
        case 'postgresql':
            return './pg-wrapper';
        default:
            return false;
    }
}

exports.getQueryList = () => {
    return queryFactory;
}
