const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const { User } = require('./user.model');
const { isEmail, isEmpty } = require('../../helpers/validators');
const validateRegister = (data) => {
    let errors = {};
    //Validate email
    if (isEmpty(data.email)) {
        errors.email = "Email is required";
    } else if (!isEmail(data.email)) {
        errors.email = "Email invalid";
    }
    //Validate password
    if (isEmpty(data.password)) {
        errors.password = "Password is required";
    } else if (data.password.length < 6) {
        errors.password = "Password must be more 6 character";
    }
    //Validate confirm password;
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Confirm password do not match"
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}
const validateLogin = (data) => {
    let errors = {};
    //Validate email
    if (isEmpty(data.email)) {
        errors.email = "Email is required";
    } else if (!isEmail(data.email)) {
        errors.email = "Your account invalid";
    }
    //Validate password
    if (isEmpty(data.password)) {
        errors.password = "Password is required";
    } else if (data.password.length < 6) {
        errors.password = "Your account invalid";
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}

module.exports.register = async (req, res) => {
    const { valid, errors } = validateRegister(req.body);
    if (!valid) return res.status(400).json({
        error: errors,
    })
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({
            error: `Email ${email} already exist`
        })
        const newUser = new User({ email, password });
        const userRegistered = await newUser.save();
        const payload = { _id: userRegistered._id, email: userRegistered.email, role: userRegistered.role };
        console.log(payload);

        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: 36000000 },
            (error, token) => {
                console.log(error, token);
                if (error) throw error;
                return res.status(201).json({
                    jwt: token
                })
            }
        )

    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on server'
        })
    }
}


module.exports.login = async (req, res) => {
    const { valid, errors } = validateLogin(req.body);
    if (!valid) return res.status(400).json({
        error: errors,
    })
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({
            error: `Your account invalid`
        })
        const isMatched = await bcryptjs.compare(password, user.password);
        if (!isMatched) return res.status(400).json({
            error: `Your account invalid`
        })
        const payload = { _id: user._id, email: user.email, role: user.role };
        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY || 'abc123',
            { expiresIn: 36000000 },
            (error, token) => {
                if (error) throw error;
                return res.status(201).json({
                    jwt: token
                })
            }
        )

    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on server'
        })
    }
}