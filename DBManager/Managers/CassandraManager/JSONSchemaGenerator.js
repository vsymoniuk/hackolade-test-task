class JSONSchemaGenerator {
    create(columns, tableName, keysOfSerializedData) {
        this.keysOfSerializedData = keysOfSerializedData;
        const type = 'object';
        const title = tableName;
        const properties = {};

        columns.forEach(({name, type}) => {
            this.columnName = name;

            properties[name] = this.convertCassandraTypeToJSONSchemaProperty(type);
        })

        return {type, title, properties};
    }

    convertCassandraTypeToJSONSchemaProperty(columnType) {
        if (typeof columnType === 'string') {
            // processing basic types
            switch (columnType) {
                case 'boolean':
                    return {type:"boolean"};

                case 'decimal':
                case 'double':
                case 'float':
                    return {type:"number"};

                case 'bigint':
                case 'counter':
                case 'int':
                case 'smallint':
                case 'tinyint':
                case 'varint':
                    return {type:"integer"};

                case 'ascii':
                case 'blob':
                case 'date':
                case 'inet	':
                case 'text':
                case 'time':
                case 'timestamp':
                case 'timeuuid':
                case 'uuid':
                case 'varchar': {
                    if(this.keysOfSerializedData.includes(this.columnName)) {
                        // process serialized data
                    }
                    return {type:"string"};
                }

                default:
                    return {};
            }
        } else {
            // processing non-basic types
            switch (columnType.subtype) {
                case 'list':
                    return {
                        type: 'array',
                        items: this.convertCassandraTypeToJSONSchemaProperty(columnType.types[0]),
                    }

                case 'tuple':
                    return {
                        type: 'array',
                        items: columnType.types.map(t => {
                            return this.convertCassandraTypeToJSONSchemaProperty(t);
                        }),
                    };
                    
                case 'set':
                    return {
                        type: 'array',
                        items: this.convertCassandraTypeToJSONSchemaProperty(columnType.types[0]),
                        uniqueItems: true,
                    }; 

                case 'map':
                    return {
                        type: 'object',
                        properties: {
                            key: this.convertCassandraTypeToJSONSchemaProperty(columnType.types[0]),
                            value: this.convertCassandraTypeToJSONSchemaProperty(columnType.types[1]),
                        }
                    }; 
            
                default:
                    return {}
            }
        }
    }
}

module.exports = new JSONSchemaGenerator();