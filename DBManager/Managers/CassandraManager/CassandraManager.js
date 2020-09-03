const cassandra = require('cassandra-driver');
const columnTypesMap = require('./columnTypes');

class CassandraManager {
    constructor({user: username, password, host, port}) {
        const credentials = { username, password };
        const contactPoints = [ host ];
        const localDataCenter = 'dc1';
        const protocolOptions = { port };
        this.client = new cassandra.Client({contactPoints, protocolOptions, localDataCenter, credentials});
    }
  
    connect() {
        return this.client.connect();
    }
    
    disconnect() {
        return this.client.shutdown();
    }

    async getKeyspaceTableNames(keyspace) {
        const tables = await this.client.execute(`SELECT * FROM system_schema.tables WHERE keyspace_name = '${keyspace}'`);
        return tables.rows.map(t => t.table_name);
    }

    getKeyspaceTableSchema(keyspace, tableName) {
        return this.client.metadata.getTable(keyspace, tableName);
    }
}

module.exports = CassandraManager;