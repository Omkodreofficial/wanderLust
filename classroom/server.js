const express = require ("express");
const app = express()
const users = require("./routes/user")
const posts = require("./routes/post")
const cookieParser = require("cookie-parser")

app.use(cookieParser("secretcode"))

app.listen(8000,()=>{
    console.log("server is listening to 8000")
})

app.get("/",(req,res)=>{
    let {name = "anonymous"} = req.cookies
    res.send(`hi ${name}`)
})

app.get("/signedcookies", (req,res)=>{
    res.cookie("made-in", "India", {signed: true})
    res.send("signed cookie send")
})

app.get("/verify", (req,res)=>{
    console.log(req.signedCookies)
    res.send("verified")
})

app.get("/getcookies", (req,res)=>{
    res.cookie("greet", "hello")
    res.cookie("madein", "India")
    res.send("sent you some cookies!")
})

app.use("/users",users);
app.use("/posts",posts);

