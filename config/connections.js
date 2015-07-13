module.exports.connections = {
	localDiskDb: {
		adapter: "sails-disk"
	},
	mysql: {
		adapter: "sails-mysql",
		host: "localhost",
		port: 3306,
		user: "root",
		password: "Highland100?"
	},
	someMongodbServer: {
		adapter: "sails-mongo",
		host: "localhost",
		port: 27017
	},
	somePostgresqlServer: {
		adapter: "sails-postgresql",
		host: "YOUR_POSTGRES_SERVER_HOSTNAME_OR_IP_ADDRESS",
		user: "YOUR_POSTGRES_USER",
		password: "YOUR_POSTGRES_PASSWORD",
		database: "YOUR_POSTGRES_DB"
	},
	mysqlinformation_schemaConnection: {
		adapter: "sails-mysql",
		host: "localhost",
		port: 3306,
		user: "root",
		password: "Highland100?",
		database: "information_schema"
	},
	mysqldnbmediaConnection: {
		adapter: "sails-mysql",
		host: "localhost",
		port: 3306,
		user: "root",
		password: "Highland100?",
		database: "dnbmedia"
	},
	mysqlmysqlConnection: {
		adapter: "sails-mysql",
		host: "localhost",
		port: 3306,
		user: "root",
		password: "Highland100?",
		database: "mysql"
	},
	mysqlperformance_schemaConnection: {
		adapter: "sails-mysql",
		host: "localhost",
		port: 3306,
		user: "root",
		password: "Highland100?",
		database: "performance_schema"
	},
	mysqlphpmyadminConnection: {
		adapter: "sails-mysql",
		host: "localhost",
		port: 3306,
		user: "root",
		password: "Highland100?",
		database: "phpmyadmin"
	},
	mysqlwordpressConnection: {
		adapter: "sails-mysql",
		host: "localhost",
		port: 3306,
		user: "root",
		password: "Highland100?",
		database: "wordpress"
	}
};