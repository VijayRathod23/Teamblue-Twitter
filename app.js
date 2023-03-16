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
const path = require('path');
const { send } = require('process');
app.use(express.static(path.join(__dirname, "/public")));
const multer = require('multer');
app.use(bodyParser.json());
app.use(cookie());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//upload storage specified
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads')
    },
    filename:(req,file,cb)=>{
        console.log(file);
        cb(null,Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({storage:storage});



var conn = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "root",

    database: "twitter_clone"

});
conn.connect((err) => {

    if (err) throw err;

    console.log("success!")

})

//signup
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

    res.redirect("/home");
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


//login
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
    // var email = req.body.email;
    // var password = req.body.password;
    // conn.query(`select * from users where email='${email}';`, async (err, result) => {
    //     if (err) throw err;
    //     if (result[0].length == 0) {
    //         return res.send("user not found")
    //     }

    // conn.query(`select activated from users where email = '${email}';`,async(err,result)=>{   
    //     if(err) throw err;
    //     if(result[0]=='1'){
    //     }
    //     else{
    //         var activation_code = Math.random().toString(36).substring(2, 15);
    //         console.log(activation_code)
    //         conn.query(`update users set activation_token='${activation_code}' where email = '${email}'`);
    //         var activation_link = `http://localhost:3000/activepage?token='${activation_code}'`;
    //         res.send(` <a href=${activation_link}>activation link</a>`);
    //     }
    // })
    //     const data = result[0];

    //     let bpass = result[0].password;

    //     var match = await bcrypt.compare(password, bpass);

    //     if (!match) {

    //         res.send(`user not found`)
    //     }
    // })

  const { email, password } = req.body;
  var varifyUser = `select * from users where email = '${email}'`;
  var result = await getdata(varifyUser);
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

  //generating jwt token
  const jwtToken = jwt.sign(data[0], "user");
  res.cookie("jwtToken", jwtToken);

  res.redirect('/home');
})

//Home Page
app.get("/home",(req,res)=>{
    const jwtToken = req.cookies.jwtToken;
    if (!jwtToken) {
        return res.send(`you are not authorized register first <a href="/signup">register</a>`);
    }
    const tokenData = jwt.verify(jwtToken, "user");

    const sql = `select * from tweets`;
    
    conn.query (sql,(err,file)=>{
        for(let i=0; i<file.length; i++){
            const sql2 = `select username,email from users where user_id = ${file[i].user_id}`;
        }
        res.render("home",{tokenData,file});
    });
});

//api for creating tweets
app.post("/tweet",upload.single('media'),(req,res)=>{
    const jwtToken = req.cookies.jwtToken;
    const tokenData = jwt.verify(jwtToken, "user");
    const id = tokenData.id;
    console.log(id);

    const tweet_text = req.body.tweet_text;
    const file = req.file;
    const filename = file.originalname;
    const filepath = file.path;
    console.log(file);
    console.log(filename);
    console.log(filepath);
    var imgsrc = 'http://127.0.0.1:3000/uploads/' + req.file.filename;
  
    const sql = 'INSERT INTO tweets(user_id,tweet_text,media) VALUES (?, ?,?)';
    const data = [id,tweet_text,imgsrc];
    conn.query(sql,data);
  
    res.redirect("/home");
      
})


app.listen(3000);
