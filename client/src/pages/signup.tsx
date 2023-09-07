import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { config } from '../config/config';

const URL = config.url;

interface User {
    name: string;
    surname: string;
    email: string;
    password: string;
    imageUrl: string;
    publicId: string;
    }

const AddUser: React.FC = () => {
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

    const uploadImage = async (files: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = files.target.files?.[0];

        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("upload_preset", `${cloudinaryPreset}`);
        
            try {
            const response = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });
        
            if (response.ok) {
                const data = await response.json();
                setImageUrl(data.secure_url);
                setPublicId(data.public_id);
            } else {
                console.log("Image upload failed");
            }
            } catch (error) {
            console.error("Error uploading image:", error);
            }
        }
        };
    
    const AddUser = async ( user: User) => {
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
        setName('');
        setSurname('');
        setEmail('');
        setPassword('');
        })
        .catch((err) => {
        console.log(err.message , ":error message");
    });
    navigate('/login');
};

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: User = {
        name,
        surname,
        email,
        password,
        imageUrl,
        publicId,
    }
    AddUser(user);
};

    return (
    <div className="form-container">
        <div className="form-user-image-container">
            <img src={imageUrl} alt="preview" className="img-preview"/>
        </div>
        <form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
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
