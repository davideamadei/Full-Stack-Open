import personsService from '../services/persons'

const ShowContacts = ({persons, filter, setPersons}) => {
  const deleteContact = (id) => {
    if (window.confirm('Delete this contact?:')) {
      console.log('deleting', id)
      personsService
        .remove(id)
        .then(removedContact => {
          setPersons(persons.filter(contact => contact.id !== removedContact.id))
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