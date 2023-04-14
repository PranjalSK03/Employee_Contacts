const express = require('express');
const router = express.Router();

const db = require("D:/WEB_DEV/intership_mysql/db.js");

//implemented with pagination with the route as http://localhost:3000/employee/<no_of_items_wanted_on_page>/<no_of_the_page>
//for getting all employee details - page wise
router.get("/:noOfItems/:page", (req, res)=>{
    const pageSize = parseInt(req.params.noOfItems); // number of items per page
    const currentPage = req.params.page || 1; 
    const startIndex = (currentPage - 1) * pageSize; 
    let sql = `
        SELECT * FROM (
        SELECT * FROM Employee
        NATURAL JOIN PrimaryEmergencyContact
        UNION
        SELECT * FROM Employee
        NATURAL JOIN SecondaryEmergencyContact) as A
        ORDER BY A.EMAIL ASC LIMIT ?, ?`;

    const pageParameters = [startIndex, pageSize];

    db.query(sql, pageParameters, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        res.send(result);
    })
});

//for getting a employee details
router.get("/:email", (req, res)=>{
    let sql = `
        SELECT * FROM (
        SELECT * FROM Employee
        NATURAL JOIN PrimaryEmergencyContact
        UNION
        NATURAL JOIN SecondaryEmergencyContact) as A
        WHERE A.Email = '${req.params.email}'`;

    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        res.send(result);
    })
});


//for making any entry to the database
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
    db.query(sql, details, (err, result)=>{
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
    }

    
    

});


//update the employee details
router.patch("/:email", (req, res)=>{
    let sql = `UPDATE Employee SET Email= '${req.params.email}'`;
    if(req.body.empName != null){
        sql += `,Name = '` + req.body.empName + `'`;
    }
    if(req.body.jobTitle != null){
        sql += `,JobTitle = '` + req.body.jobTitle + `'`;
    }
    if(req.body.phNo != null){
        sql += `,PhoneNumber = '`+ req.body.phNo + `' CHECK (PhoneNumber NOT LIKE '%^[0-9]%')`;
    }
    if(req.body.address != null){
        sql += `,Address = '` + req.body.address + `'`;
    }
    if(req.body.city != null){
        sql += `,City= '` + req.body.city + `'`;
    }
    if(req.body.state != null){
        sql += `,State= '` + req.body.state + `'`;
    }

    sql += ` WHERE Email= '${req.params.email}'`;

    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        if(req.body.emgContact1 == null && req.body.emgContact2 == null && req.body.relationship1 == null && req.body.relationship2 == null && req.body.emgPh1 == null && req.body.emgPh2 == null)
            res.send("updated successfully");
    });

    let flag1 = 0;

    //if no entry in data base then make entry else update  
    let sql1 = `
        SELECT * FROM PrimaryEmergencyContact
        WHERE Email = '${req.params.email}'`;

    db.query(sql1, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        if(result.length === 0){
            flag1 = 1;
        }
    });

    if(flag1 === 1){
        if(req.body.emgPh1 != ''){
            let emgDetails1 = {
                Email: req.params.email,
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
    }
    else{
        sql1 = `UPDATE PrimaryEmergencyContact SET Email= '${req.params.email}'`;

        if(req.body.emgContact1 != null){
            sql1 += `,EmergencyContact1 = '` + req.body.emgContact1 + `'`;
        }
        if(req.body.relationship1 != null){
            sql1 += `,Relationship1 = '` + req.body.relationship1 + `'`;
        }
        if(req.body.emgPh1 != null){
            sql1 += `,EmergencyPh1 = '` + req.body.emgPh1 + `CHECK (EmergencyPh1 NOT LIKE '%^[0-9]%')`;
        }

        sql1 += ` WHERE Email= '${req.params.email}'`;

        db.query(sql1, (err, result)=>{
            if(err){
                throw err;
            }
            console.log(result);
            if(req.body.emgContact2 == null && req.body.relationship2 == null && req.body.emgPh2 == null)
                res.send("updated successfully");
        })
    }


    //if no entry in data base then make entry else update
    let flag2 = 0 ;

    let sql2 = `
        SELECT * FROM SecondaryEmergencyContact
        WHERE Email = '${req.params.email}'`;

    db.query(sql2, (err, result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        if(result.length === 0)
            flag2 = 1;
    });
    if(flag2 === 1 && flag1 === 1){
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
    }
    else{
        sql2 = `UPDATE SecondaryEmergencyContact SET Email= '${req.params.email}'`;

        if(req.body.emgContact1 != null){
            sql2 += `,EmergencyContact2 = '` + req.body.emgContact2 + `'`;
        }
        if(req.body.relationship1 != null){
            sql2 += `,Relationship2 = '` + req.body.relationship2 + `'`;
        }
        if(req.body.emgPh1 != null){
            sql2 += `,EmergencyPh2 = ` + req.body.emgPh2  + + `CHECK (EmergencyPh2 NOT LIKE '%^[0-9]%')`;
        }

        sql2 += ` WHERE Email= '${req.params.email}'`;

        db.query(sql2, (err, result)=>{
            if(err){
                throw err;
            }
            console.log(result);
            res.send("updated successfully");
        })
    }

});


//delete the employee contact
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