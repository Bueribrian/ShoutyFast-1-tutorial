const mongoose = require('mongoose')
const { database } = require('./key')

mongoose.connect(database.URI,{ useNewUrlParser: true })
    .then(db => console.log(' -- DB  is connected'))
    .catch(err  =>  console.error(err))
