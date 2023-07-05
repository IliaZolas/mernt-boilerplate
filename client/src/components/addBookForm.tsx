import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { AdvancedImage } from '@cloudinary/react';
import { config } from '../config/config';
import "./book-form.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CloudinaryImage } from "@cloudinary/url-gen/assets/CloudinaryImage";

interface Book {
  title: string;
  description: string;
  imageUrl: string;
  publicId: string;
  user: string;
}

const URL = config.url;

const AddBook: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publicId, setPublicId] = useState('');
  const navigate = useNavigate();

  const cloudinaryUsername = process.env.REACT_APP_CLOUDINARY_USERNAME;
  const cloudinaryPreset = process.env.REACT_APP_CLOUDINARY_PRESET;
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryUsername}/image/upload`;

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

  const cldImg = new CloudinaryImage(imageUrl, { cloudName: cloudinaryUsername });

  const addBook = async (book: Book) => {
    const userId = localStorage.getItem('id');
    console.log(userId, ": this is the logged in user id");

    await fetch(`${URL}/book/add`, {
      method: 'POST',
      body: JSON.stringify(book),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
    });

    setTitle('');
    setDescription('');
    navigate('/books');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const book: Book = {
      title,
      description,
      imageUrl,
      publicId,
      user: localStorage.getItem('id') || ''
    };
    addBook(book);
  };

  return (
    <div className="form-container">
      <div className="form-image-container">
        <AdvancedImage 
            className="new-book-image"
            cloudName={cloudinaryUsername} 
            publicId={imageUrl}
            cldImg={cldImg}
        />
      </div>
      <form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="labels">
          Title
          <input 
            type="text" 
            name="title" 
            placeholder="Type here..."
            value={title}
            onChange={e => setTitle(e.target.value)} />
        </label>    
        <label className="labels">
          Description
          <ReactQuill
            theme="snow"
            placeholder="Type here..."
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
            form="textarea" 
            name="imageUrl" 
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)} />
        </label>
        <label className="labels hidden">
          publicId
          <textarea 
            form="textarea" 
            name="publicId" 
            value={publicId}
            onChange={e => setPublicId(e.target.value)} />
        </label>
        <input type="submit" value="Submit" className="primary-submit-button" />
      </form>
    </div>
  );
};

export default AddBook;
