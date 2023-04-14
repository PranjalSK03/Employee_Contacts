require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PW,
    database: 'employee'
});

db.connect((err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log("connected to database!")
});

module.exports = db;

