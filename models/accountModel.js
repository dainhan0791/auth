const mongoose = require('mongoose')

const URL = 'mongodb+srv://thaidainhan:thaidainhan792001@cluster0.x0veo.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(URL, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const {Schema} = mongoose

const accountSchema = new Schema({
    username:'String',
    password:'String',
    address:'String',
    phone:'String',
},{
    collection:'accounts'
})

const accountModel= mongoose.model('accounts',accountSchema)
module.exports = accountModel