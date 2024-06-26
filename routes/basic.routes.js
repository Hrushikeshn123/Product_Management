const BasicController = require("../controller/basic.controller")
const BasicRouter = require("express").Router()

const {noUpload, uploadFile} = require("./middleware")


BasicRouter.get('/', BasicController.loginPage)
BasicRouter.get('/Login', BasicController.homePage)
BasicRouter.get('/new-registration', BasicController.registrationPage)
BasicRouter.get('/logout', BasicController.logout)

BasicRouter.get('/get-product',BasicController.getProduct)

BasicRouter.post('/save-user', BasicController.saveUser)
BasicRouter.get("/remove-user",BasicController.removeUsers)
BasicRouter.post("/user-login",BasicController.userLogin) 
BasicRouter.post(
   "/save-new-product",
    uploadFile.single('pic'),
  BasicController.saveProduct)

BasicRouter.delete('/remove-product/:id',BasicController.removeProduct)  
module.exports=BasicRouter
