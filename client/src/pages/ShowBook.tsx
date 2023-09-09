import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { config } from '../config/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleLeft, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

interface Book {
_id: string;
imageUrl: string;
title: string;
description: string;
public_id: string;
}

const URL = config.url;

const ShowBook: React.FC = () => {
const [book, setBook] = useState<Book | null>(null);
const { user } = useContext(UserContext);
const navigate = useNavigate();
const params = useParams();

useEffect(() => {
    const id = params.id as string;

    fetch(`${URL}/books/show/${id}`, {
        method: "GET",
        credentials: "include",
    })
        .then((response) => response.json())
        .then((data: Book) => {
        setBook(data);
        })
        .catch((err) => {
        console.log(err.message);
        });
    }, [params.id, book]);

    const deleteBook = async (id: string, public_id: string, user_id: string) => {
    console.log("delete:", id);
    console.log("delete:", public_id);

    fetch(`${URL}/book/delete/${id}/${public_id}/user/${user_id}`, {
        method: "DELETE",
        credentials: "include"
    })
        .then((response) => {
        if (response.status === 200) {
            setBook(null);
            console.log("Book deleted");
        } else {
            return;
        }
        });
    navigate('/books');
    };

    const allBooks = () => {
    navigate('/books');
    }

    const updateBook = (id: string) => {
    navigate(`/book/update/${id}`);
    };

    return (
    <div className="show-book-container fade-page">
        <div className="show-book">
        <div className="flex space-around" >
            <div className="show-page-img-ing">
            <div className="show-image-container">
                <img src={book?.imageUrl} style={{ width: 400 }} alt="" />
            </div>
            </div>
            <div className="show-page-description">
            <h1>{book?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: book?.description || '' }} />
            {user ? (
                <div className="card-button-area-show flex">
                <div className="show-button button" onClick={() => allBooks()} ><FontAwesomeIcon icon={faCircleLeft} className="back" /> Back to list</div>
                <div className="update-button button" onClick={() => updateBook(book?._id || '')} ><FontAwesomeIcon icon={faPenToSquare} className="update" /> Update</div>
                <div className="delete-button button" onClick={() => deleteBook(book?._id || '', book?.public_id || '',  sessionStorage.getItem('id')!)} id={book?._id || ''} ><FontAwesomeIcon icon={faTrash} className="delete" /> Delete</div>
                </div>
            ) : (
                <div className="card-button-area-show">
                <div className="show-button button" onClick={() => allBooks()} ><FontAwesomeIcon icon={faCircleLeft} className="book-bowl" /> Back to list</div>
                </div>
            )}
            </div>
        </div>
        </div>
    </div>
    );
}

export default ShowBook;
