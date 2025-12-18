
const jwt = require("jsonwebtoken");
const pets = require("../model/petmodel");

exports.addnewpetController=async(req,res)=>{
    console.log(`inside addnewpetController`);
    const{petname,age,gender,location,breed,price,imageURL}=req.body
    console.log(petname,age,gender,location,breed,price,imageURL);
    const usermail=req.payload
    try {
        const newpet = new pets({
            petname,age,gender,location,breed,price,imageURL,usermail,status:"active"
        })
        await newpet.save()
        res.status(200).json(newpet)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getallAdminsellpets=async(req,res)=>{
    console.log(`inside getallAdminsellpets`);
    const adminMail=req.payload
    try {
        const allpets=await pets.find({usermail:adminMail })
        res.status(200).json(allpets)
    } catch (error) {
        res.status(404).json(error)
    }   
}

exports.updatesellpetController=async(req,res)=>{
    console.log(`inside updatesellpetController`);
    const{_id,petname,age,gender,location,breed,price,imageURL}=req.body
    console.log(_id,petname,age,gender,location,breed,price,imageURL);
    
    try {
        const updatepet=await pets.findByIdAndUpdate(_id,{petname,age,gender,location,breed,price,imageURL},{new:true})
        res.status(200).json(updatepet)
    } catch (error) {
        res.status(404).json(error)
    }   
}
