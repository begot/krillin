/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index: function (req, res) {

        var fs = require('fs'),
            mysql = require('mysql'),
			util = require("util");

        var connection = mysql.createConnection({
            host: sails.config.connections.mysql.host,
            user: sails.config.connections.mysql.user,
            password: sails.config.connections.mysql.password,
			typeCast: false
        });
		
		function objToString(obj, ndeep) {
		  if(obj == null){ return String(obj); }
		  switch(typeof obj){
			case "string": return '"'+obj+'"';
			case "function": return obj.name || obj.toString();
			case "object":
			  var indent = Array(ndeep||1).join('\t'), isArray = Array.isArray(obj);
			  return '{['[+isArray] + Object.keys(obj).map(function(key){
				   return '\n\t' + indent + key + ': ' + objToString(obj[key], (ndeep||1)+1);
				 }).join(',') + '\n' + indent + '}]'[+isArray];
			default: return obj.toString();
		  }
		}

        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
		
		function convertToSails(column_type) {
			
			it = "";
		
			 if(column_type.match(/^(int|smallint|mediumint|bigint|float|double|decimal|tinyint).*$/i)) {
				it =  'integer';
			  }
			  else if(column_type.match(/^(date).*$/i)) {
				it = 'date'; 
			  }
			  else if(column_type.match(/^(time).*$/i)) {
				it = 'time';
			  }
			  else if(column_type.match(/^(datetime).*$/i)) {
				it = 'datetime';
			  }
			  else if(column_type.match(/^(char|varchar|tinytext|binary|varbinary|bit).*$/i)) {
				it = 'string';
			  }
			  else if(column_type.match(/^(mediumtext|longtext|text|tinyblob|mediumblob|longblob|blob).*$/i)) {
				it = 'text';
			  }
			  else { 
				throw new Error("Unhandled COLUMN_TYPE");
			  }
			  
			return it;
		};		

        function checkTable(tableSchema, databaseName) {

            fs.readdir('/root/krillin/api/controllers', function (err, controllers) {
                if (err) throw err;
				
                fs.readdir('/root/krillin/api/models', function (err, models) {
                    var currentModels = models;
                });

                fs.readFile('/root/krillin/api/controllers/DefaultController.js', function (err, defaultController) {

                    for (var c = 0; c < controllers.length; c++) {

                        if (controllers[c].split("Controller")[0] !== tableSchema) {
                            fs.writeFile("/root/krillin/api/controllers/" + tableSchema.capitalize() + "Controller.js", defaultController, function (){});
                        }

                    }

                    fs.readdir('api/models', function (err, models) {

                        if (models !== undefined) {

                            for (var m = 0; m < models.length; m++) {

                                if (models[m].split(".js")[0].capitalize !== tableSchema.capitalize()) {

                                    connection.query("USE " + databaseName, function (err, callback) {

                                        connection.query("SHOW COLUMNS FROM " + tableSchema, function (err, columns) {
											
											if(typeof columns === "object") {
												
												var modelStructure = "module.exports = { \r\n connection: 'mysql" + databaseName + "Connection', autoCreatedAt: false, autoUpdatedAt: false, \r\n attributes: { \r\n ";
											
												for (var c = 0; c < columns.length; c++) {
													
													modelStructure += "\r\n" + columns[c].Field + ': ';
													
													var initSplit = columns[c].Type.split(" "),
														column_type = initSplit[0].split("(")[0],
														converted = convertToSails(column_type);

													modelStructure += '{\r\n type: "' + converted + '"\r\n }';
													
													if(c != columns.length - 1) {
														modelStructure += ", \r\n";
													}
									
												}
												
												modelStructure += "}\r\n };";
												
												fs.writeFile("/root/krillin/api/models/" + tableSchema.capitalize() + ".js", modelStructure, function(err) {
													if(err) {
														throw new Error(err);
													}
												});
												
											}

                                        });

                                    });

                                }

                            }

                        }

                    });

                });

            });

        };

        connection.connect();

        connection.query("SHOW DATABASES", function (err, databases) {
            if (err) throw err;

            for (var d = 0; d < databases.length; d++) {
				
				if(require("/root/krillin/config/connections.js").connections["mysql" + databases[d].Database + "Connection"] !== "undefined") {
				
					require("/root/krillin/config/connections.js").connections["mysql" + databases[d].Database + "Connection"] = {
						adapter: 'sails-mysql',
						host: sails.config.connections.mysql.host,
						port: sails.config.connections.mysql.port,
						user: sails.config.connections.mysql.user,
						password: sails.config.connections.mysql.password,
						database: databases[d].Database
					};
				
				}
				
				var connectionsConfig = "module.exports.connections = " + objToString(require("/root/krillin/config/connections.js").connections) + ";";
				
				fs.writeFile("/root/krillin/config/connections.js", connectionsConfig, function (err) {
					if(err) {
						throw new Error(err);
					}
				});

                connection.query("SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA='" + databases[d].Database + "'", function (err, tables) {

                    if (err) throw err;

                    for (var t = 0; t < tables.length; t++) {

                        checkTable(tables[t].TABLE_NAME, tables[t].TABLE_SCHEMA);

                    }

                });

            }

        });

    }

};
