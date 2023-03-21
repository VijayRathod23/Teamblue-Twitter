var express = require('express');
const connect = require('http2');
var app = express();
var mysql = require('mysql2');
const { query, response } = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
const { type } = require('os');
const { match } = require('assert');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const { Console } = require('console');
const path = require('path')
app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.json());
app.use(express.static('asset'))
app.use(cookie());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var con = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "root",

    database: "twitter_clone"

});
con.connect((err) => {

    if (err) throw err;

    console.log("success!")

})
app.get("/", (req, res) => {

    var istkn = req.cookies.jwtToken;

    if (istkn) {

        res.redirect("/homepage")
    }
    res.render("login.ejs")

});
app.get("/login", (req, res) => {

    // var istkn = req.cookies.jwtToken;

    // if (istkn) {

    //     res.redirect("/homepage")

    // }

    res.render("login.ejs")
})
app.get('/activepage?', (req, res) => {

    var token = req.query.token;

    con.query(`UPDATE users SET activated = '1' WHERE activation_token=${token};`, (err, result) => {

        if (err) throw err;

        console.log(result)

        if (result.affectedRows == 0) {

            res.send(`failed to activate`)
        }

        else {

            res.render("login");
            
        }
    })


})
app.post("/login", async (req, res) => {
    var email = req.body.email;

    var password = req.body.password;

    var h1 = await bcrypt.hash(password, 10);

    console.log(h1)

    con.query(`select * from users where email='${email}';`, async (err, result) => {

        if (err) throw err;

        if (result[0].length == 0) {

            res.send("user not found")
        }
    con.query(`select activated from users where email = '${email}';`,async(err,result)=>{
        
        if(err) throw err;

        if(result[0]=='1'){

        }
        else{
            var activation_code = Math.random().toString(36).substring(2, 15);

            console.log(activation_code)

            con.query(`update users set activation_token='${activation_code}' where email = '${email}'`);

            var activation_link = `http://localhost:3000/activepage?token='${activation_code}'`;

            res.send(` <a href=${activation_link}>activation link</a>`);
        }
    })
        const data = result[0];

        let bpass = result[0].password;

        var match = await bcrypt.compare(password, bpass);

        if (!match) {

            res.send(`user not found`)
        }
    })
})
app.listen(3000);
