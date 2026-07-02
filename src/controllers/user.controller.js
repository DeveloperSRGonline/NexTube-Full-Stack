import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../services/cloudinary.service.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
      try {
        const user = await User.findById(userId) // database mein find
        const accessToken = user.generateAccessToken()//  generation
        const refreshToken = user.generateRefreshToken()//  generation

        // basically yuser kya hai user ki saati details of object hi toh hai user ke andar refreshToken add kar deta hai
        user.refreshToken = refreshToken
        // save karte time kahi baar password kikk in ho jata hai 
        await user.save({ validateBeforeSave:false }) // validation mat lagao sidha save kar do , db hai time lagega await laga dete hai

        // finally accessToken and refreshToken ko return kar dete hai
        return { accessToken, refreshToken }

      } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
      }
}

const registerUser = asyncHandler(async (req, res) => {
    // step - 1: get user details from frontend
    // step - 2: validation - not empty
    // step - 3: check if user already exists: username, email
    // step - 4: check for images, check for avatar
    // step - 5: upload them to cloudinary, avatar
    // step - 6: create user object - create entry in db
    // step - 7: remove password and refresh token field from response
    // step - 8: check for user creation
    // step - 9: return res

    const { fullName, email, username, password } = req.body

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        // or operator
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists")
    }



    // local is liye kyoki just locally upload karne ka path liya not cloudinary wala diya
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    let coverImageLocalPath;
    // first check request has files then check arraay hai and kya ur array mein kuchh hai kya nahi length tab
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar localPath is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar cloudinary upload failed")
    }

    // database mein entry
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),// in db username will be store in lowercase
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(201).json(
        // new keyword se ApiResponse ka object bana rahe aur kuchh nahi jo class hum ne utils mein banai thi uska
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req,res) => {
    // req body se data le aao
    const {email,username,password} = req.body

    if(!username || !email){
        throw new ApiError(400,"Username or email is required")
    }

    // fing the user
    // mongodb return first document
    const user = await User.findOne({
        $or:[{email},{username}] // ya toh username ke basis pe ya toh email ke basis pe
    })
    // agar user kabhi register tha hi nahi
    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    // password check
    // yaha pe capital User se nahi small user se method milega isPasswordCorrect , capital ye mongoose ka method hai(ye jo findOne, create, etc. ye sab mongoose ke methods hai) 
    const isPasswordValid = await user.isPasswordCorrect(password)

    // agar password thik hai toh 
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }
    
    // access and refresh token ye na baa bar use hoga toh isliye isse ek alag function mein hi bana lete hai
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    // send cookie 
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true, 
        secure:true // only modifiable by server not by client
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req,res) => {
    
})

export { registerUser,loginUser }