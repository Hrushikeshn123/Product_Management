require('dotenv').config()
const  express = require("express")
const mongoose =require('mongoose')

const BasicRouter = require("./routes/basic.routes")
var session = require('express-session')

//shows which api is hit 
let morgan = require("morgan")

const app = express()
app.use(morgan('tiny'))



app.use(session({
    secret:'tech',
    resave:true,
    saveUninitialized: true,
    // cookie:{secure: true}
  })
)

//static sharing
 //ii is use to send file from server to browser
 app.use(express.static("public"))

app.set('views','./views')
app.set('view engine','pug')

//enable put
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/',BasicRouter)

mongoose
.connect(process.env.URI)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('DB connect succesfully')
        console.log("Port successfully runnung on", process.env.PORT)
    })
}).catch(()=>{
    process.exit(1)
})



