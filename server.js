require('dotenv').config();
const express = require('express');


const app = express();

const createTable = require('./routes/createTables');
app.use("/createTable", createTable);



app.listen(3000, ()=>{
    console.log("server up and running on port 3000")
})