
const jwt = require("jsonwebtoken");
const pets = require("../model/petmodel");
const users = require("../model/usermodel");
const stripe = require('stripe')(process.env.StripeSecretKey);

// -----------------------Admin-------------------------

exports.addnewpetController = async (req, res) => {
    console.log("Inside addnewpetController");

    const { petname, age, gender, location, breed, price } = req.body;
    const photos = req.files ? req.files.map(file => file.filename) : [];

    const usermail = req.payload;

    if (!petname || !breed || !age || !gender || !location || !price || photos.length === 0) {
        return res.status(400).json({ message: "All fields and at least one photo are required" });
    }

    try {
        const newpet = new pets({
            petname,
            age,
            gender,
            location,
            breed,
            price,
            photos,
            usermail,
            petfor: "sell"
        });

        await newpet.save();
        res.status(200).json({ message: "Pet added successfully!", pet: newpet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add pet" });
    }
};

exports.getallAdminsellpets = async (req, res) => {
    console.log(`inside getallAdminsellpets`);
    const adminMail = req.payload
    try {
        const allpets = await pets.find({ usermail: adminMail, status: {$ne:"sold"} })
        res.status(200).json(allpets)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getallAdminDonatepets = async (req, res) => {
    console.log(`inside getallAdminDonatepets`);
    try {
        const alldonatepets = await pets.find({ petfor: "donate" })
        res.status(200).json(alldonatepets)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getallAdminlostpets = async (req, res) => {
    console.log(`inside getallAdminlostpets`);
    try {
        const alllostpets = await pets.find({ petfor: "lost" })
        res.status(200).json(alllostpets)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getallAdminstrayanimals = async (req, res) => {
    console.log(`inside getallAdminstrayanimals`);
    try {
        const allstrayanimals = await pets.find({ petfor: "stray" })
        res.status(200).json(allstrayanimals)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getallAdminfoundpets = async (req, res) => {
    console.log(`inside getallAdminfoundpets`);
    try {
        const allfoundpets = await pets.find({ petfor: "found" })
        res.status(200).json(allfoundpets)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getallAdminUsers = async (req, res) => {
    console.log(`inside getallAdminUsers`);
    try {
        const allusers = await users.find({ role: "user" })
        res.status(200).json(allusers)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getallpets = async (req, res) => {
    console.log(`inside getallpets`);
    try {
        const allpets = await pets.find()
        res.status(200).json(allpets)
        console.log(allpets);

    } catch (error) {
        res.status(404).json(error)
    }
}

exports.updatesellpetController = async (req, res) => {
    console.log("Inside updatesellpetController");

    const { _id, petname, age, gender, location, breed, price } = req.body;

    // New uploaded files (from multer)
    const newPhotos = req.files ? req.files.map(file => file.filename) : [];

    // Existing photo filenames (sent as stringified array in body)
    let existingPhotos = [];
    if (req.body.existingPhotos) {
        try {
            existingPhotos = JSON.parse(req.body.existingPhotos);
            if (!Array.isArray(existingPhotos)) existingPhotos = [];
        } catch (err) {
            existingPhotos = [];
        }
    }

    const allPhotos = [...existingPhotos, ...newPhotos];

    console.log("Update data:", {
        _id,
        petname,
        age,
        gender,
        location,
        breed,
        price,
        existingPhotosCount: existingPhotos.length,
        newPhotosCount: newPhotos.length,
        totalPhotos: allPhotos.length
    });

    // Validation
    if (!_id || !petname || !breed || !age || !gender || !location || !price) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (allPhotos.length === 0) {
        return res.status(400).json({ message: "At least one photo is required" });
    }

    if (allPhotos.length > 5) {
        return res.status(400).json({ message: "Maximum 5 photos allowed" });
    }

    try {
        const updatedPet = await pets.findByIdAndUpdate(
            _id,
            {
                petname,
                age,
                gender,
                location,
                breed,
                price,
                photos: allPhotos  // ← Save array of all filenames
            },
            { new: true }
        );

        if (!updatedPet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.status(200).json({
            message: "Pet updated successfully!",
            pet: updatedPet
        });
    } catch (error) {
        console.error("Error updating pet:", error);
        res.status(500).json({ message: "Failed to update pet" });
    }
};

exports.deletesellpetController = async (req, res) => {
    console.log(`inside deletesellpetController`);
    const { _id } = req.body
    console.log(_id);
    // const sellpetdata=req.body

    try {
        const deletepet = await pets.deleteOne({ _id })
        res.status(200).json(deletepet)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.deletepetController = async (req, res) => {
    console.log(`inside deletepetController`);
    const { _id } = req.body
    console.log(_id);
    try {
        const deletepet = await pets.deleteOne({ _id })
        res.status(200).json(deletepet)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.updatepetstatusController = async (req, res) => {
    console.log("Inside updatesellpetController");
    const { _id, status } = req.body;
    console.log("Update status:", {
        _id, status
    });
    if (status == 'active') {
        try {
            const updatedPet = await pets.findByIdAndUpdate(_id, { status: "inactive" }, { new: true });
            if (!updatedPet) {
                return res.status(404).json({ message: "Pet not found" });
            }
            res.status(200).json({
                message: "Pet status updated successfully!",
                pet: updatedPet
            });
        } catch (error) {
            console.error("Error updating pet:", error);
            res.status(500).json({ message: "Failed to update pet" });
        }
    } else {
        try {
            const updatedPet = await pets.findByIdAndUpdate(_id, { status: "active" }, { new: true });
            if (!updatedPet) {
                return res.status(404).json({ message: "Pet not found" });
            }
            res.status(200).json({
                message: "Pet updated successfully!",
                pet: updatedPet
            });
        } catch (error) {
            console.error("Error updating pet:", error);
            res.status(500).json({ message: "Failed to update pet" });
        }
    };
}


// -------------------user--------------------------------------------------------

exports.reportfoundpetController = async (req, res) => {
    console.log("Inside reportfoundpetController");

    const {
        animaltype,
        age,
        gender,
        location,
        breed,
        contactno,
        identification
    } = req.body;

    // Extract uploaded filenames
    const photos = req.files ? req.files.map(file => file.filename) : [];

    const usermail = req.payload;

    console.log("Received data:", {
        animaltype, age, gender, location, breed,
        contactno, identification, photosCount: photos.length
    });

    // Basic validation
    if (!animaltype || !age || !gender || !breed || !location || !contactno || !identification) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (photos.length === 0) {
        return res.status(400).json({ message: "At least one photo is required" });
    }

    try {
        const newpet = new pets({
            animaltype,
            age,
            gender,
            location,
            breed,
            photos,                    // ← Array of filenames saved correctly
            contactno,
            identification,
            usermail,
            petfor: "found"
        });

        await newpet.save();

        res.status(200).json({
            message: "Found pet reported successfully! Thank you for helping.",
            pet: newpet
        });
    } catch (error) {
        console.error("Error saving found pet:", error);
        res.status(500).json({ message: "Failed to report found pet. Please try again." });
    }
};

exports.reportlostpetController = async (req, res) => {
    console.log("Inside reportlostpetController");

    const {
        petname,
        age,
        gender,
        location,
        breed,
        mdate,
        contactno,
        identification
    } = req.body;

    // Extract uploaded image filenames
    const photos = req.files ? req.files.map(file => file.filename) : [];

    const usermail = req.payload;

    console.log("Received data:", {
        petname, age, gender, location, breed,
        mdate, contactno, identification,
        photosCount: photos.length
    });

    // Basic validation
    if (!petname || !age || !gender || !breed || !location || !mdate || !contactno || !identification) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (photos.length === 0) {
        return res.status(400).json({ message: "At least one photo is required" });
    }

    try {
        const newpet = new pets({
            petname,
            age,
            gender,
            location,
            breed,
            photos,                    // ← Correctly saved as array of filenames
            mdate,
            contactno,
            identification,
            usermail,
            petfor: "lost"
        });

        await newpet.save();

        res.status(200).json({
            message: "Lost pet alert created successfully! We'll help spread the word.",
            pet: newpet
        });
    } catch (error) {
        console.error("Error saving lost pet report:", error);
        res.status(500).json({ message: "Failed to create lost pet alert. Please try again." });
    }
};

exports.reportStraypetController = async (req, res) => {
    console.log("Inside reportStraypetController"); // ← Fixed wrong log message

    const { animaltype, location, contactno, bio, condition } = req.body;

    // Extract uploaded image filenames as array
    const photos = req.files ? req.files.map(file => file.filename) : [];

    const usermail = req.payload;

    console.log("Stray report received:", { animaltype, condition, location, contactno, bio, photosCount: photos.length, usermail });

    // Validation
    if (!animaltype || !location || !contactno || !bio) {
        return res.status(400).json({
            message: "Animal type, location, contact number, and description are required"
        });
    }

    if (photos.length === 0) {
        return res.status(400).json({
            message: "At least one photo is required"
        });
    }

    try {
        const newpet = new pets({
            animaltype,
            condition,
            location,
            photos,
            contactno,
            bio,
            usermail,
            petfor: "stray"
        });

        await newpet.save();

        res.status(200).json({
            message: "Stray animal reported successfully! Rescuers will be notified soon.",
            pet: newpet
        });
    } catch (error) {
        console.error("Error saving stray report:", error);
        res.status(500).json({
            message: "Failed to submit stray report. Please try again."
        });
    }
};

exports.reportAdoptpetController = async (req, res) => {
    console.log("Inside reportAdoptpetController");

    // Text fields from formData
    const {
        petname,
        breed,
        age,
        gender,
        animaltype,
        vaccinated,
        contactno,
        location,
        neutered,
        bio
    } = req.body;

    // Extract array of uploaded filenames from multer
    const photos = req.files ? req.files.map(file => file.filename) : [];

    const usermail = req.payload;

    console.log("Received data:", {
        petname, breed, age, gender, animaltype,
        vaccinated, contactno, location, neutered, bio,
        photos,  // ← This will be an array of filenames
        usermail
    });

    // Validation
    if (!petname || !contactno || !location) {
        return res.status(400).json({ message: "Pet name, contact number, and location are required" });
    }

    if (photos.length === 0) {
        return res.status(400).json({ message: "At least one photo is required" });
    }

    try {
        const newpet = new pets({
            petname,
            breed,
            age,
            gender,
            animaltype: animaltype || "Dog",
            vaccinated,
            contactno,
            location,
            neutered,
            bio,
            photos,                    // ← Array of filenames saved here
            usermail,
            petfor: "donate"
        });

        await newpet.save();

        res.status(200).json({
            message: "Pet successfully listed for adoption!",
            pet: newpet
        });
    } catch (error) {
        console.error("Error saving adoption pet:", error);
        res.status(500).json({ message: "Failed to list pet for adoption" });
    }
};

exports.getallusersellpets = async (req, res) => {
    console.log(`inside getallusersellpets`);
    try {
        const sellpets = await pets.find({ petfor: "sell", status: "active" })
        res.status(200).json(sellpets)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluserDonatepets = async (req, res) => {
    console.log(`inside getalluserDonatepets`);
    const usermail = req.payload
    const query = {
        petfor: "donate",
        usermail: { $ne: usermail },
        status: "active",
    }
    try {
        const alldonatepets = await pets.find(query)
        res.status(200).json(alldonatepets)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluserStraypets = async (req, res) => {
    console.log(`inside getalluserStraypets`);
    const usermail = req.payload
    const query = {
        petfor: "stray",
        usermail: { $ne: usermail },
        status: "active",
    }
    try {
        const allstraypets = await pets.find(query)
        res.status(200).json(allstraypets)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluserlostpets = async (req, res) => {
    console.log(`inside getalluserlostpets`);
    const usermail = req.payload
    const query = {
        petfor: "lost",
        usermail: { $ne: usermail },
        status: "active",
    }
    try {
        const alllostpets = await pets.find(query)
        res.status(200).json(alllostpets)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluserfoundpets = async (req, res) => {
    console.log(`inside getalluserfoundpets`);
    const usermail = req.payload
    const query = {
        petfor: "found",
        usermail: { $ne: usermail },
        status: "active",
    }
    try {
        const allfoundpets = await pets.find(query)
        res.status(200).json(allfoundpets)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluseradoptpets = async (req, res) => {
    console.log(`inside getallpets`);
    const usermail = req.payload
    const query = {
        usermail: usermail,
        petfor: "donate",
        status: "active",
    }
    try {
        const allpets = await pets.find(query)
        res.status(200).json(allpets)
        console.log(allpets);

    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluserfoundpetscount = async (req, res) => {
    console.log(`inside getalluserfoundpetscount`);
    const usermail = req.payload
    const query = {
        usermail: usermail,
        petfor: "found",
        status: "active",
    }
    try {
        const allpets = await pets.find(query)
        res.status(200).json(allpets)
        console.log(allpets);

    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluserlostpetscount = async (req, res) => {
    console.log(`inside getalluserlostpets`);
    const usermail = req.payload
    const query = {
        usermail: usermail,
        petfor: "lost",
        status: "active",
    }
    try {
        const allpets = await pets.find(query)
        res.status(200).json(allpets)
        console.log(allpets);

    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluserstraypetscount = async (req, res) => {
    console.log(`inside getalluserstraypets`);
    const usermail = req.payload
    const query = {
        usermail: usermail,
        petfor: "stray",
        status: "active",
    }
    try {
        const allpets = await pets.find(query)
        res.status(200).json(allpets)
        console.log(allpets);

    } catch (error) {
        res.status(404).json(error)
    }
}


exports.getalluserhomeadoptpets = async (req, res) => {
    console.log(`inside getalluserhomeadoptpets`);
    const usermail = req.payload
    const query = {
        usermail: { $ne: usermail },
        petfor: "donate",
        status: "active",
    }
    try {
        const allpets = await pets.find(query).sort({ _id: -1 }).limit(3)
        res.status(200).json(allpets)
        console.log(allpets);

    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluserhomesellpets = async (req, res) => {
    console.log(`inside getalluserhomesellpets`);
    try {
        const sellpets = await pets.find({ petfor: "sell", status: "active" }).sort({ _id: -1 }).limit(3)
        res.status(200).json(sellpets)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluserhomelostpetscount = async (req, res) => {
    console.log(`inside getalluserlostpets`);
    const usermail = req.payload
    const query = {
        petfor: "lost",
        status: "active",
        usermail: { $ne: usermail },
    }
    try {
        const allpets = await pets.find(query).sort({ _id: -1 }).limit(3)
        res.status(200).json(allpets)
        console.log(allpets);

    } catch (error) {
        res.status(404).json(error)
    }
}

exports.getalluserhomefoundpetscount = async (req, res) => {
    console.log(`inside getalluserfoundpetscount`);
    const usermail = req.payload
    const query = {
        petfor: "found",
        status: "active",
        usermail: { $ne: usermail },
    }
    try {
        const allpets = await pets.find(query).sort({ _id: -1 }).limit(3)
        res.status(200).json(allpets)
        console.log(allpets);

    } catch (error) {
        res.status(404).json(error)
    }
}


exports.updateuserpetController = async (req, res) => {
    console.log("Inside updateuserpetController");

    const { _id } = req.body;

    if (!_id) {
        return res.status(400).json({ message: "Pet ID is required" });
    }

    // Extract common fields (all pet types share these)
    const {
        petname,
        age,
        gender,
        location,
        breed,
        price,
        animaltype,
        identification,
        contactno,
        bio,
        condition,
        mdate,
        vaccinated,
        neutered,
        existingPhotos // stringified array from frontend
    } = req.body;

    // Handle new uploaded photos
    const newPhotos = req.files ? req.files.map(file => file.filename) : [];

    // Parse existing photos (sent as JSON string from frontend)
    let existingPhotosArray = [];
    if (existingPhotos) {
        try {
            existingPhotosArray = JSON.parse(existingPhotos);
            if (!Array.isArray(existingPhotosArray)) existingPhotosArray = [];
        } catch (err) {
            existingPhotosArray = [];
        }
    }

    // Combine old + new photos
    const allPhotos = [...existingPhotosArray, ...newPhotos];

    // Validation: At least one photo
    if (allPhotos.length === 0) {
        return res.status(400).json({ message: "At least one photo is required" });
    }

    if (allPhotos.length > 5) {
        return res.status(400).json({ message: "Maximum 5 photos allowed" });
    }

    // Build update object dynamically
    const updateData = {
        photos: allPhotos
    };

    // Add fields only if they exist in request
    if (petname !== undefined) updateData.petname = petname;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (location !== undefined) updateData.location = location;
    if (breed !== undefined) updateData.breed = breed;
    if (price !== undefined) updateData.price = price;
    if (animaltype !== undefined) updateData.animaltype = animaltype;
    if (identification !== undefined) updateData.identification = identification;
    if (contactno !== undefined) updateData.contactno = contactno;
    if (bio !== undefined) updateData.bio = bio;
    if (condition !== undefined) updateData.condition = condition;
    if (mdate !== undefined) updateData.mdate = mdate;
    if (vaccinated !== undefined) updateData.vaccinated = vaccinated;
    if (neutered !== undefined) updateData.neutered = neutered;

    console.log("Updating pet with ID:", _id);
    console.log("Update data:", updateData);

    try {
        const updatedPet = await pets.findByIdAndUpdate(
            _id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPet) {
            return res.status(404).json({ message: "Pet not found or you don't have permission" });
        }

        res.status(200).json({
            message: "Pet updated successfully!",
            pet: updatedPet
        });

    } catch (error) {
        console.error("Error updating pet:", error);
        res.status(500).json({ message: "Failed to update pet", error: error.message });
    }
};

exports.makesellpetpaymentcontroller = async (req, res) => {
    console.log(`inside makesellpetpaymentcontroller`);
    const { _id ,petname,price,} = req.body
    const email = req.payload
    if (!req.body || !_id) {
        return res.status(400).json({ message: "Request body or book ID missing" });
    }

    try {
        const updatepetPayment = await pets.findByIdAndUpdate({ _id }, { petname, price, status: "sold", broughtby: email }, { new: true })
        console.log(updatepetPayment);

        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: petname,
                    description: `${petname} | ${email}`,
                    images: [],
                    metadata: { petname, price, status: "sold", broughtby: email }
                },
                unit_amount: Math.round(price * 100)
            },
            quantity: 1

        }]

        const session = await stripe.checkout.sessions.create({
            // success_url: 'http://localhost:5173/payment-success',
            // cancel_url: 'http://localhost:5173/payment-error',
            success_url: 'https://petwelfare-frontend.vercel.app/payment-success',
            cancel_url: 'https://petwelfare-frontend.vercel.app/payment-error',
            line_items: line_items,
            mode: 'payment',
            payment_method_types:["card"]
        });
        console.log(session);
        res.status(200).json({checkoutSessionurl:session.url})

    } catch (error) {
          console.log(error);
    }
}