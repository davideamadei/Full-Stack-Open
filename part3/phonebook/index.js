const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
morgan.token('contact', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})


app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))
app.use(express.json())

let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]


app.get('/persons', (request, response) => {
    response.json({'data': persons})
    response.status(200).end()
})

app.get('/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/persons', (request, response) => {
    const id = "" +Math.floor(Math.random() * (10 ** 10))
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'contact data missing' 
        })
    }

    if (persons.some(person => person.name === body.name)){
        return response.status(409).json({
            error: 'name must be unique'
        })
    }
    person = {
        id : id,
        name : body.name,
        number : body.number
    }

    persons = persons.concat(person)
    console.log('Added new contact')
    response.json(person)
})

app.delete('/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.json({id: id})
    response.status(204).end()
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>`+
        `<p>${date}</p>`
    )
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})