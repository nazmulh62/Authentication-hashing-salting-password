// hashing + salting password
require("dotenv").config();
const express = require("express");
const cors  = require("cors");
const mongoose = require("mongoose");
//console.log(md5("message"));

const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
const dbURL = process.env.MONGO_URL;
mongoose
.connect(dbURL)
.then(() =>{
    console.log('mongodb atlas is connected');
})
.catch((error) => {
    console.log(error);
    process.exit(1);
});


app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/",(req, res) => {
    res.sendFile(__dirname + "/./views/index.html");
});

// User Registration
app.post("/register", async(req, res) => {
    try {
        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
            const newUser = new User({
              email: req.body.email,
              password: hash,
            });
            await newUser.save();
            res.status(201).json(newUser);
        });       

    } catch (error) {
       res.status(500).json(error.message); 
    }
});

// User Loin
app.post("/login", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email: email });
        if(user){
          // Load hash from your password DB.
            bcrypt.compare(password, user.password, function(err, result) {
               if(result === true){
                res.status(200).json({ status: "valid user"});
               }
            });
        }else{
            res.status(404).json({ status: "Not valid user"});
            //console.log("User Not Found");
        }
    } catch (error) {
       res.status(200).json(error.message); 
    }
});

// Route not found error
app.use((req, res, next) => {
    res.status(404).json({
        message: "route not found",
    });
});

app.listen(PORT, () => {
console.log(`Server is running at http://localhost:${PORT}`);
});