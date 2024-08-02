import express from "express";
import {create} from 'express-handlebars'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import flash from 'connect-flash'
import session from 'express-session'
import varMiddleware from "./middleware/var.js"
import userMiddleware from "./middleware/user.js";
import cookieParser from "cookie-parser"
import hbsHelpers from './utils/index.js'

import AuthRoutes from './routes/auth.js'
import ProductsRoutes from './routes/products.js'



dotenv.config()
const app = express()

const hbs = create({ defaultLayout: 'main', extname: 'hbs', helpers: hbsHelpers })

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(session({secret: "qwerty", resave: false, saveUninitialized: false}))
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use(AuthRoutes)
app.use(ProductsRoutes)

const startApp = () => {
    try {
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
    .then(() => console.log('Mongo DB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
    
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
})
    } catch (error) {
        console.log(error);
    }
}

startApp()



 