const queries = require('../queries/signup')
const pool = require('../config/db')
const { hashPassword } = require('../utils/hashPasswordHandler')
//get all users
const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getAllUsers, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.rows);
            }
        });
    });
};
//create user
const createUser = (first_name, last_name, email, phone_number, company_name, industry_type, country_region, password, role) => {
    const hashedPassword = hashPassword(password)
    return new Promise((resolve, reject) => {
        pool.query(
            queries.signup,
            [first_name, last_name, email, phone_number, company_name, industry_type, country_region, hashedPassword, role],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(result.rows);
                    const userId = result.rows[0].id;
                    resolve(userId);
                }
            },
        );
    });
};
//get user by first name
const getUserByName = (first_name) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getUserByName, [first_name], (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result.rows)
            }
        })
    })
}
//get user by email
const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.getUserByEmail, [email], (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result.rows)
            }
        })
    })
}
module.exports = { createUser, getUserByName,getUserByEmail,getAllUsers }