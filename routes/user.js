// backend/routes/user.js
const express = require("express");
const zod = require("zod");
const router = express.Router();
const { User } = require("../db");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { authMiddleware, checkRoles } = require("../middleware");
const mongoose = require("mongoose"); // Ensure mongoose is required

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6),
});

router.get("/", (req, res) => {
    res.send("Hii from user ");
});

// -------------Signup Route ----------------------

router.post("/signup", async (req, res) => {
    const body = req.body;
    console.log("Body is ", body);

    const { success } = signupBody.safeParse(body);

    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    // if successfully parsing zod validation  then find the userId

    const existingUser = await User.findOne({
        username: req.body.username
    })

    console.log("existing user", existingUser);
    // if user id is already existing then return

    if (existingUser) {
        return res.json({
            msg: "email already exists /inputs invalid  from exixt",
        });
    }

    // hashing Implement hashing 
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role || 'guest'
    });
    console.log(user);

    const userId = user._id;



    const token = jwt.sign(
        {
            userId,
            role: user.role,
        },
        JWT_SECRET
    );
    //console.log(token);
    res.json({
        msg: "user created successfully",
        token: token,
    });
});

// -------------Signin Route ----------------------

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: " Incorrect Credentials"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
    });
    // Compare password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password",
        });
    }
    console.log("password matched ");
    if (user) {
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            JWT_SECRET
        );
        console.log(token);
        res.json({
            token: token,
        });
        return;
    }
    res.status(411).json({
        message: "Error while logging in",
    });
});

//------------------update: Route to update user information--------------

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
    console.log("Request body:", req.body);
    console.log("User ID from token:", req.user.userId);

    const { success, data, error } = updateBody.safeParse(req.body);
    console.log("data ", data);
    console.log("success ", success);

    if (!success) {
        return res.status(400).json({
            msg: "Error while updating the information",
            error: error.issues
        });
    }

    const updateData = { ...data };

    if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        updateData.password = hashedPassword;
    }

    try {
        const userId = req.user.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: "Invalid user ID" });
        }

        const user = await User.findOneAndUpdate(
            { _id: userId },
            updateData,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
            });
        }

        res.json({
            message: "Updated successfully",
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
});

/*------------------update: Route2: Route to get users from the backend, 
filterable via firstName/lastName */

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })
    console.log(typeof users, users);
    res.json({
        user: users.map((user) => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        })),
    });
});
// Define a dynamic role route
router.get("/roles/:role", authMiddleware, checkRoles(['admin', 'customer', 'reviewer', 'guest']), (req, res) => {
    const role = req.params.role;
    res.send(`Welcome ${role.charAt(0).toUpperCase() + role.slice(1)}`);
});

module.exports = router;