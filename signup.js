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

    var hashPass = await bcrypt.hash(pwd, 10);

    const activation_token = Math.random().toString(36).substring(2, 15);
    const activationLink = `http://localhost:3000/activate?token=${activation_token}`;
    console.log(email);
    var sql = `insert into users(username,email,password,activation_token) values('${name}','${email}','${hashPass}','${activation_token}')`;
    var result = await conn.execute(sql);
    res.send(`user register successfully!  <a href="${activationLink}"> Activate Account </a>`);
});

app.get("/login", (req, res) => {

    var availabletkn = req.cookies.jwtToken;

    // if (availabletkn) {

    //     res.redirect("/homepage")

    // }

    res.render("login.ejs")
})
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
        //   res.redirect("/login");
        res.send("account activated")
    }
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    var varifyUser = `select * from users where email = '${email}'`;
    var result = await getdata(varifyUser);
    console.log("login result");
    console.log(result);
    if (result.length == 0) {
        return res.send(`user not regitered please register <a href="/">register</a>`)
    }
    const data = result;
    //comparing password
    let bpass = data[0].password;
    console.log("bpass", bpass)
    var match = await bcrypt.compare(password, bpass);
    console.log(match);
    if (!match) {
        return res.send(`wrong user or password!`)
    }
    const activationLink = `http://localhost:3000/activate?token=${data[0].activation_token}`;
    if (data[0].activated == 0) {
        return res.render("activate", { activationLink });
    }
    console.log(data[0]);

    //generating jwt token
    const jwtToken = jwt.sign(data[0], "user");
    res.cookie("jwtToken", jwtToken);

    res.redirect('/home');
})

app.get("/home", (req, res) => {

    const jwtToken = req.cookies.jwtToken;
    if (!jwtToken) {
        return res.send(`you are not authorized register first <a href="/">register</a>`);
    }
    const tokenData = jwt.verify(jwtToken, "user");
    // res.render("home", { tokenData });

})


app.get("/finduser", async (req, res) => {
    const email = req.query.email;
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
