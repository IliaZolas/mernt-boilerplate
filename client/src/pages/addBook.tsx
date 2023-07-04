import AddBookForm from "../components/addBookForm";

const NewBook = () => {
    return (
        <div className="">
            <div className="fade-page">
                <div className="page-title">
                    <h1>Add Book</h1>
                </div>
                <AddBookForm />
            </div>
        </div>
    );
}

export default NewBook;