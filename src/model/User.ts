import mongoose, { Schema, Document } from "mongoose";
import { types } from "util";

//MESSAGE schema 
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

//USER schema
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpire: Date;
    isVerified: boolean;
    isAccepting: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i
            , 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],

    },
    verifyCode: {
        type: String,
        required: [true, 'Verify code is required'],

    },
    verifyCodeExpire: {
        type: Date,
        required: [true, 'VerifyCode Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAccepting: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

//checking if the user model has been intialized in the DB before or not
const UserModel = (mongoose.models.User as mongoose.Model<User>) ||
    (mongoose.model<User>("User", UserSchema))

export default UserModel;