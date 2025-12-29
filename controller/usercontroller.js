const users = require("../model/usermodel");
const jwt = require("jsonwebtoken")

exports.registercontroller = async (req, res) => {
    console.log("inside register controller");
    const { username, email, password } = req.body
    console.log(username, email, password);

    //logic
    try {
        const existinguser = await users.findOne({ email })
        if (existinguser) {
            res.status(404).json("user already exists...please login!!!..")
        } else {
            const newUser = new users({
                username,
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(500).json(error)
    }

    // res.status(200).send("register request resived")
}

exports.loginController = async (req, res) => {
    console.log(`inside login controller`);
    const { password, email } = req.body
    console.log(email, password);
    try {
        const existinguser = await users.findOne({ email,status:"active" })
        if (existinguser) {
            if (existinguser.password == password) {
                const tocken = jwt.sign({ userMail: existinguser.email, role: existinguser.role }, process.env.JWTsecretkey)
                res.status(200).json({ existinguser, tocken })
            } else {
                res.status(401).json(`invalid credentials`)
            }
        } else {
            res.status(404).json(`user not found ,,please resgister`)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


// -------------------------admin-----------------------------
exports.deleteuserController = async (req, res) => {
    console.log(`inside deleteuserController`);
    const { _id } = req.body
    console.log(_id);
    try {
        const deleteuser = await users.deleteOne({ _id })
        res.status(200).json(deleteuser)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.updateuserstatusController = async (req, res) => {
    console.log("Inside updateuserstatusController");
    const { _id, status } = req.body;
    console.log("Update status:", {
        _id, status
    });
    if (status == 'active') {
        try {
            const updateduser = await users.findByIdAndUpdate(_id, { status: "inactive" }, { new: true });
            if (!updateduser) {
                return res.status(404).json({ message: "user not found" });
            }
            res.status(200).json({
                message: "user status updated successfully!",
                user: updateduser
            });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Failed to update user" });
        }
    } else {
        try {
            const updateduser = await users.findByIdAndUpdate(_id, { status: "active" }, { new: true });
            if (!updateduser) {
                return res.status(404).json({ message: "user not found" });
            }
            res.status(200).json({
                message: "user updated successfully!",
                user: updateduser
            });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Failed to update user" });
        }
    };
}

// -------------------------user-----------------------------

exports.updateProfilePicture = async (req, res) => {
    const usermail = req.payload; // email from JWT

    // If no file uploaded
    if (!req.file) {
        return res.status(400).json({ message: "Please upload an image" });
    }

    const filename = req.file.filename;

    try {
        const updatedUser = await users.findOneAndUpdate(
            { email: usermail },
            { profile: filename },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile picture updated!",
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// update userprofile
exports.updateProfileController = async (req, res) => {
    const usermail = req.payload;
    const { username, bio, phone, location } = req.body;

    // Make sure username is not empty
    if (!username || username.trim() === "") {
        return res.status(400).json({ message: "Username cannot be empty" });
    }

    try {
        const updatedUser = await users.findOneAndUpdate(
            { email: usermail },
            {
                username: username.trim(),
                bio: bio ? bio.trim() : "",
                phone: phone ? phone.trim() : "",
                location: location ? location.trim() : ""
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

exports.updatepasswordController = async (req, res) => {
    const usermail = req.payload; // email from JWT
    const { currentPassword, newPassword } = req.body; // Expect BOTH from frontend

    console.log("Current:", currentPassword, "New:", newPassword);

    // Check if fields are provided
    if (!currentPassword || !newPassword || newPassword.trim() === "") {
        return res.status(400).json({ message: "Both current and new password are required" });
    }

    try {
        // Find the user
        const user = await users.findOne({ email: usermail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password (plain text match – matches your login system)
        if (user.password !== currentPassword) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Update with new password
        const updatedUser = await users.findOneAndUpdate(
            { email: usermail },
            { password: newPassword.trim() },
            { new: true }
        );

        res.status(200).json({
            message: "Password updated successfully!",
            user: updatedUser
        });
    } catch (error) {
        console.error("Password update error:", error);
        res.status(500).json({ message: "Failed to update password" });
    }
};
