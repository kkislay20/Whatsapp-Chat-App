import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, unique: true }
    }  
);

const userModel = mongoose.model('User', userSchema, 'Users');

export default userModel;