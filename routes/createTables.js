require('dotenv').config();
const express = require('express');
const router = express.Router();

const db = require("D:/WEB_DEV/intership_mysql/db.js");

router.get('/EmployeeTable', (req, res)=>{
    let sql =  `CREATE TABLE Employee(
        id int AUTO_INCREMENT,
        Email VARCHAR(255) NOT NULL,
        Name VARCHAR(255) NOT NULL,
        JobTitle VARCHAR(255) NOT NULL,
        PhoneNumber VARCHAR(10) NOT NULL,
        Address VARCHAR(255) NOT NULL,
        City VARCHAR(255) NOT NULL,
        State VARCHAR(255) NOT NULL,
        PRIMARY KEY (Email)),
        constraint CK_Employee_PhoneNumber check (PhoneNumber like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')`;

    db.query(sql, (err, result)=>{
        if(err) {
            throw err;
        }
        console.log(result);
        res.send('Posts table created....');
    })
});

router.get('/EmergencyContact1', (req, res)=>{
    let sql =  `CREATE TABLE PrimaryEmergencyContact(
        id int AUTO_INCREMENT,
        Email VARCHAR(255) ,
        EmergencyContact1 VARCHAR(255) NOT NULL,
        EmergencyPh1 VARCHAR(10) NOT NULL,
        Relationship1 VARCHAR(255),
        PRIMARY KEY (Email),
        FOREIGN KEY (Email) REFERENCES Employee(Email)),
        constraint CK_PrimaryEmergencyContact_EmergencyPh1 check (EmergencyPh1 like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')`;
    db.query(sql, (err, result)=>{
        if(err) {
            throw err;
        }
        console.log(result);
        res.send('Primary Emergency Contact table created....');
    })
});

router.get('/EmergencyContact2', (req, res)=>{
    let sql =  `CREATE TABLE SecondaryEmergencyContact(
        id int AUTO_INCREMENT,
        Email VARCHAR(255) ,
        EmergencyContact2 VARCHAR(255) NOT NULL,
        EmergencyPh2 VARCHAR(10) NOT NULL,
        Relationship2 VARCHAR(255),
        PRIMARY KEY (Email),
        FOREIGN KEY (Email) REFERENCES Employee(Email)),
        constraint CK_SecondaryEmergencyContact_EmergencyPh2 check (EmergencyPh2 like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')`;
    db.query(sql, (err, result)=>{
        if(err) {
            throw err;
        }
        console.log(result);
        res.send('Secondary Emergency Contact table created....');
    })
});

module.exports = router;