const express  = require('express');
let router = express.Router();
require('dotenv').config();
const { checkLoggedIn } = require('../../middleware/auth');


const { User } = require('../../models/user_model');

router.route("/register")
.post( async (req,res)=>{
    try {
        ///1 check if email taken
        if(await User.emailTaken(req.body.email)){
            return res.status(400).json({message:'Sorry email taken'})
        }

        /// 2 creating the model ( hash password)
        const user = new User({
            email: req.body.email,
            password: req.body.password
        });

        /// 3 generate token
        const token = user.generateToken();
        const doc = await user.save();

        // 4 send email

        // save...send token with cookie
        res.cookie('x-access-token',token)
            .status(200).send(getUserProps(doc));
    } catch(error){
        res.status(400).json({message:'Error',error: error });
    }
});

router.route('/signin')
.post(async(req, res)=>{
    try {
        //find user
       let user = await User.findOne({email: req.body.email});
       if (!user) return res.status(400).json({message: 'Bad email'});
       //compare password
       const compare = await user.comparePassword(req.body.password);
       if (!compare) return res.status(400).json({message: 'Bad password'});
       //generate token
       const token = user.generateToken();
       //response
       res.cookie('x-access-token', token)
           .status(200).send(getUserProps(user));
    } catch(error) {
        res.status(400).json({message:'Error',error: error });
    }
});

//using this so we aren't getting back sensitive data. Allows us to
//send back what we want to instead of everything.
const getUserProps = (user) => {
    return {
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        age: user.age,
        role: user.role
    }
};

router.route('/profile')
.get(checkLoggedIn, grantAccess('action', 'resource'), async(req, res)=>{

    res.status(200).send('ok profile');
});

module.exports = router;