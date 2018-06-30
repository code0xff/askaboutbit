const fs = require('fs');
const queryTypes = ['insert', 'select', 'update', 'delete'];
let ignoreList = [];

exports.loadMapperConfig = (projectPath, configPath) => {
    let rawData = fs.readFileSync(projectPath + configPath + '/mapper-config.json', 'utf8');
    let JSONData = JSON.parse(rawData);

    if (JSONData.mappers === undefined) {
        console.log('mappers is not exist. please check mapper-config.json.');
        return;
    }
    
    if (JSONData.connection === undefined) {
        console.log('connection is not exist. please check mapper-config.json.');
        return;
    }

    if (JSONData.ignore !== undefined) {
        ignoreList = JSONData.ignore;
    }
    
    return JSONData;
}

exports.loadQueries = (projectPath, mapperPath) => {
    let queryList = {
        insert: {},
        select: {},
        update: {},
        delete: {}
    }

    const path = projectPath + mapperPath;
    const fileList = fs.readdirSync(path);

    for (let i = 0; i < fileList.length; i++) {
        if (ignoreList.indexOf(fileList[i]) !== -1) {
            continue;
        }

        let rawData = fs.readFileSync(path + "/" + fileList[i], 'utf8');
        let JSONData = JSON.parse(rawData);
        
        let JSONMapper = JSONData.mapper;
        if (JSONMapper === undefined) {
            console.log('please create mapper tree on ' + fileList[i] + '.');
            return;
        }

        for (let queryType in JSONMapper) {
            let queries = JSONMapper[queryType];

            if (queryTypes.indexOf(queryType) === -1) {
                console.log(queryType + ' is not invalid key. insert, select, update, delete are valid. please check ' + fileList[i] + '.');
                return;
            }

            for (let key in queries) {
                if (queryList[queryType][key] !== undefined) {
                    console.log(queryType + ' is duplicate key.');
                    return;
                }
                queryList[queryType][key] = queries[key];
            }
        }
    }
    return queryList;
}
