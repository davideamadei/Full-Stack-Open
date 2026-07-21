import { useAnecdoteActions } from "../store"

const Filter = () => {
    const {updateFilter} = useAnecdoteActions()
    const handleChange = (event) => {
        // the value of the input field is in event.target.value
        event.preventDefault()
        updateFilter(event.target.value)
    }
    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
        Filter <input onChange={handleChange} />
        </div>
    )
}

export default Filter