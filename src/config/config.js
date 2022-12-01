const { Sequelize } = require("sequelize");
require("dotenv").config();



const {
	PGDATABASE,
	PGHOST,
	PGPORT,
	PGUSER,
	PGPASSWORD,
	LOCAL_USER,
	LOCAL_PASSWORD,
	LOCAL_HOST,
	DB_NAME,
  } = process.env;
  // const User = require("../models/User.js");
  // const Properties = require("../models/Property.js");
  
  let sequelize =
	process.env.NODE_ENV === "production"
	  ? new Sequelize({
		  database: PGDATABASE,
		  dialect: "postgres",
		  host: PGHOST,
		  port: PGPORT,
		  username: PGUSER,
		  password: PGPASSWORD,
		  pool: {
			max: 3,
			min: 1,
			idle: 10000,
		  },
		  dialectOptions: { ssl: {
			require: true,
			// Ref.: https://github.com/brianc/node-postgres/issues/2009
			rejectUnauthorized: false,
		  },
		  keepAlive: true,
		},
		ssl: true,
	  })
	: new Sequelize(
		`postgres://${LOCAL_USER}:${LOCAL_PASSWORD}@${LOCAL_HOST}/${DB_NAME}`,
		{
		  logging: false, // set to console.log to see the raw SQL queries
		  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
		}) 
  

module.exports = sequelize;
