const express = require("express");
const path = require("path");
const hbs = require("hbs");
const fs = require('fs');
const bcrypt= require("bcryptjs")
const { Register, Message } = require('./models/registers');
const App = express();
App.use(express.json()); 
const port = process.env.PORT || 4000;
const staticPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../template/views');
const partialsPath = path.join(__dirname, '../template/partials');
const cardDataPath = path.join(__dirname, './card/data.json');
console.log(cardDataPath);
console.log(__dirname);
console.log(staticPath);
console.log(viewsPath);
console.log(partialsPath);
App.use(express.static(staticPath));
App.set('view engine', 'hbs');
App.set('views', viewsPath);
App.set('partials', partialsPath);
hbs.registerPartials(partialsPath);
require('./db/conn'); //database required
App.use(express.json());
App.use(express.urlencoded({ extended: false }));
App.get('/', (req, res) => {
  res.render('index.hbs');
});
App.get('/contact', (req, res) => {
  res.render('Contact.hbs');
});
App.get('/register', (req, res) => {
  res.render('register.hbs');
});
App.post('/register', async (req, res) => {
  try {
    const existingEmail = await Register.findOne({ gmail: req.body.gmail });
      const existingPhone = await Register.findOne({ phoneNumber: req.body.phoneNumber });
      if (existingEmail) {
        // Email is already registered
        return res.status(400).json({ message: "Email is already registered." });
      }
      if (existingPhone) {
        // Phone number is already registered
        return res.status(400).json({ message: "Phone number is already registered." });
      }
    const password = req.body.pass;
    const cpassword = req.body.confirmPass;

    if (password === cpassword) {
      console.log(req.body)
      const registrationSchema = new Register({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gmail: req.body.gmail,
        phoneNumber: req.body.phoneNumber,
        pass: req.body.pass,
        confirmPass: req.body.confirmPass,
        // confirmPass: req.body,
        age: req.body.age,
        gender: req.body.gender
        // tokens:req.body.tokens
      });
      // middleware for jwt
     const tok= await registrationSchema.generatToken();
    //  console.log(tok)
      // Save the registrationSchema to the database
     await registrationSchema.save();
      // console.log("Registration successful:", savedRegistration);
      res.status(200).json({ message: "Registration successful" });;
    } else {
      // console.log("Passwords do not match");
      res.status(400).send("Passwords do not match");
    }
  } catch (error) {
    console.error("Error during registration:", error);
  
    // Log the specific error details
    console.error(error);
  
    // Respond with an internal server error
    res.status(500).send("Internal Server Error");
  }
});
// Add a new route for login
App.post('/login', async (req, res) => {
  try {
    // console.log(req.body);
    const { gmail, pass } = req.body;
    // Check if the email exists in the database
    const user = await Register.findOne({ gmail });
    if (!user) {
      // User with the given email does not exist
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(pass, user.pass)
    // console.log(isMatch);
    if (isMatch) {
      // Passwords match - user is authenticated
      return res.redirect('/');
    } else {
      // Password is incorrect
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    // console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
App.post("/message", async (req, res) => {
  try {
    // console.log("Request Body:", req.body);
    //  message instance
    const msgSchema = new Message({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      msg: req.body.msg,
    });
    // Saving the message to MongoDB
    const savedMessage = await msgSchema.save();
    // console.log("Message saved successfully:", savedMessage);
    res.status(200).json({ message: "Message Sent Successfully" });
  } catch (error) {
    // console.error("Error sending message:", error.message);
    // console.error("Error stack trace:", error.stack);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
//data code
App.get('/about', (req, res) => {
  // Read cardData from the JSON file using fs.read
  fs.readFile(cardDataPath, 'utf8', (err, data) => {
      if (err) {
          // console.error('Error reading cardData:', err);
          res.status(500).send('Internal Server Error');
        return;
      }
      // Parseing the JSON data
      const cardData = JSON.parse(data);
      // Render the course view and pass the cardData
      res.render('About.hbs', { cardData });
    });
  });
App.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
