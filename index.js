import express, { Router } from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./modals/User.js";
import Company from "./modals/Company.js";
import Events from "./modals/Events.js"
import dotenv from "dotenv"

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config({path: './config.env'})

// const userAuthRoutes = require('./routes/userAuth')

// app.use('/api/user',userAuthRoutes)

const PORT = process.env.Port
const DB_URL = process.env.Database

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));


// To create a User Account

app.post('/register-user', async (req, res) => 
{
    const {name, email, contact, password} = req.body;

    try {
        const userExist = await User.findOne({ email: email })

        if (userExist) {
            return res.status(422).json({ message: "Email already Exist" });
        }

        const user = new User({ name, email, contact, password });

        await user.save();
        res.status(201).json({message: "user registered successfully"})
       
    } 
    catch (err) {
        res.status(409).json({message: "Error! Try again later"});
    }
});

// To login a user account

app.post('/signin-user', async (req, res) => 
{
    
    try {
        const {email, password} = req.body;

        const userLogin = await User.findOne({ email: email })

        // console.log(userLogin)
        
        const id = userLogin._id
        if (password != userLogin.password) {
            res.status(400).json({ error: "Invalid Credentials" });
        }
        else
        {
            res.status(200).json({id , message: "User Signed-in Successfully"})
        }
  
    } 
    catch (err) {
        res.status(409).json({message: "Error! Try again later"});
    }
});


// To get a user

app.get('/user/:id', async (req,res) => {
    try
    {
        const user = await User.findById(req.params.id)
    
        res.status(200).json({"sucess":true,user})
    }
    catch(error)
    {
        console.log(error)
    }
})


// To create a Company Account

app.post('/register-company', async (req, res) => 
{
    const {name, email, contact, services, password} = req.body;

    try {
        const companyExist = await Company.findOne({ email: email })

        if (companyExist) {
            return res.status(422).json({ message: "Email already Exist" });
        }

        const company = new Company({ name, email, contact, services,password });

        await company.save();
        res.status(201).json({message: "Company registered successfully"})
  
    } 
    catch (err) {
        res.status(409).json({message: "Error! Try again later"});
    }
});


// To Login a company account  

app.post('/signin-company', async (req, res) => 
{
    
    try {
        const {email, password} = req.body;

        const companyLogin = await Company.findOne({ email: email })

        // console.log(userLogin)
        
        const id = companyLogin._id
        if (password != companyLogin.password) {
            res.status(400).json({ error: "Invalid Credentials" });
        }
        else
        {
            res.status(200).json({id , message: "Company Signed-in Successfully"})
        }
  
    } 
    catch (err) {
        res.status(409).json({message: "Error! Try again later"});
    }
});


// To get a company

app.get('/company/:id', async (req,res) => {
    try
    {
        const company = await Company.findById(req.params.id)
    
        res.status(200).json({"sucess":true,company})
    }
    catch(error)
    {
        console.log(error)
    }
})


// To read all companies

app.get('/company', async (req,res) => {
    
    const companies = await Company.find({})

    res.status(200).json(companies)

})


// To create an event

app.post('/add-event', async (req,res) => {
    
    const { type, date, time, guests, venue, budget, postedBy } = req.body;
    
    try {
        
        const event = new Events({ type, date, time, guests, venue, budget, postedBy });
        
        const e = await event.save();

        const id = e._id

        res.status(201).json({id, message: "Event Created Successfully"})
        
    } 
    catch (err) {
        res.status(409).json({message: "Error! Try again later"});
    }
    

    // "type": "Wedding", 
    // "date": "2/2/2023",
    // "time": "Morning", 
    // "guests": 100, 
    // "venue": "Lahore", 
    // "budget": 275000, 
    // "postedBy":"irfan1971mar@gmail.com"
        
    
})

// To update the food menu of the event

app.patch('/event-food/:id', async (req,res) => {
    
    try {
        const dishes = req.body.selected;
        const cost = req.body.price;
        // const eid = req.params.id;
        // console.log(eid)
        
        const event = await Events.findByIdAndUpdate(req.params.id, {dishes,cost},{new:true});
        
        
        res.status(200).json({event, message: "Event Updated Successfully"})
        
    } 
    catch (err) {
        res.status(409).json({message: "Error! Try again later"});
    }
    
})

// To find the company email using its id. Then make an object of response i.e. combine. Then push the response in responses array

app.patch('/register-response/:id', async (req,res) =>{
    try {
        
        const {cId, price} = req.body
        console.log(cId, price);

        const company = await Company.findById(cId)
        const email = company.email

        const combine = {email:email , price:price}
        console.log(combine)
        const event = await Events.findByIdAndUpdate(
            req.params.id,
            {$push: {responses: combine}},
            {new:true}
            )
        // event.responses.push(combine)
        console.log(event);

        res.status(200).json({event, message: "Response Posted Successfully" })
    } catch (error) {
        
        res.status(409).json({message: "Error! Try again later", error});
    }
})

// To enter the remaining decor items.

app.patch('/event-decor/:id', async (req,res) =>{
    try {
        
        
        const selected = req.body;
        console.log(selected)

        // const combine = {email:email , price:price}
        const event = await Events.findByIdAndUpdate
        (
            req.params.id,
            {decors: selected},
            {new:true}
        )
            
        const postedEvent = await Events.findByIdAndUpdate(
            req.params.id,
            { $set: { posted: true } }, 
            { new: true }
        )

        console.log(event);
        console.log(postedEvent);


        res.status(200).json({postedEvent, message: "Response Posted Successfully" })
    } 
    catch (error) {
        res.status(409).json({message: "Error! Try again later", error});
    }
})



// TO get the events posted by a specific user. Give the email of user and get all his events.

app.get('/get-responses/:id', async (req,res) => {

    try {
        const user = await User.findById(req.params.id)
        const email = user.email
        console.log(email)
        
        const events = await Events.find({postedBy:email})
        console.log(events);
        
        res.status(200).json({events})    
    } catch (error) 
    {   
        res.status(409).json({message: "Error! Try again later", error});
    } 
})


// To get all events which are available for companys to see.


app.get('/events', async (req,res) => {
    
    const events = await Events.find({posted : true})
    
    
        res.status(200).json(events)
    
    
})



//  patch request to post the event

app.patch('/post-event/:id', async (req,res) => {
    try{
        const events = await Events.findByIdAndUpdate(
            req.params.id,
            { $set: { posted: true } }, 
            { new: true }
        )
        
        
        res.status(200).json(events)

    }
    catch(error)
    {
        res.status(409).json({message: "Error! Try again later", error});
    }
    
})




app.listen(PORT, () => console.log(`Server is running! on  `, PORT ));
