import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import {Image} from 'cloudinary-react';
import { config } from '../config/config';
import "./book-form.css";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const URL = config.url;

const UpdateUserForm = () => {
    const [name, setName ] = useState('');
    const [surname, setSurname ] = useState('');
    const [ email, setEmail ] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [publicId, setPublicId] = useState('');
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const id = params.id;
        fetch(`${URL}/user/show/${id}`, {
            method: 'GET',
            }).then((response) => response.json())
            .then((data) => {
                setName(data.name);
                setSurname(data.surname);
                setEmail(data.email);
                setImageUrl(data.imageUrl);
                setPublicId(data.public_id);
            })
            .catch((err) => {
                console.log(err.message);
            });
        },
        []);

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

    const updateUser = async (id, name, surname, email, imageUrl, publicId) => {
        const token = cookies.get("TOKEN");

        await fetch(`${URL}/user/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: name,
                surname: surname,
                email: email,
                imageUrl: imageUrl,
                publicId: publicId
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `${token}`,
            },
            })
            .then((response) => { 
                response.json();
            })
            .then(() => {
            setName();
            setSurname();
            setEmail();
            setImageUrl();
            setPublicId();
            })
            .catch((err) => {
            console.log(err.message , ":error message");
        });
    }

    const handleSubmit = () => {
        const id = params.id
        updateUser(id, name, surname, email, imageUrl, publicId );
        navigate(`/user/show/${id}`);
        
    };
    

    return (
        <div>
        <div className="form-user-image-container">
            <Image className="new-user-image" cloudName={cloudinaryUsername} publicId={imageUrl} />
        </div>
        <form method="puts" onSubmit={handleSubmit} enctype="multipart/form-data">
            <label className="labels">
                Name
                <input 
                    type="text" 
                    name="name" 
                    placeholder="name"
                    value={name}
                    onChange={e => setName(e.target.value)} />
            </label>
            <label className="labels">
                Surname
                <input 
                    type="text" 
                    name="surname" 
                    placeholder="surname"
                    value={surname}
                    onChange={e => setSurname(e.target.value)} />
            </label>
            <label className="labels">
                Email
                <input
                    type="text" 
                    name="email" 
                    placeholder="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
            </label>
            {/* <label className="labels">
                Password
                <input 
                    type="text" 
                    name="password" 
                    placeholder="password"
                    onChange={e => setPassword(e.target.value)} />
            </label> */}
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

export default UpdateUserForm;
