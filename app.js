const express = require ("express");
const app = express()
const mongoose = require("mongoose")
const port = 3000
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("./schema.js")
const Review = require("./models/review.js")


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}
main().then((res)=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err)
})

app.listen(port,(req,res)=>{
    console.log(`server is listining on port ${port}`)
})


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(404, errMsg);
    }
    else{
        next();
    }    
}

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(404, errMsg);
    }
    else{
        next();
    }    
}


app.get("/",(req,res)=>{
    res.send("Hi I am Root")
})

// Index Route
app.get("/listing", wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings})
})) 

// New Route
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// Create Route
app.post("/listing", validateListing,wrapAsync(async(req,res)=>{
    // let {title,description,image,price,location,Country}=req.body
    // let listing = req.body.listing

    const newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect("/listing")
}))

// Show Route
app.get("/listing/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs",{listing})
}))

// Edit Route
app.get("/listing/:id/new", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
}))

// Update Route
app.put("/listing/:id", validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listing/${id}`)
}))

// Delete Route
app.delete("/listing/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    res.redirect("/listing")
}))


// Reviews
// post review repite

app.post("/listing/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()

    res.redirect(`/listing/${listing._id}`)
}))


// Delete Review Route
app.delete("/listing/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id, reviewId} = req.params

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`/listing/${id}`)
}))

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next)=>{
    let {statusCode =500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message)
})


