import personsService from '../services/persons'

const ShowContacts = ({persons, filter, setPersons, setErrorMessage}) => {
  const deleteContact = (id) => {
    if (window.confirm('Delete this contact?:')) {
      console.log('deleting', id)
      personsService
        .remove(id)
        .then(removedContact => {
          setPersons(persons.filter(contact => contact.id !== removedContact.id))
        })
        .catch(error => {
          const person = persons.find(p => p.id === id)
          setErrorMessage(`Error deleting contact: ${error.message}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const namesToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
      <ul>
        {namesToShow.map(person => 
        <li key={person.name}>
          {person.name} {person.number} <button onClick={() => deleteContact(person.id)}>delete</button>
        </li>
      )}
      </ul>
  )
}

export default ShowContacts