require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');// could have used express.json()

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const createTable = require('./routes/createTables');
app.use("/createTable", createTable);

const employeeCRUD = require('./routes/employee');
app.use("/employee", employeeCRUD);


app.listen(3000, ()=>{
    console.log("server up and running on port 3000")
})