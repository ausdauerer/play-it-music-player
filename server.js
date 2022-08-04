const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const path = require("path");

var bodyParser = require('body-parser')

const app = express();

app.use(express.static(path.resolve(__dirname,"./client/build")));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://hnavalli:harshaabhi@cluster0.gz9mz.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connect = mongoose.connection;
connect.on("error", console.error.bind(console, "Error connecting to the mongoDB Database"));
connect.once("open", function () {
console.log("Connected successfully to mongoDB Database");
});


const multer  = require('multer')
const upload = multer({ dest: './songs' })
const trackModel = require('./models/track')
const User = require("./models/user");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.get('/allTracks',(req,res)=>{
  trackModel.find().lean().exec((err,data)=>{
    console.log(data)
  res.set({'Content-Type':'application/json'})
  res.status(200).send(data);
  res.end();
  });
})

app.get('/tracks/:Filename',(req,res)=>{
  const filePath = "./songs/"+req.params.Filename
  // const stat = fs.statSync(filePath)

  // res.setHeader("Content-Type","audio/mp3")
  // res.setHeader("Content-Length",stat.size)

  // fs.createReadStream(filePath).pipe(res)

  var stat = fs.statSync(filePath);
  var total = stat.size;
  if (req.headers.range) {
      var range = req.headers.range;
      var parts = range.replace(/bytes=/, "").split("-");
      var partialstart = parts[0];
      var partialend = parts[1];
      var start = parseInt(partialstart, 10);
      var end = partialend ? parseInt(partialend, 10) : total-1;
      var chunksize = (end-start)+1;
      var readStream = fs.createReadStream(filePath, {start: start, end: end});
      res.writeHead(206, {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
          'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
          'Content-Type': 'audio/mpeg'
      });
      readStream.pipe(res);
   } else {
      res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
      fs.createReadStream(filePath).pipe(res);
   }
})

app.post('/tracks',upload.single('uploaded_file'),(req, res) => {

    console.log("Recieved something");
    var track = new trackModel({
      username:req.body.username,
      actualFileName:req.file.originalname,
      storedFileName:req.file.filename,
      songName:req.body.songName
    });

    track.save();
    console.log("Metadata");
    console.log(req.body);
    console.log("Stored File Name");
    console.log(req.file.filename);
    console.log("Original name");
    console.log(req.file.originalname);
    console.log("Destination Directory");
    console.log(req.file.destination);

    res.end("Successfully submitted , click on the back button");
});

app.delete('/tracks/:Filename',(req,res)=>{
  const filePath = "./songs/"+req.params.Filename
  trackModel.deleteOne({storedFileName:req.params.Filename,username:req.body.username})
  .then(()=>{console.log(req.params.Filename+"Deleted mongoDB entry \n");})
  .catch(()=>{console.log("Sorry error while deleting");})
  fs.unlink(filePath,()=>{console.log("Successfully deleted file from disk \n");})
  res.end();
});

app.post("/register", (request, response) => {
  console.log(request.body.password,request.body.email);
  bcrypt.hash(request.body.password, 10)
  .then(
    (hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });
      user.save()
      .then((result) => {
        response.status(201).send({
          message: "User Created Successfully",
          result,
        });
      })
      .catch((error) => {
        response.status(500).send({
          message: "Error creating user",
          error,
        });
      });
    })
  .catch((e)=>{
    response.status(500).send({
      message: "Password was not hashed successfully",
      e,
    })
  });
});

app.post("/login", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user)=>{
      bcrypt.compare(request.body.password, user.password)
      .then((passwordCheck) => {

        // check if password matches
        if(!passwordCheck) {
          return response.status(400).send({
            message: "Passwords does not match",
          });
        }

      //   create JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email,
        },
        "RANDOM-TOKEN",
        { expiresIn: "24h" }
      );

       //   return success response
       response.status(200).send({
        message: "Login Successful",
        email: user.email,
        token,
      });
    })
    })

    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
  
})

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.listen(process.env.PORT || 3002, () => {
  console.log("Server is running at port "+process.env.PORT);
});

