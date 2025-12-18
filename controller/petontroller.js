
const jwt = require("jsonwebtoken");
const pets = require("../model/petmodel");

exports.addnewpetController=async(req,res)=>{
    console.log(`inside addnewpetController`);
    const{petname,age,gender,location,breed,price,imageURL}=req.body
    console.log(petname,age,gender,location,breed,price,imageURL);

    try {
        const newpet = new pets({
            petname,age,gender,location,breed,price,imageURL
        })
        await newpet.save()
        res.status(200).json(newpet)
    } catch (error) {
        console.log(error);
        
    }
}