import express from "express";
const router = express.Router();
//import { v4 as uuidv4 } from 'uuid';

//import data from '../../data.json';
// import {getUsers} from './queries'

type T = {

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
    user: 'barleen',
    host: 'localhost',
    database: 'barleen',
    password: '123456',
    port: 5432,
})

//SENDS ALL MEMBERS
router.get("/", (req, res) => {

    pool.query('SELECT * FROM users ORDER BY id ASC', (error: any, results: any) => {
        if (error) {
            throw error
        }
        console.log(results.rows)
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
        console.log(results.rows)
        res.status(200).json(results.rows)
    })

})

//ADD MEMBER
router.post("/", (req, res) => {

    console.log("add member")
    const newMember: T = {

        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        address: req.body.address


    }


    if (!newMember.firstName || !newMember.lastName || !newMember.email || !newMember.phoneNumber || (newMember.role < 0 || newMember.role > 2) || !newMember.address) {
        console.log(newMember)
        res.status(400).json({ message: `Give Correct Input` })
    }
    if (newMember.phoneNumber.length !== 10) {
        res.status(400).json({ message: `Give Correct Input` })
    }
    else {

        pool.query(`SELECT id FROM users where "phoneNumber" ='${newMember.phoneNumber}'`, (error: any, result: any) => {
            if (error) {
                throw error
            }
            if (result.rows.length !== 0) {
                console.log(result);
                res.status(400).json({ message: `User Already Exists` })
            }
            else {

                const query = `INSERT into users ("firstName", "middleName", "lastName", email, "phoneNumber", role, address) VALUES ('${newMember.firstName}','${newMember.middleName}','${newMember.lastName}','${newMember.email}','${newMember.phoneNumber}',${newMember.role},'${newMember.address}');`;
                pool.query(query, (error: any, results: any) => {
                    if (error) {
                        throw error
                    }

                    res.status(200).json({ message: `Added User Successfully !`, addedRecord: newMember })
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

            res.status(400).json({ message: `User Does Not Exists` })
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
                res.status(400).json({ message: `Give Correct Input` })
                return
            }
            const query = `UPDATE users SET "firstName"='${firstName}', "middleName"='${middleName}', "lastName"='${lastName}', email='${email}', "phoneNumber"='${phoneNumber}', role=${role}, address='${address}' where id=${id};`;

            console.log(query);
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
                    }
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

            res.status(400).json({ message: `User Does Not Exists` })
        }
        else {

            const query = `DELETE from users where id=${id};`;
            console.log(query);
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