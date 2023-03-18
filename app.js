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



//profile storage
const profile_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/profiles')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));

    }
})
const upload = multer({ storage: profile_storage });

//upload storage specified
const storageTweet = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload2 = multer({ storage: storageTweet });


app.use(bodyParser.json());
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
    var sql = `select * from users where email = '${email}'`;
    var result = await getdata(sql);

    console.log("query result" + result);
    if (result.length != 0) {
        return res.send(`User Already registered! please Login <a href="/login">login</a>`)
    }

    var hashPass = await bcrypt.hash(pwd, 10);

    const activation_token = Math.random().toString(36).substring(2, 15);
    const activationLink = `http://localhost:3000/activate?token=${activation_token}`;
    console.log(email);
    var sql = `insert into users(username,email,password,activation_token) values('${name}','${email}','${hashPass}','${activation_token}')`;
    var result = await con.execute(sql);
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
        res.redirect("/login");
        // res.send("account activated")
    }
});

app.get("/login", (req, res) => {
    const token = req.cookies.jwtToken;
    if (token) {
        return res.redirect('/home');
    }
    res.render("login.ejs")
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    var varifyUser = `select * from users where email = '${email}'`;
    var result = await getdata(varifyUser);
    if (result.length == 0) {
        return res.send(`user not regitered please register <a href="/signup">register</a>`)
    }
    const data = result;
    console.log(data[0]);
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
});

//sql query function  
async function getdata(sql) {
    return new Promise((res, rej) => {
        con.query(sql, (err, data) => {
            if (err) throw err;
            res(data);
        })
    })
}




//Account Activation Api
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



//Home Page
app.get("/home", async (req, res) => {
    const jwtToken = req.cookies.jwtToken;
    if (!jwtToken) {
        return res.send(`you are not authorized register first <a href="/">register</a>`);
    }
    const sql = `SELECT * FROM tweets ORDER BY created_at DESC`;
    const tweets = await getdata(sql);
    const tokenData = jwt.verify(jwtToken, "user");
    const select = `select * from users where id = '${tokenData.id}'`;
    const selectData = await getdata(select);
    res.render("home", { tokenData, selectData, tweets })
})




// Profile Page
app.get("/profile", async (req, res) => {
    const jwtToken = req.cookies.jwtToken;
    if (!jwtToken) {
        return res.send(`you are not authorized register first <a href="/">register</a>`);
    }
    const tokenData = jwt.verify(jwtToken, "user");
    const select = `select * from users where id = '${tokenData.id}'`;
    const selectData = await getdata(select);
    res.render("profile", { tokenData, selectData })
})



// Edit Profile
app.get("/edit_profile", async (req, res) => {
    const jwtToken = req.cookies.jwtToken;
    if (!jwtToken) {
        return res.send(`you are not authorized register first <a href="/">register</a>`);
    }
    const tokenData = jwt.verify(jwtToken, "user");

    const select = `select * from users where id = '${tokenData.id}'`;
    const selectData = await getdata(select);
    res.render("edit_profile", { tokenData, selectData })
})


app.post("/edit_profile", upload.single('profile'), async (req, res) => {
    const jwtToken = req.cookies.jwtToken;
    if (!jwtToken) {
        return res.send(`you are not authorized register first <a href="/">register</a>`);
    }
    const tokenData = jwt.verify(jwtToken, "user");
    const { username, dob, bio, location } = req.body;
    var profileurl = 'http://127.0.0.1:3000/profiles/' + req.file.filename;

    var sql = `update users set username='${username}',profile_pic='${profileurl}',dob='${dob}',bio='${bio}',location='${location}' where id='${tokenData.id}'`
    var result = await getdata(sql);
    console.log(result)
    const select = `select * from users where id = '${tokenData.id}'`;
    const selectData = await getdata(select);

    res.render("edit_profile", { selectData })
})

//LogOut API
app.get("/logout", (req, res) => {
    res.clearCookie("jwtToken");
    res.redirect("/login")
});

//api for creating tweets
app.post("/tweet", upload2.single('media'), (req, res) => {
    const jwtToken = req.cookies.jwtToken;
    const tokenData = jwt.verify(jwtToken, "user");
    const id = tokenData.id;
    console.log("id" + id);
    const username = tokenData.username;
    const profile_pic = tokenData.profile_pic;
    console.log("profile pic " + profile_pic);
    const tweet_text = req.body.tweet_text;
    const file = req.file;
    const filename = file.originalname;
    const filepath = file.path;
    console.log(file);
    console.log(filename);
    console.log(filepath);
    var imgsrc = 'http://127.0.0.1:3000/uploads/' + req.file.filename;

    const sql = 'INSERT INTO tweets(user_id,tweet_text,media,username,profile_pic) VALUES (?,?,?,?,?)';
    const data = [id, tweet_text, imgsrc, username, profile_pic];
    con.query(sql, data);
    res.redirect("/home");
})

//likes
app.post('/like', async(req, res) => {
    var pid = req.body.pid;
    var user_id = req.body.uid;
    const jwtToken = req.cookies.jwtToken;
    const tokenData = jwt.verify(jwtToken, "user");
    const uid = tokenData.id;
    console.log(pid)
    console.log("logged in user",uid);

    //selecting either user has already likes or not
    var select = `select * from likes where uid='${uid}' and pid='${pid}'`;
    var data = await getdata(select);
    // console.log(data)

    //if empty then user does not has liked before so insert user values in database
    if(data==''){
        console.log("not found")
        var insert = `insert into likes (pid,uid,liked) values('${pid}','${uid}','1');`
        var i = await getdata(insert);
        var sql=`update tweets set likes = likes + 1  where id = '${pid}' and user_id='${user_id}'`;
             var result = await getdata(sql);
        console.log("inserted")
    }

    //update likes status in db
    else{
        console.log("found")
        var f =`select * from likes where pid='${pid}' and uid='${uid}'`;
        var u = await getdata(f);
            console.log("result data",u[0].liked)
         if(u[0].liked==0){
             console.log("like")
             var sql=`update tweets set likes = likes + 1 where id = '${pid}' and user_id='${user_id}'`;
             var result = await getdata(sql);
             var minus = `update likes set liked = 1 where pid='${pid}' and uid='${uid}'`;
             var done = await getdata(minus);
             console.log("liked")
             var q = `select likes from tweets where user_id='${user_id}' and id='${pid}'`;
             var query = await getdata(q);
             console.log(query[0].likes);
             res.json(query)
            //   res.redirect("/home");
         }
         if(u[0].liked==1){
             console.log("dislike")
             var sql=`update tweets set likes = likes - 1  where id = '${pid}' and user_id='${user_id}'`;
             var result = await getdata(sql);
             var minus = `update likes set liked = 0 where pid='${pid}' and uid='${uid}'`;
             var done = await getdata(minus); 
             var q = `select likes from tweets where user_id='${user_id}' and id='${pid}'`;
             var query = await getdata(q);
             console.log(query[0].likes);
             res.json(query)          

         }
       

      
    }  
   
});

app.listen(3000);
