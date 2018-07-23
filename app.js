var express= require("express");
var app=express();
var expressSanitizer=require("express-sanitizer");
var nodemailer = require('nodemailer');
var bodyParser = require("body-parser");

app.use(expressSanitizer());


var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'switchy', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.set("view engine","ejs");
app.use(express.static(__dirname+""));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//emails settings
let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'ketemshahor@gmail.com',
    pass: 'ketem1234'
  },
  tls: {
    rejectUnauthorized: false
  }
});



//Routes
//default
app.get("/",function(req,res){
    res.render("landing");
});


 app.post("/email",function(req,res,err){
 req.body.email=req.sanitize(req.body.email);
 cloudinary.v2.uploader.upload(req.body.pic, function(err,result) {
    if (err){
            console.log("upload error");
            console.log(err);
            return res.redirect('back');
        }else{
    let HelperOptions = {
  from: '"Ketem Shahor" <ketemshahor@gmail.com>',
  to: req.body.email,
  subject: 'ketem',
  text: 'test text',
   html:'<img src="'+result.secure_url+'" >'
};
   transporter.sendMail(HelperOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("The message was sent!");
    console.log(info);
  }); 
        }
});
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server started!") ;
});







