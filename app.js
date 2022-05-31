const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors())
const port = 3000
const path = require('path');
const bodyParser = require('body-parser');
const accountRouter = require('./routes/accountRouter');
const accountModel = require('./models/accountModel');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// static files
app.use('/static',express.static(path.join(__dirname,'public')))


// LOGIN
const secret = "thaidainhan"

app.get('/login',(req, res,next) => {
    const page = path.join(__dirname,'login.html')
    res.sendFile(page)
})
app.get('/home',(req, res, next) => {
    const token = req.cookies.token
    const decodeToken = jwt.verify(token,secret)
    accountModel.find({_id:decodeToken._id})
    .then( (data) => {
        if(data.length == 0){
            return res.redirect('/login')
        }else{
            if(data[0].role <= 2){
                next()
            }else{
                return res.redirect('/login')
            }
        }
    })
    
}
,(req, res,next) => {
    res.sendFile(path.join(__dirname,'home.html'))
})
app.post('/edit', (req, res, next) => {
    const token = req.headers.cookie.split('=')[1]
    const decodeToken = jwt.verify(token,secret)
    accountModel.find({_id:decodeToken._id})
    .then( (data) => {
        if(data.length == 0){
            return res.redirect('/login')
        }else{
            if(data[0].role == 2){
                next()
            }else{
                return res.json({
                    error: true,
                    message: 'Ban Khong Co Quyen Sua'
                })
            }
        }
    })
},
(req, res)=>{
    res.json('Sua thanh cong')
    
})

app.post('/login',(req,res,next) => {
    const username = req.body.username
    const password = req.body.password

    accountModel.findOne({
        username: username,
        password: password,
    })
    .then( (data) => {
        if(data){
            const token = jwt.sign({
                _id : data._id
            }, secret)
            return res.json({
                message: 'Login successful',
                token: token
            })
        }else{
            return res.json('Login failure')
        }
    })
    .catch( (err) => {
        res.status(500).json(err)
    })
    
})
app.get('/private', (req,res,next) => {
    try{
        const token  = req.cookies.token
        const result = jwt.verify(token, secret)
        accountModel.findOne({
            _id: result
        })
        .then( (data) => {
            if(data){
                req.data = data
                next()
            }else{
                res.status(403).json('Login Failed')
            }
        })
        .catch( (err) =>{
            res.status(500).json(err)
        })
       
        
    } catch (err) {
        res.redirect('/login')
    }
   
},(req,res,next) => {
    res.json(req.data.username)
})

const checkLogin = (req, res,next) => {
    try{
        const token = req.cookies.token
        const idAccount = jwt.verify(token,secret)
        accountModel.findOne({
            _id: idAccount
        })
        .then( (data) => {
            if(data){
                req.data = data
                next()
            }else{
                res.json('NOT PERMISSION')
            }
        })
        .catch((err) => {
            res.status(500).json(err.message)
        })

    }catch(err){
        res.status(500).json(err)
    }
}
const checkStudent = (req,res,next) => {
    const role = req.data.role;
    if(role <= 3){
        next()
    }else{
        res.json('NOT PERMISSION')
    }
}
const checkTeacher = (req,res,next) => {
    const role = req.data.role;
    if(role >= 1){
        next()
    }else{
        res.json('NOT PERMISSION')
    }
}
const checkManager = (req,res,next) => {
    const role = req.data.role;
    if(role >=2){
        next()
    }else{
        res.json('NOT PERMISSION')
    }
}
app.get('/task',checkLogin,checkStudent, (req, res) => {
    console.log(req.data)
    res.json('All Task')
})
app.get('/student',checkLogin,checkTeacher, (req, res, next) => {
    res.json('Student')
})
app.get('/teacher',checkLogin,checkManager, (req, res, next) => {
    res.json('teacher')
})

const PAGE_SIZE = 2
app.get('/accounts',(req, res,next) =>{
    let page = req.query.page
    if(page){
        page = parseInt(page)
        if(page <= 0){
            page = 1
        }
        let skip = (page - 1) * PAGE_SIZE
        accountModel.find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((account) =>{
            accountModel.countDocuments({}).then((total) =>
            {
                let totalPage = Math.ceil(total / PAGE_SIZE)
                
                res.json({
                    total: total,
                    totalPage: totalPage,
                    data: account
                })
            })
        })
        .catch((error) =>{
            res.status(500).send(error)
        })  
    }else{
        accountModel.find({})
        .then((account) =>{
            res.json(account)
        })
        .catch((error) =>{
            res.status(500).send(error)
        })  
    }
})
app.use('/api/accounts',accountRouter)
app.listen(port, (req, res) => {
    console.log(`Server is listening on ${port}`);
});