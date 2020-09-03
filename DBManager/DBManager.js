const CassandraManager = require('./Managers/CassandraManager/CassandraManager')

class DBManager {
    constructor(type, config) {
      this.type = type;
      this.config = config;
    }
  
    create() {
      let manager = null;
      switch (this.type) {
        case 'cassandra': {
          manager = new CassandraManager(this.config);
          break;
        }
        default:
          manager = null;
      }
      return manager;
    }
}

module.exports = DBManager;