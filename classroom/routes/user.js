const express = require("express")
const router = express.Router()

// Index-users
router.get("/",(req,res)=>{
    res.send("Get for Users")
})

// show-users
router.get("/:id",(req,res)=>{
    res.send("Get for User id")
})

// post-users
router.post("/",(req,res)=>{
    res.send("Post for Users")
})

// delete-users
router.delete("/:id",(req,res)=>{
    res.send("Delete for Users id")
})


module.exports = router;