const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    listingId:{
        type:String,
        required:true
    },
    ownerId:{
        type:String,
        required:true
    },
    isValid:{
        type:Boolean,
        required:true
    },
    createdAt:{
        type:String,
        default:new Date().toString()
    },
    expiresAt:{
        type:String,
        required:true
    },
    maxLimit:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
});

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

module.exports = PromoCode;