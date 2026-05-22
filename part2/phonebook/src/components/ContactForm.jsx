const ContactForm = ({newName, setNewName, newNumber, setNewNumber, persons, setPersons}) => {
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
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    }
    else{
      alert(`${newName} is already added to phonebook`)
    }
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