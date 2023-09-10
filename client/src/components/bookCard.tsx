import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { config } from '../config/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'

const URL = config.url;

const BookCard = () => {
  const [books, setBooks] = useState<any[]>([]);
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      fetch(`${URL}/books`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((err) => {
        console.log(err.message);
      })
    };
    fetchBooks();
  }, []);

  const deleteBook = async (id: string, public_id: string, user_id: string, user: string) => {
    const theLoggedInUser = sessionStorage.getItem('id');
    console.log("logged in user id", theLoggedInUser)
    console.log("user:", user)

    if (user !== theLoggedInUser) {
      console.log("you cannot delete another person's book");
    }

    await fetch(`${URL}/book/delete/${id}/${public_id}/user/${user_id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
        console.log("Book deleted");
      } else {
        console.log("Book not deleted");
      }
    });
  };

  const viewBook = (id: string) => {
    console.log("this is id", id);
    navigate(`/book/show/${id}`);
  };

  const updateBook = (id: string) => {
    navigate(`/book/update/${id}`);
  };

  return (
    <div className="">
      <div className="card-area">
        {books.map((book) => {
          return (
            <div key={book._id} id={book._id} className="book-card">
              <div className="card-image-container">
                <img src={book.imageUrl} alt="" style={{ width: 400 }} />
              </div>
              <div className="card-text-area">
                <h4>{book.title}</h4>
                <p dangerouslySetInnerHTML={{ __html: book.description }}></p>
                {user ? (
                  <div className="card-button-area">
                    <div className="show-button button" onClick={() => viewBook(book._id)}>
                      <FontAwesomeIcon icon={faEye} className="eye" />
                    </div>
                    <div className="update-button button" onClick={() => updateBook(book._id)}>
                      <FontAwesomeIcon icon={faPenToSquare} className="update" />
                    </div>
                    <div className="delete-button button" onClick={() => deleteBook(book._id, book.public_id, sessionStorage.getItem('id')!, book.user)} id={book.id}>
                      <FontAwesomeIcon icon={faTrash} className="delete" />
                    </div>
                  </div>
                ) : (
                  <div className="card-button-area">
                    <div className="show-button button" onClick={() => viewBook(book._id)}>
                      <FontAwesomeIcon icon={faEye} className="eye" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookCard;
