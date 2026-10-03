if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname, "/public")));
const {listingSchema, reviewSchema} = require("./schema.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


require("dotenv").config();
const dbUrl = process.env.ATLASDB_URL;

console.log("Db URL:", process.env.ATLASDB_URL)
main()
    .then((res) => { console.log("connected to db"); })
    .catch((err) => { console.log(err); });

async function main() {
    await mongoose.connect(dbUrl);
    console.log("COnnected to Db");
}

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
   console.log("ERROR IN MONGO SESSION STORE", err);

})


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUnintialized: false,
    cookie: {
        
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/", (req, res) => {
//     res.send("Hi i am root");
// });

// app.get("/", (req,res)=>{
//     res.send("server is running");
//     });

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "something went wrong"} = err;
    res.render("error.ejs", {err});
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
});
// app.listen(8080, () => {
//     console.log("server is listening to port 8080");
// });
