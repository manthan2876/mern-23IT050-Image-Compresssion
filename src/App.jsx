import React from 'react';
import UploadForm from './components/UploadForm';
import ImageList from './components/ImageList';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🖼️ Image Compression & Analytics</h1>
      <UploadForm />
      <AnalyticsDashboard />
      <ImageList />
    </div>
  );
}