class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        // when we extend any class parent class's constructor not automatically called.
        // so using super we call parent class constructor  
        // class Error {
        //     constructor(message){
        //         this.message = message
        //     }
        // } this is how it present there so we need to use super
        
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if(stack){
            // if stack trace available then give it
            this.stack = stack
        }else{
            // else generate it automatically
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}
