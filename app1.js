require("dotenv").config();
const express = require("express");
const cors  =require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const userModel = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
const dbURL = process.env.MONGO_URL;
mongoose.connect(dbURL).then(() =>{
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
    //const {email, password} = req.body; // Data Fetch from user
    //res.status(201).json({ email, password });
    try {
        const newUser = new userModel(req.body);
        await newUser.save(); // New User Data Save in DB
        res.status(201).json(newUser);
    } catch (error) {
       res.status(500).json(error.message); 
    }
});

// User Loin
app.post("/login", async(req, res) => {
    //res.status(200).json({message: "User login Successfully"});
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email });
        if(user && user.password === password){
            res.status(200).json({ status: "valid user"});
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