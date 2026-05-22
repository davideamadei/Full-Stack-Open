import { useState } from 'react'

import ContactForm from './components/ContactForm.jsx'

const Filter = ({filter, setFilter}) => {
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  return (
      <div>Filter shown with: <input value = {filter} onChange = {handleFilterChange}/></div>
  )
}

const ShowContacts = ({persons, filter}) => {
  const namesToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
      <ul>
        {namesToShow.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
      </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filter={filter} setFilter={setFilter}/>
      <h2>Add a new contact</h2>
      <ContactForm newName={newName} setNewName={setNewName}
                      newNumber={newNumber} setNewNumber={setNewNumber} 
                      persons={persons} setPersons={setPersons}/>
      <h2>Numbers</h2>
      <ShowContacts persons={persons} filter={filter}/>
    </div>
    
  )
}

export default App