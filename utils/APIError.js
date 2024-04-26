// it is for handling the error in the api 
// here we would be overwriting the existing functionality in the errors provided by the node.js
//message="Something went wrong" this means if we have some message it will take that value o/w "Something wen wrong"
class ApiError{
    constructor(statusCode,message="Something went wrong",errors=[],stack=""){
       
        this.statusCode=statusCode,
        this.message=message,
        this.errors=errors
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export {ApiError}