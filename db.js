module.exports.DB = class DB {


  constructor(options) {
    options = options || {};
    this.state = {};
    this.IS_DB_LOADED = 'IS_DB_LOADED';
    this.DB_PATH = options.DB_PATH;
    this.SCHEMA_PATH = options.SCHEMA_PATH;
    this.SCHEMA_TEST_PATH = options.SCHEMA_TEST_PATH;
    this.SQL = options.SQL;
    this.fs = options.fs;

    // init the  global db var
    this.db = new SQL.Database(this.getFile(this.DB_PATH));
    // set db state
    this.setDBState(this.IS_DB_LOADED, (this.db != null));
    if (this.isFirstLoad() || !this.IS_DB_LOADED) {
      this.IS_DB_LOADED = this.initDB();
      
      console.log(`DataBase is Ready...${this.DB_PATH}`)
    }
  }


  getFile(filePath) {
    var file = null;
    try {
      file = this.fs.readFileSync(filePath);
    } catch (e) {
      this.fs.writeFile(filePath, "", function (err) {
        if (err) {
          alert("An error ocurred creating the file " + err.message)
        }

        alert("The file has been succesfully saved");
      });/*
      if(file == null || fs.existsSync(file) == false) {
        logdb('Creating DB file.' + filePath);
        fs.openSync(filePath, 'w');
      }*/
    }
    return file;
  }

  setDBState(param, val) {
    //state[param] = val;
  }

  getDBState(param) {
    return this.state[param];
  }

  exec(query) {
    var success = false;
    var results;
    try {
      results = this.db.exec(query);
    } catch (e) {
      this.logdb("Error executing query: " + query);
      this.logdb(e);
    }
    console.log(results);
    return success;
  }
  isFirstLoad() {
    var results = null;
    try {
      results = this.db.exec(this.getFile(this.SCHEMA_TEST_PATH).toString());
    } catch (e) {
      this.logdb(e);
      results = null;
    }
    this.IS_FIRST_LOAD = (results == null);
    return this.IS_FIRST_LOAD;
  }

  /**
  * Initialises the DB from default schema files
  * Returns false if db.run returns a null Database object
  */
  initDB() {
    this.logdb("Initializing the DB from default schema files");
    // run schema script
    // run returns Database object
    return this.db.run(this.getFile(this.SCHEMA_PATH).toString()) != null;
  }

  saveDB() {
    var data = new Buffer(this.db.export());
    this.fs.writeFileSync(this.DB_PATH, data)
  }

  queryDB(query, params) {
    //db = db || this.db;
    var stmt = this.db.prepare(query);
    var results = [];
    try {
      stmt.bind(params);
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
    } catch (e) {
      results = [];
      this.logdb(e);
    } finally {
      stmt.free();
    }
    return results;
  }

  logdb(msg) {
    console.error(msg);
  }

}
