import express from "express";
const router = express.Router();
import * as dotenv from 'dotenv';

dotenv.config({path:__dirname+'/../../.env'});

type User = {

    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: number;
    address: string;
}

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.USER_NAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
})

//SENDS ALL MEMBERS
router.get("/", (req, res) => {

    pool.query('SELECT * FROM users ORDER BY id ASC', (error: any, results: any) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })


});

//SEND A SPECIFIC MEMEBER 
router.get("/:id", (req, res) => {

    let id = req.params.id;
    pool.query(`SELECT * FROM users where id =${id}`, (error: any, results: any) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })

})

//ADD MEMBER
router.post("/", (req, res) => {

    const newMember: User = {

        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        address: req.body.address


    }


    if (!newMember.firstName || !newMember.lastName || !newMember.email || !newMember.phoneNumber || (newMember.role < 0 || newMember.role > 2) || !newMember.address) {
        
        res.status(400).json({ message: `Give Correct Input` })
        return;
    }
    if (newMember.phoneNumber.length !== 10) {
        res.status(400).json({ message: `Phone Number must be of 10 digits` })
        return;
    }
    else {

        pool.query(`SELECT id FROM users where "phoneNumber" ='${newMember.phoneNumber}'`, (error: any, result: any) => {
            if (error) {
                throw error
            }
            if (result.rows.length !== 0) {
                //400 - client error - sent invalid user info
                res.status(400).json({ message: `User Already Exists` })
                return;
                
            }
            else {

                const query = `INSERT into users ("firstName", "middleName", "lastName", email, "phoneNumber", role, address) VALUES ('${newMember.firstName}','${newMember.middleName}','${newMember.lastName}','${newMember.email}','${newMember.phoneNumber}',${newMember.role},'${newMember.address}');`;
                pool.query(query, (error: any, results: any) => {
                    if (error) {
                        throw error
                    }

                    res.status(201).json({ message: `Added User Successfully !`, addedRecord: newMember })
                })
            }
        })
    }
})

//EDIT MEMBER

router.put('/:id', (req, res) => {
    let id = req.params.id;

    pool.query(`SELECT * FROM users where id =${id}`, (error: any, result: any) => {
        if (error) {
            throw error
        }
        if (result.rows.length === 0) {
            //404 - Requested for resource which doesn't exist
            res.status(404).json({ message: `User Does Not Exists`,success:0 })
            return;
        }
        else {
            let firstName = req.body.firstName;
            let middleName = req.body.middleName;
            let lastName = req.body.lastName;
            let email = req.body.email;
            let phoneNumber = req.body.phoneNumber;
            let role = req.body.role;
            let address = req.body.address;
            if (phoneNumber.length !== 10) {
                res.status(400).json({ message: `Phone Number must be of 10 digits`,success:0 })
                return
            }
            const query = `UPDATE users SET "firstName"='${firstName}', "middleName"='${middleName}', "lastName"='${lastName}', email='${email}', "phoneNumber"='${phoneNumber}', role=${role}, address='${address}' where id=${id};`;

            pool.query(query, (error: any, result: any) => {
                if (error) {
                    throw error
                }
                res.status(200).json({
                    message: `Updated Row with id = ${id} Successfully`, updatedRecord: {
                        id: id,
                        firstName: firstName,
                        middleName: middleName,
                        lastName: lastName,
                        email: email,
                        phoneNumber: phoneNumber,
                        role: role,
                        address: address
                    },
                    success:1
                })
            })
        }
    })
})

//DELETE MEMBER
router.delete('/:id', (req, res) => {

    let id = req.params.id;
    pool.query(`SELECT * FROM users where id =${id}`, (error: any, result: any) => {
        if (error) {
            throw error
        }
        if (result.rows.length === 0) {
            //request for a resource that does not exist- 404
            res.status(404).json({ message: `User Does Not Exist` })
            return;
        }
        else {

            const query = `DELETE from users where id=${id};`;
            pool.query(query, (error: any, result: any) => {
                if (error) {
                    throw error
                }

                res.status(200).json({ message: `Deleted Row with id = ${id} Successfully !` })
            })
        }
    })

})

module.exports = router;