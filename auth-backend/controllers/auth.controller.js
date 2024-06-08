import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import generateJWTTokenAndSetCookie from "../utils/generateToken.js";

const signup = async (req, res) => {
    try{
        const { username, password } = req.body;
        const hashedPassoword = await bcrypt.hash(password, 10);

        const foundUser = await User.findOne({username});

        if(foundUser) {
            res.status(201).json({message: "Username already exists!"});
        } else {
            const user = new User({username : username, password : hashedPassoword});
            generateJWTTokenAndSetCookie(user._id, res);
            
            await user.save();
            res.status(201).json({message: "User created successfully!"});
        }
    } catch(error) {
        res.status(501).json({message: "Error in User creation!"});
        console.log("Error while inserting user - " + error.message);
    }
}

export const login = async (req, res) => {
    try{
        const { username, password } = req.body;

        const foundUser = await User.findOne({username});
        if(!foundUser) {
            res.status(401).json({message: "Auth failed!", status: 401});
        } else {
            const passwordMatch = await bcrypt.compare(password, foundUser?.password);

            if(!passwordMatch) {
                res.status(401).json({message: "Auth failed!"});
            }
            
            generateJWTTokenAndSetCookie(foundUser._id, res);
            res.status(201).json({
                message: "User logged in",
                status: 200,
                _id: foundUser._id,
                username: foundUser.username
            });
        }
    } catch(error) {
        res.status(501).json({message: "Login failed"});
        console.log("Error while logging in user - " + error.message);
    }
}


export default signup;