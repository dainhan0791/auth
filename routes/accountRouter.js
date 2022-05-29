const express = require('express');

const accountRouter = express.Router()
const accountModel = require('../models/accountModel')

accountRouter.get('/',(req,res,next) => {
    accountModel.find({})
    .then((account) =>{
        res.json(account)
    })
    .catch((error) =>{
        res.status(500).send(error)
    })
})
accountRouter.get('/:id',(req,res,next) => {
    const id = req.params.id
    accountModel.findById(id)
    .then((account) =>{
        res.json(account)
    })
    .catch((error) =>{
        res.status(500).send(error)
    })
})


accountRouter.post('/',(req,res,next) => {
    const username = req.body.username
    const password = req.body.password
    const address = req.body.address
    const phone = req.body.phone

    accountModel.create({
        username: username,
        password: password,
        address: address,
        phone: phone
    })
    .then((response) =>{
        res.status(200).send(response)
    })
    .catch((error) =>{
        res.status(500).send(error)
    })
})

accountRouter.put('/:id',(req,res,next) => {
    const id = req.params.id
    const newPassword = req.body.newPassword
    accountModel.findByIdAndUpdate(id,{
        password: newPassword
    })
    .then((data) => {
        res.json('Updated Account')
    })
    .catch((err) => {
        res.status(500).json('Error Server!')
    })
})
accountRouter.delete('/:id',(req,res,next) => {
    const id = req.params.id
    accountModel.deleteOne({_id: id})
    .then(() =>{
        res.json('deleted')
    })
    .catch(err =>{
        res.status(500).send('Error deleting account')
    })
})

module.exports = accountRouter