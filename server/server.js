const express = require("express")
const app = express()

app.use(express.json())

const cors = require("cors")
app.use(cors())

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const mongoose = require("mongoose")
const username = "*****",
      password = "*****",
      database = "*****";
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.5ngb9jm.mongodb.net/${database}?retryWrites=true&w=majority`)


const UserModel = require('./models/Users')

app.get("/users",async(req,res)=>{
    const users = await UserModel.find();
    res.json(users)
})

app.post("/createUser",async(req,res)=>{
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.json(req.body)
})



const AdminModel = require('./models/Admins')
app.post("/register", async(req,res)=>{
    const {username,password} = req.body 
    const admin = await AdminModel.findOne({username})
    
    admin && res.json({message: "Admin already exists!"})

    const hashedPassword = bcrypt.hashSync(password, 10)

    const newAdmin = new AdminModel({ username,
        password: hashedPassword
    });

    await newAdmin.save();

    return res.json({message: "Admin created succefully "})

})

app.post("/login" , async(req,res)=> {
    const {username, password} = req.body

    const admin = await AdminModel.findOne({username})
    !admin && res.json({message: "Admin doesn't exist!"})

    const isPasswordValid = await bcrypt.compare(password , admin.password)
    ! isPasswordValid && res.json({message: "Username or Password is not correct"})

    const token = jwt.sign({id: admin._id}, "ABARHANE")

    return res.json({token , adminID: admin._id})

})

app.listen("3001", ()=> {
    console.log("Server Worrrk !!")
})