require('dotenv').config();
const express = require('express');
const router = express.Router();

const db = require("D:/WEB_DEV/intership_mysql/db.js");

router.get("/", (req, res)=>{
    let sql = `SELECT * FROM Employee
     NATURAL JOIN PrimaryEmergencyContact 
        NATURAL JOIN SecondaryEmergencyContact;`;
    let query = db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        res.send(result);
    })
});

router.get("/:email", (req, res)=>{
    let sql = `
        SELECT * FROM (
        SELECT * FROM Employee
        NATURAL JOIN PrimaryEmergencyContact
        NATURAL JOIN SecondaryEmergencyContact) as A
        WHERE A.Email = '${req.params.email}'`;

    let query = db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        res.send(result);
    })
});

router.post("/", (req, res)=>{
    console.log(req.body);
    let text = "";
    let details = {
        Email: req.body.email,
        Name: req.body.empName, 
        JobTitle: req.body.jobTitle,
        PhoneNumber: req.body.phNo,
        Address: req.body.address,
        City: req.body.city,
        State: req.body.state
    };
    let sql = 'INSERT INTO Employee SET ?';
    let query = db.query(sql, details, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        text = 'Employe details entered successfully';
        if( req.body.emgPh1 == '' && req.body.emgPh2 == '')
            res.send(text);
    });


    if(req.body.emgPh1 != ''){
        let emgDetails1 = {
            Email: req.body.email,
            EmergencyContact1: req.body.emgContact1, 
            Relationship1: req.body.relationship1,
            EmergencyPh1: req.body.emgPh1,
        };
        let sql = 'INSERT INTO PrimaryEmergencyContact SET ?';
        db.query(sql,emgDetails1, (err, result)=>{
            if(err){
                throw err;
            }
            console.log(result);
            text += '\n Inserted successfully in Primary Emergency contact';
            if( req.body.emgPh2 == '')
                res.send(text);
        });
    }

    if(req.body.emgPh2 != ''){
        let emgDetails2 = {
            Email: req.body.email,
            EmergencyContact2: req.body.emgContact2, 
            Relationship2: req.body.relationship2,
            EmergencyPh2: req.body.emgPh2,
        };
        let sql = 'INSERT INTO SecondaryEmergencyContact SET ?';
        db.query(sql,emgDetails2, (err, result)=>{
            if(err){
                throw err;
            }
            console.log(result);
            text += '\n Inserted successfully in Secondary Emergency contact';
            res.send(text);
        });
    }
    

});

router.patch("/:email", (req, res)=>{
    let sql = `UPDATE Employee SET Email= '${req.params.email}'`;
    if(req.body.empName != null){
        sql += `,Name =` + req.body.empName;
    }
    if(req.body.jobTitle != null){
        sql += `,JobTitle =` + req.body.jobTitle;
    }
    if(req.body.phNo != null){
        sql += `,PhoneNumber = `+ req.body.phNo + `CHECK (PhoneNumber NOT LIKE '%^[0-9]%')`;
    }
    if(req.body.address != null){
        sql += `,Address = ` + req.body.address;
    }
    if(req.body.city != null){
        sql += `,City= ` + req.body.city;
    }
    if(req.body.state != null){
        sql += `,State= ` + req.body.state;
    }

    sql += ` WHERE Email= '${req.params.email}'`;

    let query = db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        res.write(result);
    })
    res.write("\n" + queryv + "\n");



    let sql1 = `UPDATE Employee SET Email= '${req.params.email}'`;

    if(req.body.emgContact1 != null){
        sql1 += `,EmergencyContact1 = ` + req.body.emgContact1;
    }
    if(req.body.relationship1 != null){
        sql1 += `,Relationship1 = ` + req.body.relationship1;
    }
    if(req.body.emgPh1 != null){
        sql1 += `,EmergencyPh1 = ` + req.body.emgPh1 + `CHECK (EmergencyPh1 NOT LIKE '%^[0-9]%')`;
    }

    sql1 += ` WHERE Email= '${req.params.email}'`;

    let query1 = db.query(sql1, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        res.write(result);
    })
    res.write("\n" + query1 + "\n");


    let sql2 = `UPDATE Employee SET Email= '${req.params.email}'`;

    if(req.body.emgContact1 != null){
        sql2 += `,EmergencyContact2 = ` + req.body.emgContact2;
    }
    if(req.body.relationship1 != null){
        sql2 += `,Relationship2 = ` + req.body.relationship2;
    }
    if(req.body.emgPh1 != null){
        sql2 += `,EmergencyPh2 = ` + req.body.emgPh2  + + `CHECK (EmergencyPh2 NOT LIKE '%^[0-9]%')`;
    }

    sql2 += ` WHERE Email= '${req.params.email}'`;

    let query2 = db.query(sql2, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        res.write(result);
    })
    res.write("\n" + query2 + "\n");


    res.send();

});

router.delete("/:email", (req, res)=>{

    let sql = `
        DELETE FROM SecondaryEmergencyContact
        WHERE Email= '${req.params.email}'`;

    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
    })
    
    sql = `
        DELETE FROM PrimaryEmergencyContact
        WHERE Email= '${req.params.email}'`;

    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
    })

    sql = `
        DELETE FROM Employee
        WHERE Email= '${req.params.email}'`;

    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        res.send("Deleted successfully");
    })


});


module.exports = router;