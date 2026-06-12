
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://davide:${password}@fullstackopen.clawnyd.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length == 3) {
    console.log('phonebook:')
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(contact.name, contact.number)
        })
        mongoose.connection.close()
    })
}

else if (process.argv.length != 5) {
    console.log('invalid number of arguments')
    mongoose.connection.close()
}

else {
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })
    contact.save().then(result => {
        console.log('added', contact.name, 'number', contact.number, 'to phonebook')
        mongoose.connection.close()
    })
}