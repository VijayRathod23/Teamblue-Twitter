const mysql = require('mysql2');
 
const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"twitter_clone"
});

conn.connect((err)=>{
    if(err) throw err;
    console.log("connected to twitter db!");
})

module.exports={conn};