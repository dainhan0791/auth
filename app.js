const express = require('express');
const app = express();
const port = 3000
const path = require('path');
const bodyParser = require('body-parser');
const accountRouter = require('./routes/accountRouter');
const accountModel = require('./models/accountModel');
const { off } = require('./models/accountModel');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// static files
app.use('/static',express.static(path.join(__dirname,'public')))

app.get('/',(req, res) => {
    const page = path.join(__dirname,'index.html')
    res.sendFile(page)
})

app.post('/register',(req, res,next) => {
    const username = req.body.username
    const password = req.body.password

    accountModel.findOne({username, password})
    .then((account) => {
        if(account){
            res.json('Account already exists')
        }else{
            return accountModel.create({username, password})
        }
    })
    .then((data)=>{
        res.json('Register Successfully')
    })
    .catch((err)=>{
        res.status(400).json('Register Failure')
    })
})

app.post('/login', (req,res,next)=>{
    const username = req.body.username
    const password = req.body.password

    accountModel.findOne({ username: username, password: password})
    .then(data => {
        if(data){

            res.json('Login successful')
        }else{
            res.status(400).json('Login failed')

        }
    })
    .catch(err => {
        res.status(500).json('Error Database')
    })

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