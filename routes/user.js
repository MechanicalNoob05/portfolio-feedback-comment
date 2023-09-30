const express = require('express')
const router = express.Router()
const User = require('../models/user')

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'internwala_project';

router.post('/login', [body('password', 'Enter a valid password').exists(), body('email', 'Enter a valid Email').isEmail()], async (req, res) => {
    ("Processing a request to LOgin");
    const errors = validationResult(req);
    // check for empty fields
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        // find the user 
        if (!user) {
            return res.status(400).json({ errors: errors.array() });
        }
        // compare the password 
        const passwordcompare = await bcrypt.compare(password, user.password)
        if (!passwordcompare) {
            return res.status(400).json({ errors: errors.array() });
        }
        const data = {
            user: {
                id: user._id
            }
        }
        // create a token for the verification purpose
        const jwttoken = jwt.sign(data, JWT_SECRET)
        res.json({ jwttoken })
    } catch (err) {
        res.json({ errors: err, message: err.message })
    }
})

// router.post('/signup', async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt();
//         const hashedPassword = await bcrypt.hash(req.body.password,salt);
//         const comment = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword
//         })
//         try {
//             const newComment = await comment.save()
//             res.status(201).json(newComment)
//         } catch (err) {
//             res.status(400).json({ message: err.message })
//         }
//     } catch (error) {
//         res.status(500).send()
//         console.log(error)

//     }
// })
router.post('/signup',async(req,res)=>{
    ("Processing a request to Register");

    try{
        const{name, email ,password,} = req.body;
        // check for empty fields
        if(!name || !email || !password) {
            return res.status(400).json({ msg: "Not all fields have been entered" });
        }
        // check the length of Password
        if(password.length <6){
            return res.status(400).json({msg: "Password is too Short."});
        }
        // checking the availability of Number
        const emailTaken = await User.findOne({email});
        if(emailTaken){
            res.status(409).json({msg: "This email is Already Taken."});
            return;
        }
        // generate the hashing for password 
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);
        const user = new User({
            name :name,
            email :email ,
            password: passwordHash,
        });
        const savedUser = await user.save();
        return res.status(201).json({savedUser});
    }
    catch(error){
       return res.status(500).json({err:error.message});
    }
})

var fetchuser = require('../middleware/fetchuser')

router.post('/update',fetchuser, async (req, res) => {
    try {    
        const userid = req.user.id
        let filter = { _id: userid };
        let update = {
            name: req.body.name,
            email: req.body.email,
        };
        let user = await User.findOneAndUpdate(filter, update, { new: true });
        return res.status(200).json({ user });
    }
    catch (error) {
        return res.status(500).json({ err: error.message });
    }

})

module.exports = router
