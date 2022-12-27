const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token("data", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${data.length} people<div><br/><div>${Date()}<div>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = data.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
}) 

app.post('/api/persons', (request, response) => {
  const newPerson = request.body

  if (data.find(person => (person.name === newPerson.name) && (person.number === newPerson.number))) {
    response.status(400).json({'error':'Person already exists.'});
  } else if (!newPerson.name) {
    response.status(400).json({'error':'Missing name.'})
  } else if (!newPerson.number) {
    response.status(400).json({'error':'Missing number.'})
  } else {
    let id = Math.trunc(Math.random() * 100);
    
    while (data.map(person => person.id).includes(id)) {
      id = Math.trunc(Math.random() * 100);
    }
    
    newPerson.id = id;
    
    data = data.concat(newPerson);
    
    response.status(201).json(newPerson);
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data = data.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})