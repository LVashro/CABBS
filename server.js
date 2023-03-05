const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const { xss } = require('express-xss-sanitizer');
const { sanitize } = require('express-xss-sanitizer');
const app = express();
const fs = require('fs');
var nonce = require("nonce-generator");
nonce = nonce(15);

const Thread = require("./models/Thread");

const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json({limit:'1kb'}));
app.use(bodyParser.urlencoded({extended: true, limit:'1kb'}));
app.use(xss());

mongoose
  .connect("mongodb+srv://c2070:planet.kanazawa-it@cluster0.zmwqsds.mongodb.net/threads?retryWrites=true&w=majority")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

//getメソッド MongoDBにあるすべてのthreadを得る
app.get("/api/v1/threads", async (req, res) => {
  try {
    const allThreads = await Thread.find({});
    res.status(200).json(allThreads);
  } catch (err) {
    console.log(err);
  }
});

// app.get("/thread.html", async (req, res) => {
//   try {
//     console.log("work");
//     sanitize(req.query.name);
//   } catch (err) {
//     console.log(err);
//   }
// });

//MongoDBにthread titleを入力する
app.post("/ap1/v1/thread", async (req, res) => {
  try {
    console.log("post");
   // console.log(req.title);
    const createThread = await Thread.create(req.body);
    res.status(200).json(createThread);
  } catch (err) {
    console.log(err);
  }
});

/////////////

/////////////
app.listen(PORT, console.log("server is started"));
