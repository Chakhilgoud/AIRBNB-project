const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
    type: String,
    required: true,
    },
    description: String,
    image:{ 
        url: String,
        filename: String,
    },
    price: {
        type : Number,
        required:true
    },
    location: String,
    country: String,

    geometry: {
        type:{
            type: String,
            enum:["Point"],
        },
        coordinates:[Number],
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type : Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if (listing) {
     await Review.deleteMany({reviews:{$in: listing.reviews}});
    }

});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;