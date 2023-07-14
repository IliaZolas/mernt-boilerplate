import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { config } from '../config/config';
import "./book-form.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Cookies from "universal-cookie";
const cookies = new Cookies();

const URL = config.url;

interface Book {
  title: string;
  description: string;
  imageUrl: string;
  publicId: string;
}

const UpdateBookForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publicId, setPublicId] = useState('');

  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const id = params.id;
    fetch(`${URL}/books/show/${id}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data: Book) => {
        setTitle(data.title);
        setDescription(data.description);
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
  
  const updateBook = async (id: string, title: string, description: string, imageUrl: string, publicId: string) => {
    const token = cookies.get("TOKEN");

    await fetch(`${URL}/book/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: title,
        description: description,
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
        setTitle('');
        setDescription('');
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
      updateBook(id, title, description, imageUrl, publicId);
      navigate(`/book/show/${id}`);
    }
  };

  return (
    <div className="form-container">
      <div className="form-image-container">
        <img src={imageUrl} alt="preview" />
      </div>
      <form method="puts" onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="labels">
          Title
          <input
            type="text"
            name="title"
            placeholder={title}
value={title}
            onChange={e => setTitle(e.target.value)} />
        </label>
        <label className="labels">
          Description
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription} />
        </label>
        <label className="labels">
          Image
          <input type="file" name="book" onChange={uploadImage}/>
        </label>
        <label className="labels hidden">
          imageUrl
          <textarea
            name="imageUrl"
            value={imageUrl}
            placeholder={imageUrl}
            onChange={e => setImageUrl(e.target.value)} />
        </label>
        <label className="labels hidden">
          publicId
          <textarea
            name="publicId"
            value={publicId}
            placeholder={publicId}
            onChange={e => setPublicId(e.target.value)} />
        </label>
        <input type="submit" value="Submit" className="primary-submit-button" />
      </form>
    </div>
  );
};

export default UpdateBookForm;
