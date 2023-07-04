import BookCard from '../components/bookCard';
import './books.css'


const Books = () => {
    return (
        <div className="ramen-list-body fade-page">
            <div className="">
                <div className="page-title">
                    <h1>All Books</h1>
                </div>
                <BookCard />
            </div>
        </div>
    );
}

export default Books;