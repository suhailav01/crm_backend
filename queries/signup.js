const signup = 'INSERT INTO users (first_name,last_name,email,phone_number,company_name,industry_type,country_region,password,role)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)RETURNING *'
const getUserByName = 'SELECT * FROM users WHERE first_name = $1'
const getUserByEmail = 'SELECT * FROM users WHERE email = $1'
const getAllUsers = 'SELECT * FROM users'
module.exports = {signup,getUserByName,getUserByEmail,getAllUsers}