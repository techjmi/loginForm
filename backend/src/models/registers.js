const mongoose =require("mongoose")
const bcrypt= require("bcryptjs")
const jwt= require("jsonwebtoken")
const registrationSchema= new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      gmail: {
        type: String,
        required: true,
        unique:true
      },
      gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique:true
  },
  age: {
    type: Number,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  confirmPass: {
    type: String,
    required: true,
  },
  tokens:[{
    token:{
      type: String,
    required: true,
    }
  }],

})
registrationSchema.methods.generatToken= async function(){
  try{
const token =jwt.sign({_id:this._id.toString()}, "shamimakhterjamaiamilliaislamianewdelhi")
this.tokens= this.tokens.concat({token:token})
await this.save()
// console.log(token)
return token;
  }catch(err){
console.log("this is a error "+err)
  }
} 
registrationSchema.pre('save', async function (next) {
  if(this.isModified("pass")){
    // const Passhash= await bcrypt.hash(this.pass, 10)
  // console.log(`the current password is ${this.pass}`);
  this.pass=await bcrypt.hash(this.pass, 10)
  this.confirmPass= await bcrypt.hash(this.confirmPass, 10) //this should not undefind
  }
  next();
});
//create model
const Register= new mongoose.model("Register", registrationSchema)
//schema for message
const msgSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  phone:{
    type:Number,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  msg:{
    type:String,
    required:true
  },
})
const Message= new mongoose.model("Message", msgSchema)
module.exports = {
  Register,
  Message
};

