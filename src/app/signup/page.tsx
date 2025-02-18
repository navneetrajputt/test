"use client"
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function Signup() {
  const { data: session } = useSession();
  const [role, setRole] = useState("influencer");

  if (!session) return <button onClick={() => signIn("google")}>Sign in with Google</button>;

  const handleSignup = async () => {
    await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ name: session.user?.name, email: session.user?.email, role }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="influencer">Influencer</option>
        <option value="brand">Brand</option>
      </select>
      <button onClick={handleSignup}>Complete Signup</button>
    </div>
  );
}
