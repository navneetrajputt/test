"use client"
import { useState } from "react";

export default function Profile() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("fileName", image.name);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    console.log("Uploaded Image URL:", data.url);
  };

  return (
    <div>
      <h1>Update Profile Picture</h1>
      <input type="file" onChange={handleImageChange} />
      {preview && <img src={preview} alt="Preview" />}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
