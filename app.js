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
var session = require('express-session');


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


//session
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));


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
    const availabletkn = req.session.user;
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
    const token = req.session.user;
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
    // const jwtToken = jwt.sign(data[0], "user");
    // res.cookie("jwtToken", jwtToken);

    //seting session
    req.session.user = data[0];
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
    console.log("session");
    console.log(req.session.user);
    const jwtToken = req.session.user;
    if (!jwtToken) {
        return res.send(`you are not authorized register first <a href="/signup">register</a>`);
    }
    const sql = `SELECT * FROM tweets ORDER BY created_at DESC`;
    const tweets = await getdata(sql);
    const tokenData = req.session.user;
    const select = `select * from users where id = '${tokenData.id}'`;
    const selectData = await getdata(select);

    // harshupdate
    const sql1 = `select * from users limit 5;`;
    const user_data = await getdata(sql1);
    console.log("all user data", user_data)

    //...................retweet count .......................
    var count = new Array();
    for (var i = 0; i < tweets.length; i++) {

        const sql_retweet = `select count(id) as cnt from retweets where tweet_id = '${tweets[i].id}'`;
        const retweet_cnt = await getdata(sql_retweet);
        count.push(retweet_cnt[0].cnt);

    }

    console.log(count);


    res.render("home", { tokenData, selectData, tweets, user_data, count })

})


// Profile Page
app.get("/profile", async (req, res) => {
    const jwtToken = req.session.user;
    if (!jwtToken) {
        return res.send(`you are not authorized register first <a href="/">register</a>`);
    }
    const tokenData = req.session.user;
    const select = `select * from users where id = '${tokenData.id}'`;
    const selectData = await getdata(select);

    //..........select retweeted
    const select_retweet = `select * from retweets where user_id = '${tokenData.id}'`;
    const retweet_data = await getdata(select_retweet);

    //..............if any retweet found for particular user
    if (retweet_data[0]) {


        const retweeted_tweet_id = retweet_data[0].tweet_id;
        const tweet_select = `select * from tweets where id = '${retweeted_tweet_id}'`;
        const tweet_data = await getdata(tweet_select);

        const sql = `SELECT * FROM tweets ORDER BY created_at DESC`;
        const tweets = await getdata(sql);
        //...................retweet count .......................
        var count = new Array();
        for (var i = 0; i < tweets.length; i++) {

            const sql_retweet = `select count(id) as cnt from retweets where tweet_id = '${tweets[i].id}'`;
            const retweet_cnt = await getdata(sql_retweet);
            count.push(retweet_cnt[0].cnt);

        }


        res.render("profile", { tokenData, selectData, tweet_data, count })
    }
    else {
        res.render("profile", { tokenData, selectData, tweet_data: 0 })

    }



})



// Edit Profile
app.get("/edit_profile", async (req, res) => {
    const jwtToken = req.session.user;
    if (!jwtToken) {
        return res.send(`you are not authorized register first <a href="/">register</a>`);
    }
    const tokenData = req.session.user;

    const select = `select * from users where id = '${tokenData.id}'`;
    const selectData = await getdata(select);
    res.render("edit_profile", { tokenData, selectData })
})


app.post("/edit_profile", upload.single('profile'), async (req, res) => {
    const jwtToken = req.session.user;
    if (!jwtToken) {
        return res.send(`you are not authorized register first <a href="/signup">register</a>`);
    }
    const tokenData = req.session.user;
    var updateTime = new Date();
    const { username, dob, bio, location } = req.body;
    if (req.file) {
        var profileurl = 'http://127.0.0.1:3000/profiles/' + req.file.filename;
        var sql = `update users set username='${username}',profile_pic='${profileurl}',dob='${dob}',bio='${bio}',location='${location}',updated_at='${updateTime}'  where id='${tokenData.id}'`
        var result = await getdata(sql);
        console.log(result)
    } else {
        var sql = `update users set username='${username}',dob='${dob}',bio='${bio}',location='${location}' where id='${tokenData.id}'`
        var result = await getdata(sql);
    }
    const select = `select * from users where id = '${tokenData.id}'`;
    const selectData = await getdata(select);

    res.render("edit_profile", { selectData })
})

//LogOut API
app.get("/logout", (req, res) => {
    req.session.destroy(session);
    res.redirect("/login")
});

