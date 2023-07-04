import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import './book-card.css'
import Cookies from "universal-cookie";
import { config } from '../config/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'

const cookies = new Cookies();

const URL = config.url;
console.log("prod or dev?", URL)

const BookCard = () => {
    const [books, setBook] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const token = cookies.get("TOKEN");

    
    useEffect(() => {
        fetch(`${URL}/books`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setBook(data);
            })
            .catch((err) => {
                console.log(err.message);
            });  
        }, []);

    const deleteBook = async (id, public_id, user_id, user) => {
        console.log("delete:",id)
        console.log("delete:",public_id)
        console.log("user who created book",user)
        const theLoggedInUser = localStorage.getItem('id')
        console.log("logged in user who is trying to delete book",theLoggedInUser)

        if (user !== theLoggedInUser){
            console.log("you cannot delete another persons book")
        }

        await fetch(`${URL}/book/delete/${id}/${public_id}/user/${user_id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `${token}` 
        },
        }).then((response) => {            
            if (response.status === 200) {
                setBook((prevBooks) => prevBooks.filter((book) => book._id !== id));
                console.log("Book deleted");
                } else {
                    console.log("Book not deleted");
                }
            });
        };

    const viewBook = async (id) => {
        console.log("this is id", id);
        navigate(`/book/show/${id}`);
    };

    const updateBook = (id) => {
        navigate(`/book/update/${id}`);
    };

    return (
        <div className="">
            <div className="card-area">
                {books.map((book) => {
                return (
                    <div id={book._id} className="book-card" >
                        <div class="card-image-container">
                            <img src={book.imageUrl} alt="" style={{width: 400}} />
                        </div>
                        <div className="card-text-area">
                            <h4>{book.title}</h4>
                            <p dangerouslySetInnerHTML={{ __html: book.description}}></p>
                        {user ? (
                            <div className="card-button-area">
                                <div className="show-button button" onClick={() => viewBook(book._id)} >
                                    <FontAwesomeIcon icon={faEye} className="eye"/>
                                </div>
                                <div className="update-button button" onClick={() => updateBook(book._id)} >
                                    <FontAwesomeIcon icon={faPenToSquare} className="update"/>
                                </div>
                                <div className="delete-button button" onClick={() => deleteBook(book._id, book.public_id, localStorage.getItem('id'), book.user)} id={book.id}>
                                    <FontAwesomeIcon icon={faTrash} className="delete"/>
                                </div>
                            </div>
                                ) : (
                                    <div className="card-button-area">
                                        <div className="show-button button" onClick={() => viewBook(book._id)} >
                                        <FontAwesomeIcon icon={faEye} className="eye"/>
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