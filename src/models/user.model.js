import mongoose, { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true, // to make it optimized serchable
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, // cloudnary url
            required: true,
        },
        coverImage: {
            type: String, // cloudnary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,// video id which we will save 
                ref: "Video",
            },
        ],
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,// createdAt , updatedAt
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// adding a method to check/compare it with the userPassword
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);// true or false return hoga
};


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// user ke id se jwt token banane ke liye method
userSchema.methods.generateRefreshToken = function () {
    // jwt sign method deta hai taki token generete kar paye
    return jwt.sign(
        {
            // id jis basis par token banana hai
            _id: this._id,
        },
        // secret
        process.env.REFRESH_TOKEN_SECRET,
        {
            // expiry time
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};


export const User = model("User", userSchema); // in mongodb : users
