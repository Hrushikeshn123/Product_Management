const ProductModel = require("../model/product.model")
const UserModel = require("../model/user.model")

const BasicController = {
    homePage(request,response){
        if(request.session.login == undefined){
            response.redirect("/Login")
            return false
        }
     response.render("dashboard",{
        login:request.session.login, 
     })  
     
    },

    logout(request,response){
    delete request.session.login
    response.redirect("/")
    },

    loginPage(request, response){

        if(request.session.login !== undefined){
            response.redirect("/Login")
            return false
        }

        let message = request.session.message !== undefined ? request.session.message : ""
        delete request.session.message
        response.render("login",{
            message: message,
        })
        
    },

    registrationPage(request, response){
        if(request.session.login !== undefined){
            response.redirect("/Login")
            return false
        }
        let message = request.session.message !== undefined ? request.session.message : ""
        delete request.session.message
        response.render("new_registration",{
            message: message,
            newUser:{...request.session.newUser},   
        }) 
        
    },

   async saveUser(request,response){
        let data = request.body
        
    try{
        let newUser = UserModel({
            name:data.fullName,
            password:data.password,
            mobile:data.mobile,
            email:data.email,
        

        })
        
       let isUserExists = await UserModel.findOne({email:{$regex:"^"+data.email+"$",$options:'i'},})
        if(isUserExists){
            
            request.session.message="Email alredy taken"
            request.session.newUser ={...data}
        }else{
            let result= await newUser.save()
            if(result){
     
             request.session.message="User registration done succesfully ,you can login now"
             request.session.newUser ={}
             response.redirect("/")
             }else{
             request.session.message="Unable to save user,try again"
             request.session.newUser ={...data}
             response.redirect("/new-registration")

            }
        }
       
    }catch(error){
        request.session.message="Unable to save user,try again"
        request.session.newUser ={...data}
        response.redirect("/new-registration")
        
      }
      
    },

    async removeUsers(request,response){
      let  result =  await UserModel.deleteMany({})
      response.json({ 
        status: true,
        result,
      })
    },

    async userLogin(request,response){
      let data = request.body 
      try{
        let user = await UserModel.findOne({
            email:{$regex:`^${data.email}$`,$options:"i"},
            password:data.password,
          },
          {password:0}
          )
          if(user){
            request.session.login={user}
            response.redirect("/Login")
          }else{
            request.session.message="Username or paswword is erong ,try again" 
            response.redirect("/") 
          }
      }catch(error){
        request.session.message="something went wrong,try again" 
        response.redirect("/") 
      } 
      
    }, 
    async saveProduct(request,response){
     try{
     let {productName,qty,price,mangDate,id}= request.body 
     let newProduct = new ProductModel({
      productName,
      qty,
      price,
      mangDate,
      id,
      image: request.file.filename,
     })
     let result = await newProduct.save()
     if (result){
      response.json({status:true, message: "product saved"})
     }else{
      response.json({status:false, message: "unable to  saved try again"})
     }
    }catch(error){
      response.json({status:false, message: "server error try again"})
      }
  },
  async getProduct(request,response){
    try{
      if(request.session.login !== undefined){
        let result = await ProductModel.find({
          id: request.session.login.user._id
        })
        response.json({status:true, result})
      }else{
        response.status(401).json({
          status: false,
          message: "Sessiom is expire re-login again"
        })
      }
    }catch(error){
      response.status(500)
      .json({status:false, message:"server error, try again"})
    }
  },

  async removeProduct(request,response){
    let {id} = request.params
    try{
       await ProductModel.findByIdAndDelete(id)
      response.json({status:true, message: "product removed succesfully",})
    }catch(error){
      response.json({status:false, message:"server error, try again"})
    }
  }

}

module.exports =BasicController
