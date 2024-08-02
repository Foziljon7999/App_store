import { Router } from "express"
import User from "../models/user.js"
import bcrypt from 'bcrypt'
import { generateJWTToken } from "../services/token.js"


const router = Router()

router.get("/login", (req, res) => {
    if(req.cookies.token) {
        res.redirect('/')
        return
    }
    res.render('login', {title: 'Login | Fozily',
    isLogin: true,
    loginError: req.flash('loginError')
})
})

router.get('/logout', (req, res) => {
    if(!req.cookies.token) {
    res.redirect('/')
    return
    }
    res.clearCookie('token')
    res.redirect('/')
})

router.get("/register", (req, res) => {
    res.render('register', {title: 'Register | Fozily',
    isRegister: true,
    registerError: req.flash('registerError')
  })
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        req.flash('loginError', 'All field is required')
        res.redirect("/login")
        return
    }

    const existUser = await User.findOne({email})
        if(!existUser) {
            req.flash('loginError', 'User not found')
            res.redirect("/login")
            return 
        }

        const isPassEqual = await bcrypt.compare(password, existUser.password)
        if(!isPassEqual) {
            console.log('Password wrong')
            return
        }

        const token = generateJWTToken(existUser._id)
        res.cookie("token", token, {httpOnly: true, secure: true})
    res.redirect("/")
})

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    if(!firstName || !lastName || !email || !password ){
        req.flash('registerError', 'All field is required')
        res.redirect("/register")
        return
    }

    const candidate = await User.findOne({email})

    if(candidate){
        req.flash('registerError', 'User already exist')
        res.redirect("/register")
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword
    }
const user = await User.create(userData)
const token = generateJWTToken(user._id)
res.cookie("token", token, {httpOnly: true, secure: true})
    res.redirect("/")
})

export default router