//api for creating tweets
app.post("/tweet", upload2.single('media'), async (req, res) => {
    const jwtToken = req.session.user;
    const tokenData = req.session.user;
    const id = tokenData.id;
    const username = tokenData.username;
    const profile_pic = tokenData.profile_pic;
    console.log("profile pic");
    const tweet_text = req.body.tweet_text;

    if (req.file) {
        const file = req.file;
        const filename = file.originalname;
        const filepath = file.path;
        var imgsrc = 'http://127.0.0.1:3000/uploads/' + req.file.filename;
        const sql = 'INSERT INTO tweets(user_id,tweet_text,media,username,profile_pic) VALUES (?,?,?,?,?)';
        const data = [id, tweet_text, imgsrc, username, profile_pic];
        con.query(sql, data);
    } else {
        const sql = 'INSERT INTO tweets(user_id,tweet_text,username,profile_pic) VALUES (?,?,?,?)';
        const data = [id, tweet_text, username, profile_pic];
        con.query(sql, data);
    }

    res.redirect("/home");
});


//likes
app.post('/tweets/:id/like', (req, res) => {
    const tweetId = req.params.id;
    con.query(
        'UPDATE tweets SET likes = likes + 1 WHERE id = ?',
        [tweetId],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error liking tweet');
            } else {
                res.redirect('/home');
            }
        }
    );
});

//search
app.get('/search', async (req, res) => {
    var search = req.query.search;
    const sql2 = `select * from users where username LIKE '${search}%'`;
    const search_data = await getdata(sql2);
    console.log("userdata", search_data);
    res.json(search_data)

})

//likes api
//likes
app.post('/like', async (req, res) => {
    var pid = req.body.pid;
    var user_id = req.body.uid;
    const jwtToken = req.session.user;
    const tokenData = req.session.user;
    const uid = tokenData.id;
    console.log(pid)
    console.log("logged in user", uid);

    //selecting either user has already likes or not
    var select = `select * from likes where uid='${uid}' and pid='${pid}'`;
    var data = await getdata(select);
    // console.log(data)

    //if empty then user does not has liked before so insert user values in database
    if (data == '') {
        console.log("not found")
        var insert = `insert into likes (pid,uid,liked) values('${pid}','${uid}','1');`
        var i = await getdata(insert);
        var sql = `update tweets set likes = likes + 1  where id = '${pid}' and user_id='${user_id}'`;
        var result = await getdata(sql);
        console.log("inserted")
    }
    //update likes status in db
    else {
        console.log("found")
        var f = `select * from likes where pid='${pid}' and uid='${uid}'`;
        var u = await getdata(f);
        console.log("result data", u[0].liked)
        if (u[0].liked == 0) {
            console.log("like")
            var sql = `update tweets set likes = likes + 1 where id = '${pid}' and user_id='${user_id}'`;
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
        if (u[0].liked == 1) {
            console.log("dislike")
            var sql = `update tweets set likes = likes - 1  where id = '${pid}' and user_id='${user_id}'`;
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


//....Retweet
//..............................................called after retweet icon is pressed..................
app.get("/retweet", (req, res) => {

    var tweet_id = req.query.tweet_id;  //...................................got tweet_id............
    //const jwtToken = req.session.user;
    const tokenData = req.session.user;
    //const uid = tokenData.id;

    if (tokenData) {
        //const tokenData = jwt.verify(jwtToken, "user");
        const user_id = tokenData.id; // ..............................got user_id from token............

        con.query(`select id from retweets where user_id='${user_id}' and tweet_id='${tweet_id}'`, (err, retweet_status) => {



            //.................................check if already retweeted by this user then delete


            if (retweet_status[0]) {

                var del = getdata(`delete from retweets where user_id='${user_id}' and tweet_id='${tweet_id}'`);
                con.query(`select count(id) as cnt from retweets where  tweet_id='${tweet_id}'`, (err, result) => {
                    if (err) throw err;

                    var count = result[0].cnt;
                    res.json({ count });

                });

            }

            //.....................................else insert into retweets.....................
            else {

                var sql = `insert into retweets (user_id, tweet_id) value ('${user_id}','${tweet_id}')`;

                //.....................................insert into retweets..........................

                con.query(sql, (err, result) => {
                    if (err) throw err;


                    //...................................
                    con.query(`select count(id) as cnt from retweets where tweet_id='${tweet_id}'`, (err, result) => {
                        if (err) throw err;

                        var count = result[0].cnt;
                        res.json({ count });

                    });

                })

            }

        });

    }


    else {
        res.redirect("/login");
    }
})



app.listen(3000);
