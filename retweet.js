var express = require('express');
const connect = require('http2');
var app = express();
var mysql = require('mysql2');
const { query, response } = require('express');
var bodyParser = require('body-parser');
// var bcrypt = require('bcrypt');
// const { type } = require('os');
// const { match } = require('assert');
// const jwt = require('jsonwebtoken');
// const cookie = require('cookie-parser');
const { Console } = require('console');
const path = require('path');
const { send } = require('process');
app.use(express.static(path.join(__dirname, "/public")));
// const multer = require('multer');

app.use(bodyParser.json());
// app.use(cookie());
// app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


var con = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "root",

    database: "Twitter_Blue"

});
con.connect((err) => {

    if (err) throw err;

    console.log("success!")

})


//................................RETWEET.......add this fuctionality in tweet page where retweet symblo is display.................................................................
app.get("/test", (req, res) => {
    //..........................................original query is select id from retweet where tweet_id="tweet_id" 
    con.query("select count(id) as cnt from retweets", (err, result) => {
        if (err) throw err;
        var count = result[0].cnt;
        res.render("retweet", { count })

    });
})



//..............................................called after retweet icon is pressed..................
app.get("/retweet", (req, res) => {

    var tweet_id = req.query.tweet_id;  //...................................got tweet_id............
   var user_id = 22;         //..................................for testing..........            
   //................................In this file token is not get...............
    // const jwtToken = req.cookies.jwtToken;

    // if (jwtToken) {
    //     const tokenData = jwt.verify(jwtToken, "user");
    //     const user_id = tokenData.id; // ..............................got user_id from token............

       
       
        con.query(`select id from retweets where user_id='${user_id}' and tweet_id='${tweet_id}'`, (err, retweet_status) => {



            //.................................check if already retweeted by this user then delete


            if (retweet_status[0]) {

                var del = getdata(`delete from retweets where user_id='${user_id}' and tweet_id='${tweet_id}'`);
                con.query("select count(id) as cnt from retweets", (err, result) => {
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
                    con.query("select count(id) as cnt from retweets", (err, result) => {
                        if (err) throw err;

                        var count = result[0].cnt;
                        res.json({ count });

                    });

                })

            }

        });

    }


    // else {
    //     res.redirect("/login");
    // }
    // }
)


app.listen(3000);