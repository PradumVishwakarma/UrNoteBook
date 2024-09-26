const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = "PradumVishwakarma";
const jwt = require('jsonwebtoken');
const fetchUser = require('../Middleware/fetchUser');


router.post('/createUser', [
    body('name', "Enter Valid Name").isLength({ min: 3 }),
    body('email', "Enter Valid Email").isEmail(),
    body('password', "Enter must be Valid Password (5 chr)").isLength({ min: 5 }),
], async (req, res) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ result: result.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Email already Exist" })
        }
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken })

    } catch (error) {
        // console.log(error.message);
        res.status(500).send("Some Error Happen");
    }
})


router.post('/login', [
    body('email', "Enter Valid Email").isEmail(),
    body('password', "Password Can't be Blank").exists()
], async (req, res) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ result: result.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Please Enter Proper Information" });
        }
        
        const compairpass = await bcrypt.compare(password, user.password);
        if (!compairpass) {
            return res.status(400).json({ error: "Please Enter Proper Information" });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }

})


router.post('/getuser', fetchUser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router