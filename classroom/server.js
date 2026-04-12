const express = require ("express");
const app = express()
const users = require("./routes/user")
const posts = require("./routes/post")
const Session = require("express-session")
const flash = require("connect-flash")
const path = require("path")

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(Session({secret: "mysupersecretstring", resave: false, saveUninitialized: true}))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.successmsg = req.flash("success")
    res.locals.errormsg = req.flash("error")
    next()
})

app.get("/register", (req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name

    if(name==="anonymous"){
        req.flash("error", "user not registered!")
    }else{
        req.flash("success", "user register successfully!")
    }

    res.redirect("/hello")
})

app.get("/hello", (req,res)=>{
    res.render("page.ejs",{name: req.session.name, msg: req.flash("success")})
})




// app.get("/reqcount", (req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//     req.session.count = 1
//     }
//     res.send(`youn send the request ${req.session.count} times`)
// })

// app.get("/test", (req,res)=>{
//     res.send("test successful !")
// })

app.listen(8000,()=>{
    console.log("server is listening to 8000")
})


