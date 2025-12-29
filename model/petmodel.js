const mongoose = require("mongoose")

const PetSchema = new mongoose.Schema({
    usermail: {
        type: String,
        default: ""
    },
    petname: {
        type: String,
        default: ""
    },
    animaltype: {
        type: String,
        default: ""
    },
    age: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        default: ""
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
    photos: {
        type: Array,
        default: ""
    },
    imageURL: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "active"
    },
    petfor: {
        type: String,
        default: ""
    },
    broughtby: {
        type: String,
        default: ""
    },
    price: {
        type: String,
        default: ""
    },
    mdate: {
        type: String,
        default: ""
    },
    vaccinated: {
        type: String,
        default: ""
    },
    neutered: {
        type: String,
        default: ""
    },
    condition: {
        type: String,
        default: ""
    },

})

const pets = mongoose.model("pets", PetSchema)
module.exports = pets