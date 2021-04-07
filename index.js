var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');

var app = express();
app.use(cors());// html portu ile node portu farklıdır ve olası hataları önlemek için kullanırız.
app.use(bodyParser.json());

let db = new sqlite3.Database('./db/recipes.db',sqlite3.OPEN_READWRITE,(err) => {
  if(err){
    console.log(err.message);
  }
  console.log('connected to database\n');
});

app.get('/',function(request,response){
  // response.send("Anasayfa");
});

app.get('/api',function(req,res){
  db.all("select * from categories", (err, rows)=>{ 
    res.status(200).send(rows);
  })
});

app.get("/yemekler/:id",function(req,res){
  var a = req.params.id;
  // console.log(req.params.id);
  db.all("select * from eats where category_id=?",[a],(err, rows)=>{
    res.status(200).send(rows);
  });
});

app.get("/tarifler/:id",function(req,res){
  var a = req.params.id;
  // console.log(req.params.id);
  db.all("select * from eats where eat_id=?",[a],(err, rows)=>{
    res.status(200).send(rows);
  });
});

app.post("/favorited",function(req,res){
  // console.log(req.body);
  var a = req.body.eat_id;
  var q = `UPDATE eats SET fav_count=fav_count+1 where eat_id=${a}`;
  var name_query = `select eat_name from eats where eat_id=${a}`;
  var eats = `select * from eats where eat_id=${a}`;
    db.run(q,function(err){
      if(err){
        console.log(err);
      }
    });
    db.get(name_query,(err,row) =>{
      io.emit("recipe_favorited", (row));
    })
    db.all(eats,(err,row) => {
      if(err){
        console.log(err);
      }
      res.status(200).send(row);
    });
})

app.listen(1234,()=>{ // Aynı zamanda socket.io portudur
  console.log("1234 portu dinleniyor...");
});

/*
* WEBSOCKET
*/
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5501",
    methods: ["GET", "POST"],
  }
});

io.on("connection", function (socket) {

  socket.on("favorited", function(msg){
    // console.log(msg);
    var q = `UPDATE eats SET fav_count=fav_count+1 where eat_id=${msg.eat_id}`;
    var query = `select * from eats where eat_id=${msg.eat_id}`;
    db.run(q,function(err){
      if(err){
        console.log(err);
      }
    });
    db.get(query,(err,row) =>{
      if(err){
        console.log(err);
      }
      io.emit("recipe_favorited", (row));
    })
  });
});
httpServer.listen(3001);
