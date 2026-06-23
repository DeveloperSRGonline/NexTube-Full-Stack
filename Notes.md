# ⚠️ production mein kabhi bhi allow access from anywhere nahi karte hai
# - connection string needed to connect with `database`
## whatever is not that much sensitive and can be used so many places in code we can store it in constant

## database connection two approches
- db connection logic in a function inside `index.js` file so when index.js file `run` it will also `execute`

``` javascript
> index.js

import mongoose from "mongoose"
import express from "express"

const app = express()

// connection directly inside index.js
(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERRR: ",error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listenning on port ${process.env.PORT}`)
        })
    }catch(error){
        console.error("ERROR: ",error)
        throw error
    }
})() // iffe 
```
- db connection logic inside function present in db folder seperately then `import` it and `execute` it.
-- check this approch just by going to the db folder directly

-- app with `express`
-- database with `mongoose`
-- `dotenv` for env configuration

need to install mongoose , express , dotenv packages no internet so not installed just code written.

- when connecting with db you must wrap it with `try-catch`
> database always in another continent

