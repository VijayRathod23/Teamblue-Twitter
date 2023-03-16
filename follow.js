var express = require ("express");
var app = express();
var sql = require('mysql2')
const util = require('util');

var bodyparser = require('body-parser');
//const { query } = require("express");

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

//var json = JSON.parse()
app.set('view engine', 'ejs');

console.log("ok")

var con = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",

    
  });
//promisify the query 
  const query = util.promisify(con.query).bind(con);


  con.connect(function(err) {
    
    
    console.log(' connection created');
    //console.log(err)
   
  });

  
//--------------------user data------------------------//

  app.get('/user',async(req,res)=>{

    console.log(' rendering user')
    res.render("user")
  })
app.post('/user',async(req,res)=>{

  var userid = req.body.userid ;
  var username = req.body.username;

  var result = await query(`INSERT INTO twitter.user (id, name) VALUES ('${userid}', '${username}');
  `)

  console.log("userdata-->",userid,"--",username,"--",result)

  res.send("user value stored")
  
})

//-------------------------follow-------------------------------------------------//

app.get('/follow',async(req,res)=>{

  var result = await query(`SELECT id,name FROM twitter.user;`)

  console.log(' rendering follow',result)
  res.render("follow",{result})
})

app.get('/postfollow',async(req,res)=>{

  var id = req.query.id;

  console.log('insertid',id)

  var result = await query (`INSERT INTO twitter.follow ( user_id) VALUES ( '${id}');
  `)
  
  res.json(result)
})

//---------------------follower---------------------------------------------------------//

app.get('/postfollower',async(req,res)=>{

var result = await query(`SELECT f_id FROM twitter.follow where user_id=1;`)
var id = req.query.id;

  console.log('insertid',id)

  var result = await query(`SELECT f_id FROM twitter.follow where user_id='${id}';`)
  
  res.json(result)

})



  //-------------------------------------------------listen-----------------------------------------//
app.listen(8080,(err)=>{
  console.log("server start...")
})