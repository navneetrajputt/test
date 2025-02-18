"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const InfluencerSignup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    category: "",
    socialLinks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/influencer-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error);
    } else {
      router.push("/influencer-dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Influencer Signup</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="input" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="input" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="input" />
          <input type="text" name="category" placeholder="Category (e.g., Tech, Fashion)" onChange={handleChange} required className="input" />
          <input type="text" name="socialLinks" placeholder="Social Media Links" onChange={handleChange} className="input" />
          <button type="submit" disabled={loading} className="btn">
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InfluencerSignup;
