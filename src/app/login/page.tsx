import { useState } from "react";

interface SignInResponse {
  error?: string;
  user?: {
    type: string;
  };
}
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    }) as SignInResponse | undefined;

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      // Redirect based on user type
      if (res?.user?.type === "brand") {
        router.push("/brand-dashboard"); // Change route as needed
      } else if (res?.user?.type === "influencer") {
        router.push("/influencer-dashboard"); // Change route as needed
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;