import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {Image} from 'cloudinary-react';
import { config } from '../config/config';
import "../components/book-form.css"
import "./signup.css"

const URL = config.url;

const AddUser = () => {
    const [name, setName ] = useState('');
    const [surname, setSurname ] = useState('');
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [publicId, setPublicId] = useState('');
    const navigate = useNavigate();

    const cloudinaryUsername = process.env.REACT_APP_CLOUDINARY_USERNAME

    const cloudinaryPreset = process.env.REACT_APP_CLOUDINARY_PRESET

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryUsername}/image/upload`

    const uploadImage = async (files) => {

        const formData = new FormData()
        formData.append("file", files.target.files[0])
        formData.append("upload_preset", `${cloudinaryPreset}`)

        await fetch(uploadUrl, {
            method: 'POST',
            body: formData
            })
            .then(async (response) => {
            const data = await response.json();
            setImageUrl(data.secure_url)
            setPublicId(data.public_id)
            })            
        };

    const AddUser = async ( name, surname, email, password, imageUrl, publicId) => {
        await fetch(`${URL}/signup`, {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            surname: surname,
            email: email,
            password: password,
            imageUrl: imageUrl,
            publicId: publicId
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        })
        .then((response) => { 
            console.log(response.json());
        })
        .then(() => {
        setName();
        setSurname();
        setEmail();
        setPassword();
        })
        .catch((err) => {
        console.log(err.message , ":error message");
    });
    navigate('/books');
};

const handleSubmit = (e) => {
    e.preventDefault();
    AddUser(name, surname, email, password, imageUrl, publicId);
};

    return (
    <div className="form-container">
        <div className="form-user-image-container">
            <Image className="new-user-image" cloudName={cloudinaryUsername} publicId={imageUrl} />
        </div>
        <form method="post" onSubmit={handleSubmit} enctype="multipart/form-data">
            <label className="labels">
                Name
                <input 
                    type="text" 
                    name="name" 
                    placeholder="name"
                    onChange={e => setName(e.target.value)} />
            </label>
            <label className="labels">
                Surname
                <input 
                    type="text" 
                    name="surname" 
                    placeholder="surname"
                    onChange={e => setSurname(e.target.value)} />
            </label>
            <label className="labels">
                Email
                <input
                    type="text" 
                    name="email" 
                    placeholder="email"
                    onChange={e => setEmail(e.target.value)} />
            </label>
            <label className="labels">
                Password
                <input 
                    type="text" 
                    name="password" 
                    placeholder="password"
                    onChange={e => setPassword(e.target.value)} />
            </label>
            <label className="labels">
                Image
                <input type="file" name="book" onChange={uploadImage}/>
            </label>
            <label className="labels hidden">
                imageUrl
                <input
                    type="text" 
                    name="imageUrl" 
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)} />
            </label>
            <label className="labels hidden">
                publicId
                <input
                    type="text" 
                    name="publicId" 
                    value={publicId}
                    onChange={e => setPublicId(e.target.value)} />
            </label>
            <input type="submit" value="Submit" className="primary-submit-button" />
        </form>
    </div>
    )
};

export default AddUser;
