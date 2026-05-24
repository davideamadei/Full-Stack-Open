import personsService from '../services/persons'

const ContactForm = ({newName, setNewName, newNumber, setNewNumber, persons, setPersons, setSuccessMessage, setErrorMessage}) => {
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    
    if (!persons.some(person => person.name===newName)){
      const nameObject = {
        name: newName,
        number: newNumber
      }

      personsService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setSuccessMessage(`Added ${returnedPerson.name}`)
          setNewName('')
          setNewNumber('')
        }
      )
    }
    else if (window.confirm(`${newName} is already added to phonebook, replace the old number?`)){
      const person = persons.find(p => p.name === newName)
      const changedPerson = {...person, number: newNumber}
      personsService
        .update(person.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          setSuccessMessage(`Updated ${returnedPerson.name}'s number`)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setErrorMessage(`Information of ${person.name} has already been removed from the server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
          setPersons(persons.filter(contact => contact.id !== person.id))
        })
    }
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }
  

  return (
    <form onSubmit = {addName}>
      <div>
        name: <input value = {newName} onChange = {handleNameChange}/>
      </div>
      <div>
        number: <input value = {newNumber} onChange = {handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default ContactForm