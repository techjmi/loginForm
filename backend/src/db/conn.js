const mongoose = require("mongoose");
const Validator=require("validator")

mongoose.connect("mongodb://127.0.0.1:27017/Customer", {
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    console.log("Connection is successful");
}).catch((err) => {
    console.log("Connection error:", err);
});


