const multer = require("multer") 
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "./public/images/")

    },
    filename: function (req, file, cb){
        console.log(file)
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9 )
       
        //cb(null, file.fieldname + "-" + uniqueSuffix)
        
        //first way to find extension of file
        //let file = "sample.png"
        // let array = file.split('.')
        //let ext = array[array.length-1]

        //second way 

        let pos = file.originalname.lastIndexOf(".")
        let ext = file.originalname.substring(pos)
        let fileName = Date.now() + ext
        cb(null, fileName)
    }
})

 const uploadFile = multer({storage : storage})
 const noUpload = multer().none() //multipart form data

 module.exports = {
    noUpload,
    uploadFile
 }