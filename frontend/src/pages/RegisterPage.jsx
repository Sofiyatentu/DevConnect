import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, register } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await register({ name, email, password });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <h2>SignUp Page</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          value={name}
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default RegisterPage;
