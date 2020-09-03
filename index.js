const fs = require('fs');
const DBManager = require('./DBManager/DBManager');
const config = require('./config');

const dbName = 'videodb';
const dbManager = new DBManager('cassandra', config).create();

dbManager.connect()
.then(async () => {
    const tableNames = await dbManager.getTableNames(dbName);
    const tableJSONSchemas = []; 

    for (const tableName of tableNames) {
        const tableJSONSchema = await dbManager.createTableJSONSchema(dbName, tableName);
        tableJSONSchemas.push(tableJSONSchema);
    };
        
    const result = JSON.stringify({schemas: tableJSONSchemas});
    await fs.writeFile('result.json', result, 'utf8', () => console.log('Tables were success exported as JSON schemas'));

    dbManager.disconnect();
})
.catch((err) => {
    console.error('There was an error when connecting', err.message);
    dbManager.disconnect();
})
