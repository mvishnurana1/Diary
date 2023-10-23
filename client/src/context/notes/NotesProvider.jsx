function NotesProvider({children}) {
    const [contentInTextBox, setContentInTextBox] = useState('');

    return (
        <NotesContext.Provider value={{
            notes: {
                ...rest,
                addNote: (...params) => this.addNote(...params),
                fetch: () => this.fetchNotes(),
                updateNote: (...params) => this.updateNote(...params),
                searchNotes: (...params) => this.searchForNotes(...params),
            }}}>
            {children}
        </NotesContext.Provider>
    )
}

export { NotesContext, NotesProvider };
