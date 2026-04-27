const { Pool } = require('pg')

const pool = new Pool({
    user: "crm_project",
    password: "crm123crm",
    host: "localhost",
    port: 5432,
    database: "crm_db"
})

module.exports = pool;