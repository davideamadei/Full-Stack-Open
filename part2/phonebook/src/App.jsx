import { useEffect, useState } from 'react'
import axios from 'axios'
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
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promis fulfilled')
        setPersons(response.data)
      }) 
  }, [])

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