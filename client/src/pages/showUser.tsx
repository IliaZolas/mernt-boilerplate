import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { config } from '../config/config';
import "./show-user.css"

const URL = config.url;

const ShowUser = () => {
    const [user, setUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const id = localStorage.getItem('id');

        fetch(`${URL}/user/show/${id}`, {
            method: 'GET',
            })
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
        },
        []);
        
        const deleteUser = async (id, public_id) => {
            console.log("delete:",id)
            console.log("delete:",public_id)

            fetch(`${URL}/user/delete/${id}/${public_id}`, {
            method: 'DELETE',
            }).then((response) => {            
                if (response.status === 200) {
                    setUser();
                    console.log("User deleted");
                    } else {
                        return;
                    }
                });
                navigate('/home');
            };

        const updateUser = (id) => {
                navigate(`/user/update/${id}`);
            };

    return (
        <div className="show-user-container">
            <div className="">
                    <div className="" >
                        <div className="show-user-image-container">  
                            <img src={user.imageUrl} style={{width: 400}} alt="" className="show-user-image"/>
                        </div>
                        <h1>{user.name} {user.surname}</h1>
                        <p>{user.email}</p>
                        <div className="user-button-area">
                            <div className="update-button button" onClick={() => updateUser(user._id)} >Update</div>
                            <div className="delete-button button" onClick={() => deleteUser(user._id, user.public_id)} id={user.id}>Delete</div>
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default ShowUser;