const express = require("express")
const router = express.Router()

// post

// Index
router.get("/",(req,res)=>{
    res.send("Get for Posts")
})

// show
router.get("/:id",(req,res)=>{
    res.send("Get for Post id")
})

// post
router.post("/",(req,res)=>{
    res.send("Post for posts")
})

// delete
router.delete("/:id",(req,res)=>{
    res.send("Delete for post id")
})

module.exports = router;