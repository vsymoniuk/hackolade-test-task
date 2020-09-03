const cassandra = require('cassandra-driver');
const schemaGenerator = require('./JSONSchemaGenerator');
const columnTypesMap = require('./columnTypes');
const isJSON = require('../../../public/helpers/isJSON')

class CassandraManager {
    constructor({user: username, password, host, port}) {
        const credentials = { username, password };
        const contactPoints = [ host ];
        const localDataCenter = 'dc1';
        const protocolOptions = { port };
        this.client = new cassandra.Client({contactPoints, protocolOptions, localDataCenter, credentials});
        this.schemaGenerator = schemaGenerator;
    }
  
    connect() {
        return this.client.connect();
    }
    
    disconnect() {
        return this.client.shutdown();
    }

    async getTableNames(keyspace) {
        const tables = await this.client.execute(`SELECT * FROM system_schema.tables WHERE keyspace_name = '${keyspace}'`);
        return tables.rows.map(t => t.table_name);
    }

    async getSerializedDataKeys(keyspace, tableName) {
        const query = `select * from  ${keyspace}.${tableName}  limit 1;`
        const response = await this.client.execute(query);
        const dataSample = response.rows[0] || {};

        return Object.keys(dataSample).filter(key => isJSON(dataSample[key]))
    }

    async createTableJSONSchema(keyspace, tableName) {
        const table = await this.client.metadata.getTable(keyspace, tableName);
        const columns = table.columns.map(({name, type}) => ({name, type: this.describeType(type) }));

        const keysOfSerializedData = await this.getSerializedDataKeys(keyspace, tableName)
        const schema = this.schemaGenerator.create(columns, tableName, keysOfSerializedData);
        return schema;
    }

    describeType(type) {
        const innerTypes = type.info;
        if(innerTypes) {
            const result = {
                subtype: this.describeType({code: type.code}),
                types: [],
            };
            if(innerTypes.length) {
                innerTypes.forEach(type => result.types.push(this.describeType(type)))
            } else {
                result.types.push(this.describeType(innerTypes))
            }
            return result;
        }
        return columnTypesMap.get(type.code);
    }
}

module.exports = CassandraManager;