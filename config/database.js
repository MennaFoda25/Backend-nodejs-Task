const mongoose = require('mongoose');

const dbConnection = ()=>{
    // Connect with DB
    mongoose.connect(process.env.DB_URL).then((conn)=>{
        console.log(`Database Connected: ${conn.connection.host}`)
    })
    // .catch((err)=>{
    //     console.error(`Database connection error: ${err.message}`);
    //     process.exit(1); // Exit the process if DB connection fails
    // })
}

module.exports = dbConnection