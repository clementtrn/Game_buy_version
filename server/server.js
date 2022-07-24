const express = require("express");
const http = require('http').createServer(express)
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const myRoute = require('./routes/Route')
//Connexion à la base de donnée MANGO TODO
// mongoose
//   .connect("mongodb://localhost/db")
//   .then(() => {
//     console.log("Connected to mongoDB");
//   })
//   .catch((e) => {
//     console.log("Error while DB connecting");
//     console.log(e);
//   });


const app = express();

const urlencodedParser = bodyParser.urlencoded({
  extended: true
});
app.use(urlencodedParser);
app.use(require('cors')())
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const router = express.Router();
app.use("/", router);
require("./controllers/controller")(router);

const port = 4000;
const server = app.listen(port, () => console.log('Server listenning on port '+port));


const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling']
    // credentials: true
},
  maxHttpBufferSize: 1e8,
  pingTimeout: 60000,
  allowEIO3: true
}).listen(server)

io.on('connection',socket=>{
  

  socket.on("connecti",data=>{
    const d = JSON.parse(data)
    socket.join("session"+d.session+"equipe"+d.equipe)
  })

  socket.on('changementTour',(data)=>{
      let d
      try {
         d = JSON.parse(data)
      } catch (error) {
         d = data
      }
      console.log("session"+d["session"]+"equipe"+d["equipe"])
      io.to("session"+d["session"]+"equipe"+d["equipe"]).emit('changementTour',d)
  })
//   socket.on('revealHabitant',(data)=>{
//     console.log("revealHabitant")
//     io.emit('revealHabitant',data)
// })
socket.on('startStopPartie',(data)=>{
  // console.log("startStopPartie")
  io.emit('startStopPartie',data)
})

socket.on('disconnectUsers',(data)=>{
  // console.log("startStopPartie")
  io.emit('disconnectUsers',data)
})

})

