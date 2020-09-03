const cassandra = require('cassandra-driver');
const config = require('./config');

const credentials = { username: config.user, password: config.password };
const contactPoints = [ config.host ];
const localDataCenter = 'dc1';
const protocolOptions = { port: config.port };
const client = new cassandra.Client({contactPoints, protocolOptions, localDataCenter, credentials});

const keyspace = 'videodb';

client.connect().then(async () => {
    console.log('Connected');

    const tables = await client.execute(`SELECT * FROM system_schema.tables WHERE keyspace_name = '${keyspace}'`);
    const tableNames = tables.rows.map(t => t.table_name);
    console.log(tableNames);

    return client.shutdown();
})
.catch((err) => {
    console.error('There was an error when connecting', err.message);
    return client.shutdown();
})
