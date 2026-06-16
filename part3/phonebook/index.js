require('dotenv').config()

const Contact = require('./models/contact')
const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('contact', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})


app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))


app.get('/persons', (request, response) => {
  Contact.find({}).then(result => {
    response.json({ 'data': result })
  })
})

app.get('/persons/:id', (request, response, next) => {
  const id = request.params.id

  Contact.findById(id)
    .then(result => {
      if(result) {
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/persons', (request, response, next) => {
  const body = request.body

  const contact = new Contact({
    name : body.name,
    number : body.number
  })

  contact.save().then(result => {
    response.json(result)
  })
    .catch(error => next(error))
})

app.put('/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Contact.findById(request.params.id)
    .then(contact => {
      if (!contact) {
        return response.status(404).end()
      }

      contact.name = name
      contact.number = number
      contact.save()
        .then(updatedContact => {
          response.json(updatedContact)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

app.delete('/persons/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const date = new Date()
  Contact.countDocuments({})
    .then(count => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>`+
            `<p>${date}</p>`
      )
    })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }


  next(error)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})