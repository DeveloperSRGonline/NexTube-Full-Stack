# ⚠️ Production Security Notes

- Production mein kabhi bhi allow access from anywhere nahi karte hai
- Connection string needed to connect with `database`
- Whatever is not that much sensitive and can be used so many places in code we can store it in constant

---

## Database Connection Approaches

### Approach 1: Connection logic inside `index.js`
- DB connection logic in a function inside `index.js` file so when index.js file `run` it will also `execute`

```javascript
// index.js
import mongoose from "mongoose"
import express from "express"

const app = express()

// connection directly inside index.js
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERRR: ", error)
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listenning on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})() // IIFE
```

### Approach 2: Separate DB folder
- DB connection logic inside function present in db folder separately then `import` it and `execute` it
- Check this approach just by going to the db folder directly

**Tech Stack:**
- App with `express`
- Database with `mongoose`
- `dotenv` for env configuration

**Important:**
- When connecting with DB you must wrap it with `try-catch`
- Database always in another continent

---

## URL Encoding

- URL encoding like `shivam+webdev` or `shivam%webdev` like this data that come with the URL, Express has to understand it properly so that we use `url-encoding`

---

## HOC (Higher Order Components)

- Instead of making separate function each time for async and try catch so we can create its HOC so that we can use it as many time as we want

**Definition:**
`HOC - Accept function as a parameter and return function` - as treat as like a variable aur kuchh nahi

- Response also we are sending differently each time not proper format, now we will make also HOC for response sending also so that sending response will have proper response

---

# HTTP Status Codes

```
1. Informational responses (100 - 199)
2. Successful responses (200 - 299)
3. Redirection messages (300 - 399)
4. Client error responses (400 - 499)
5. Server error responses (500 - 599)
```

---

## JWT & Authentication

- JWT is a barrier token (means ye token jiske bhi pass hoga usko data mil jayega)
- Access token database mein store nahi hoga
- Refresh token database mein store hoga
- We are using sessions & cookies both

---

## Middleware

- `Middleware` - jane se pahele mujhse mil ke jana

---

## File Handling Flow

**Process:**
- User se file upload karvayenge
- Multer ke through
- Cloudinary kya karta hai - apne server par upload (Cloudinary or AWS)

**Implementation:**
- Hum kya karenge multer ka use karte huye user se file lekar temporary apne local server pe
- Next step cloudinary ka use karte huye vo local se file lekar cloudinary par upload kar denge
- Directly karne ka fayda hai ki hum in any case kuchh problem hone par reupload kar paye

---

## Problem Solving / Logic Building

> Break problem in small chunks
- Think about that one small chunk and try to solve it
- Then next
- And so on
- At last combine all small chunks and make complete solution

---

## Routes Architecture

- `routes` hit hone par hi toh methods jo banaye vo execute honge isliye routes folder mein `routes` banane padenge
- Hum separately chije kyo bana rahe taki chije manage ho paye properly `scalable` and `maintainable` ban paye


# Debugging: TypeError - argument handler must be a function

## Error
```
TypeError: argument handler must be a function
    at Route.<computed> [as post]
```

## Root Cause
When passing a handler to Express route (e.g., `.post(registerUser)`), the imported value was `undefined`.

---

# Multer File Upload Structure

## `req.files` Object Structure

When files are uploaded via multer, `req.files` contains the uploaded file information.

**Structure:**
```javascript
[Object: null prototype] {
  avatar: [
    {
      fieldname: 'avatar',           // Form field name
      originalname: 'filename.png',   // Original file name
      encoding: '7bit',              // File encoding
      mimetype: 'image/png',         // MIME type
      path: 'public\\temp\\filename.png',  // Local storage path
      destination: 'public/temp',     // Storage directory
      filename: 'filename.png',       // Stored filename
      size: 5711419                   // File size in bytes
    }
  ],
  coverImage: [
    {
      fieldname: 'coverImage',
      originalname: 'filename.png',
      encoding: '7bit',
      mimetype: 'image/png',
      path: 'public\\temp\\filename.png',
      destination: 'public/temp',
      filename: 'filename.png',
      size: 5604647
    }
  ]
}
```

**Key Points:**
- `req.files` is an Object with null prototype
- Each form field (e.g., `avatar`, `coverImage`) contains an array of files
- Access single file: `req.files?.avatar?.[0]?.path`
- The `path` property gives the local file path before uploading to cloudinary

## Debugging Approach
1. Add console.log before the route definition:
   ```javascript
   console.log("registerUser:", registerUser);
   console.log("typeof registerUser:", typeof registerUser);
   router.route("/register").post(registerUser)
   ```

2. If it logs `undefined`, check:
   - The export/import names match
   - The file path is correct
   - The source file has no syntax errors
   - **Wrapper functions have `return` statements**

3. Common issue: Missing `return` in HOC/wrapper functions
   ```javascript
   // WRONG - returns undefined
   const asyncHandler = (requestHandler) => {
       (req, res, next) => { ... };
   };

   // CORRECT - returns the function
   const asyncHandler = (requestHandler) => {
       return (req, res, next) => { ... };
   };
   ```

## Key Takeaway
When an imported value is `undefined`, always check the source file for:
- Missing `return` statements in wrapper functions
- Syntax errors preventing exports
- Export/import name mismatches
- Circular dependencies