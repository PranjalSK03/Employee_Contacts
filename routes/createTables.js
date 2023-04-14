require('dotenv').config();
const express = require('express');
const router = express.Router();

const db = require("D:/WEB_DEV/intership_mysql/db.js");

//since in sample form ther is no Emp_id given hence making uniqueness through Email
//creating the employee schema
router.get('/EmployeeTable', (req, res)=>{
    let sql =  `CREATE TABLE Employee(
        Email VARCHAR(255) NOT NULL,
        Name VARCHAR(255) NOT NULL,
        JobTitle VARCHAR(255) NOT NULL,
        PhoneNumber VARCHAR(10) NOT NULL,
        Address VARCHAR(255) NOT NULL,
        City VARCHAR(255) NOT NULL,
        State VARCHAR(255) NOT NULL,
        PRIMARY KEY (Email),
        CONSTRAINT CK_PhoneNumber CHECK (PhoneNumber NOT LIKE '%[^0-9]%')
        )`;

    db.query(sql, (err, result)=>{
        if(err) {
            throw err;
        }
        console.log(result);
        res.send('Employee table created....');
    })
});

//separate emergency contact
router.get('/EmergencyContact1', (req, res)=>{
    let sql =  `CREATE TABLE PrimaryEmergencyContact(
        Email VARCHAR(255) ,
        EmergencyContact1 VARCHAR(255) NOT NULL,
        EmergencyPh1 VARCHAR(10) NOT NULL,
        Relationship1 VARCHAR(255),
        PRIMARY KEY (Email),
        FOREIGN KEY (Email) REFERENCES Employee(Email),
        constraint CK_EmergencyPh1 CHECK (EmergencyPh1 NOT LIKE '%[^0-9]%'))`;
    db.query(sql, (err, result)=>{
        if(err) {
            throw err;
        }
        console.log(result);
        res.send('Primary Emergency Contact table created....');
    })
});

//separate emergency contact 2
router.get('/EmergencyContact2', (req, res)=>{
    let sql =  `CREATE TABLE SecondaryEmergencyContact(
        Email VARCHAR(255) ,
        EmergencyContact2 VARCHAR(255) NOT NULL,
        EmergencyPh2 VARCHAR(10) NOT NULL,
        Relationship2 VARCHAR(255),
        PRIMARY KEY (Email),
        FOREIGN KEY (Email) REFERENCES Employee(Email),
        constraint CK_EmergencyPh2 CHECK (EmergencyPh2 NOT LIKE '%[^0-9]%'))`;
    db.query(sql, (err, result)=>{
        if(err) {
            throw err;
        }
        console.log(result);
        res.send('Secondary Emergency Contact table created....');
    })
});

module.exports = router;