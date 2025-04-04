import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ImageList() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/images')
      .then(res => setImages(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">📂 Compressed Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img) => (
          <div key={img._id} className="border p-4 rounded shadow">
            <p><strong>{img.originalName}</strong></p>
            <p>Original Size: {(img.originalSize / 1024).toFixed(2)} KB</p>
            <p>Compressed Size: {(img.compressedSize / 1024).toFixed(2)} KB</p>
            <p>Saved: {img.compressionRatio.toFixed(2)}%</p>
            <a
              href={`http://localhost:5000/api/images/${img._id}/download`}
              className="text-blue-600 underline mt-2 inline-block"
              download
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
