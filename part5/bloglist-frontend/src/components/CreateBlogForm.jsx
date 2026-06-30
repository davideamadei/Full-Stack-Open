const CreateBlogForm = ({handleNewBlog, title, setTitle, author, setAuthor, url, setUrl}) => {
    return (
    <div>
        <h2>Create new blog</h2>
        <form onSubmit={handleNewBlog}>
            <div>
                <label>
                Title
                <input
                    type="text"
                    value={title}
                    onChange={({target}) => setTitle(target.value)}
                />
                </label>
            </div>
            <div>
                <label>
                Author
                <input
                    type="text"
                    value={author}
                    onChange={({target}) => setAuthor(target.value)}
                />
                </label>
            </div>
            <div>
                <label>
                URL
                <input
                    type="text"
                    value={url}
                    onChange={({target}) => setUrl(target.value)}
                />
                </label>
            </div>
        <button type='submit'>Create</button>
        </form>
    </div>
    )
}

export default CreateBlogForm