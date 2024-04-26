import multer from "multer";
//multer it is a nodejs middleware for handling form data i.e more likely to handle files and all that

const storage=multer.diskStorage({   // diskstorage means it will be stored in disk u can use memoeystroage for smaller files as well
    destination:function(req,file,cb){      // giving the path where it will be stored
        cb(null,"../public/temp"    )
    },
    filename:function(req,file,cb){   // naming files u can do any set of operation to make some complex name for it but here we are keeping original name of file saved in client local storage
        cb(null,file.originalname)
    }
})

export const upload=multer({storage,})