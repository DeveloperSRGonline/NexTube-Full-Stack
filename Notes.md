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

- when connecting with db you must wrap it with `try-catch`
> database always in another continent


- url encoding like shivam+webdev or shivam%webdev like this data that come with the url express has to understand it properly so that we use `url-encoding`.

- instead of making seperate function each time for async and try catch so we can create its hoc so that we can use it as many time as we want 

`HOC - Accept function as a parameter and return function` - as treat as like a variable aur kuchh nahi 

- response also we are sending differently each time not proper formate now we will make also hoc for response sending also so that sending response will have proper response 


# StatusCode

```
1. Informational responses (100 - 199)

2. Successful responses (200 - 299)

3. Redirection messages (300 - 399)

4. Client error responses (400 - 499)

5. Server error responses (500 - 599 )
```

- jwt is a barrier token (means ye token jiske bhi pass hoga usko data mil jayega)

- access token database mein store nahi hoga
- refresh token database mein store hoga
- we are using sessions & cookies both
- 