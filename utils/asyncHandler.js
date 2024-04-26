// two ways if writing asynchandler it is responsible for wrapping the fn in try catch or some sought of like that
// two ways of writing it
//1
const asyncHandler=(requesthandler)=>{
return (req,res,next)=>{
    Promise.resolve(requesthandler(req,res,next)).catch((err)=>{next(err)})
}
}

//2
const asyncHandler2=(fn)=>async(req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(error.code|| 500).json({
            success:false,
            message:error.message
        })
    }
}

export {asyncHandler}