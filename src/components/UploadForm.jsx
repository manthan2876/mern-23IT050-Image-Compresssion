import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [image, setImage] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/images', formData);
      alert('Image uploaded and compressed successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to upload');
    }
  };

  return (
    <form onSubmit={handleUpload} className="mb-6">
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="mb-2" />
      <br />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload & Compress</button>
    </form>
  );
}