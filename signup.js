const ejs = require('ejs');
const express = require('express');
const bodyParser = require('body-parser');
var app = express();
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var cookies = require('cookie-parser');
const path = require('path');
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookies());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set("view engine", "ejs");
const mysql = require('mysql2');
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "twitter_clone"
});

conn.connect((err) => {
    if (err) throw err;
    console.log("connected to twitter db!");
})
app.listen(`3000`);


app.get("/signup", function (req, res) { //signup api
    const availabletkn = req.cookies.jwtToken;
    if (availabletkn) {
        res.redirect("/home");
    }
    res.render('signup')
});


//user registration
app.post('/signup', async (req, res) => {
    const { name, email, pwd } = req.body;
    // var sql = `select * from users where email = '${email}'`;
    // var result = await getdata(sql);
  
    // if (result.length != 0) {
    //     return res.send(`User Already registered! please Login <a href="/login">login</a>`)
    // }
  
    var hashPass = await bcrypt.hash(pwd, 10);
    
    const activation_token = Math.random().toString(36).substring(2, 15);
    const activationLink = `http://localhost:3000/activate?token=${activation_token}`;
    var sql = `insert into users(username,email,password,activation_token) values('${name}','${email}','${hashPass}','${activation_token}')`;
    var result = await conn.execute(sql);
    // console.log(result)
  
    //activation
    
    res.send(`user register successfully!  <a href="${activationLink}"> Activate Account </a>`);
});

app.get("/activate?", async (req, res) => {
    const actKey = req.query.token;
    sql = `update users set activated = 1 where activation_token = "${actKey}"`;
    var result = await getdata(sql);
    var json = JSON.stringify(result);
    console.log("activate result " + json)
    var arr = JSON.parse(json);
    if (arr.affectedRows == 0) {
      res.send("invalid activation link");
    } else {
      res.send("Your account activated");
    }
  });


  app.get("/finduser", async (req, res) => {
    const email = req.query.email;
    console.log(email)
    var sql = `select email from users where email = '${email}'`;
    var result = await getdata(sql)

    if (result == "") {
        res.json({ exists: false });
    } else {
        res.json({ exists: true });
    }

})
async function getdata(sql) { //sql query function  
    return new Promise((res, rej) => {
        conn.query(sql, (err, data) => {
            if (err) throw err;
            res(data);
        })
    })
}




// app.post("/signup", async (req, res) => { //sign api
//     const { name, email, pwd } = req.body;
//     console.log(req.body);

//     var hash = await bcrypt.hash(pwd, 10)
//     const activation_token = Math.random().toString(36).substring(2, 15);

//     var sql = `insert into twitter_clone.userss (usersname, email ,password ,created_at) values ('${name}','${email}','${hash}', NOW()) `
//     var result = await getdata(sql)

// })


// app.get("/activate", async function (req, res) { //activate api for activate users
//     const string = req.query.activate
//     console.log(string)

//     sql = `UPDATE job_application_db.registration_tbl SET activationstatus = '1' WHERE activationlink ='${string}';`
//     let data = await getdata(sql);
//     res.render("login");

// });