import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { config } from '../config/config';
import "./book-form.css";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const URL = config.url;

interface User {
  name: string;
  surname: string;
  email: string;
  imageUrl: string;
  publicId: string;
}

const UpdateUserForm: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publicId, setPublicId] = useState('');
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const id = params.id;
    fetch(`${URL}/user/show/${id}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data: User) => {
        setName(data.name);
        setSurname(data.surname);
        setEmail(data.email);
        setImageUrl(data.imageUrl);
        setPublicId(data.publicId);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [params.id]);

  const cloudinaryUsername = process.env.REACT_APP_CLOUDINARY_USERNAME;

  const cloudinaryPreset = process.env.REACT_APP_CLOUDINARY_PRESET;

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryUsername}/image/upload`;

  const uploadImage = async (files: React.ChangeEvent<HTMLInputElement>) => {
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

  const updateUser = async (id: string, name: string, surname: string, email: string, imageUrl: string, publicId: string) => {
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
        setName('');
        setSurname('');
        setEmail('');
        setImageUrl('');
        setPublicId('');
      })
      .catch((err) => {
        console.log(err.message , ":error message");
      });
  }

  const handleSubmit = () => {
    const id = params.id;
    if (id) {
    updateUser(id, name, surname, email, imageUrl, publicId);
    navigate(`/user/show/${id}`);
    }
  };

  return (
    <div>
      <div className="form-user-image-container">
        <img src={imageUrl} alt="preview" />
      </div>
      <form method="puts" onSubmit={handleSubmit} encType="multipart/form-data">
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
  );
};

export default UpdateUserForm;
