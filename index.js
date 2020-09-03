const DBManager = require('./DBManager/DBManager');
const config = require('./config');

const keyspace = 'videodb';
const dbManager = new DBManager('cassandra', config).create();

dbManager.connect()
.then(async () => {
    console.log('Connected');

    const tableNames = await dbManager.getKeyspaceTableNames(keyspace);
    
    for (const tableName of tableNames) {
        const tableSchema = await dbManager.getKeyspaceTableSchema(keyspace, tableName);
        console.log('NEW TABLE Table', tableSchema.name);
        tableSchema.columns.forEach((column) => {
            console.log(column);
            console.log();
        });
    };

    dbManager.disconnect();
})
.catch((err) => {
    console.error('There was an error when connecting', err.message);
    dbManager.disconnect();
})
