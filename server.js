const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { json } = require('stream/consumers');
const { createCipheriv } = require('crypto');
const app = express();

//middleware
app.use(express.json());
app.use(express.static('frontend'));
//By default, if you use express.static('frontend'), Express looks for a file named index.html
// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/jobPortalDB')
    .then(() => console.log("Database Connected"))
    .catch(err => console.error("Connection Error:", err));
//user schema
const userSchema = mongoose.Schema({
    name:String,
    phoneNumber:Number,
    nationality:String,
    gmail:String,
    userId:String,
    password:String
});
const user = mongoose.model('user' , userSchema);
//job schema
const jobSchema = mongoose.Schema({
    jobTitle:String,
    company:String,
    salary:Number,
    location:String,
    jobType:String,
    skills:String
});
const job = mongoose.model('job',jobSchema);

app.post('/login' , async(req,res) => {
    const {userId , password} = req.body;//extract data from body
    try{
        const us = await user.findOne({userId: userId});
        if(!us){
            return res.status(401).json({success: false , message: "User not found"});
        }
        if(us.password === password){
            res.status(200).json({
                success: true,
                message: "login sucessful",
                redirect: "/dashboard.html"
            });
        }else{
            res.status(401).json({success: false , message: "password incorrect"});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({success: false , message: "server error occured"});
    }
});

app.post('/register' , async (req,res) => {
    try{
    const newUser = await user.create(req.body);
    if(newUser){
        res.status(200).json({
            success: true,
            message: "u sucessfully registered", 
            redirect:"/login.html"});
    }else{
        res.status(401).json({success: false, message: "unsucessfully registerd"});
    }}catch(err){
        console.error(err);
        res.status(500).json({success: false , message: "server error occured"});
    }
});

app.post('/jobPost', async(req,res) => {
    try{
    const newJob = await job.create(req.body);
    if(newJob){
        res.status(201).json({success:true , message: "succesful to create", directLink:"jobs.html"});
    }else{
        res.status(401).json({success:false , message: "Failed to create"});
    }}catch(err){
        console.error(err);
        res.status(500).json({success: false , message: err});
    }
});

app.get('/jobs',async(req,res)=>{
    try{
        const allJobs = await job.find({});// This returns an array of every job in the 'jobs' collection
        res.json(allJobs);
    }catch(err){
        console.error(err);
        res.status(500).json({message: err});
    }
});

app.get('/jobDetails', async (req, res) => {
    try {
        // Use findOne to match the jobTitle field in your schema
        const jobDetail = await job.findOne({ jobTitle: req.query.id });
        if (!jobDetail) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json(jobDetail);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server flying on http://localhost:${PORT}`));