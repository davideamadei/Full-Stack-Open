import { useEffect, useState } from 'react'
import axios from 'axios'
import ContactForm from './components/ContactForm.jsx'
import personsService from './services/persons.js'
import ShowContacts from './components/ShowContacts.jsx'
import Notification from './components/Notification.jsx'

const Filter = ({filter, setFilter}) => {
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  return (
      <div>Filter shown with: <input value = {filter} onChange = {handleFilterChange}/></div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      }) 
  }, [])

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filter={filter} setFilter={setFilter}/>
      <h2>Add a new contact</h2>
      <Notification message={successMessage} isError={false}/>
      <Notification message={errorMessage} isError={true}/>
      <ContactForm newName={newName} setNewName={setNewName}
                      newNumber={newNumber} setNewNumber={setNewNumber} 
                      persons={persons} setPersons={setPersons}
                      setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}
                      />
      <h2>Numbers</h2>
      <ShowContacts persons={persons} filter={filter} setPersons={setPersons} setErrorMessage={setErrorMessage}/>
    </div>
    
  )
}

export default App