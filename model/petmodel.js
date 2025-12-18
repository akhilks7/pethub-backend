const mongoose = require("mongoose")

const PetSchema = new mongoose.Schema({
    petname: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    bio: {
        type: String,
         default: ""
    },
    identification: {
        type: String,
        default: ""
    },
    contactno: {
        type: String,
        default: ""
    },
    profile: {
        type: String,
        default: ""
    },
    imageURL: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "pending"
    },
    broughtby: {
        type: String,
        default: ""
    },
    price: {
        type: String,
        default: ""
    },
})

const pets = mongoose.model("pets", PetSchema)
module.exports = pets