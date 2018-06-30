const jsonHandler = require('./json-handler');
const connection = require('./pg-caller');

let queryFactory = {};

exports.createQueryFactory = (projectPath, configPath) => {
    const config = jsonHandler.loadMapperConfig(projectPath, configPath);
    connection.openConnection(config.connection);
    queryFactory = jsonHandler.loadQueries(projectPath, config.mappers);
}

exports.insert = (key, param) => {
    return new Promise((resolve, reject) => {
        const sql = getQuery('insert', key, param);

        connection.query(sql)
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
        const sql = getQuery('select', key, param);

        connection.select(sql)
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
        const sql = getQuery('update', key, param);

        connection.query(sql)
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
        const sql = getQuery('delete', key, param);

        connection.query(sql)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const insertParamIntoSQL = (sql, param) => {
    if (param !== undefined) {
        for (let key in param) {
            sql = sql.replace(new RegExp('#{' + key + '}', 'gi'), "'" + param[key] + "'");
        }
    }
    return sql;
}

const getQuery = (type, key, param) => {
    if (queryFactory[type][key] === undefined) {
        console.log(key + ' is not in ' + type + ' queries. please check mapper file.');
        return;
    }
    return insertParamIntoSQL(queryFactory[type][key], param);
}

exports.getQueryList = () => {
    return queryFactory;
}
