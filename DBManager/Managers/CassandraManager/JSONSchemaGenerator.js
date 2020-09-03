class JSONSchemaGenerator {
    create(columns, tableName) {
        const type = 'object';
        const title = tableName;
        const properties = {};

        columns.forEach(({name, type}) => {
            properties[name] = this.convertCassandraTypeToJSONSchemaProperty(type);
        })

        return {type, title, properties};
    }

    convertCassandraTypeToJSONSchemaProperty(columnType) {
        if (columnType) {
            switch (columnType) {
                case 'boolean':
                    return {type:"boolean"}

                case 'decimal':
                case 'double':
                case 'float':
                    return {type:"number"}

                case 'bigint':
                case 'counter':
                case 'int':
                case 'smallint':
                case 'tinyint':
                case 'varint':
                    return {type:"integer"}

                case 'ascii':
                case 'blob':
                case 'date':
                case 'inet	':
                case 'text':
                case 'time':
                case 'timestamp':
                case 'timeuuid':
                case 'uuid':
                case 'varchar':
                    return {type:"string"}

                default:
                    return {}
            }
        } else {
            // work with non-basic types
            return {}
        }
    }
}

module.exports = new JSONSchemaGenerator();