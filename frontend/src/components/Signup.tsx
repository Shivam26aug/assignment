import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
  role: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "", role: "USER" });
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/register", formData);
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error signing up");
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
         {/* <input
          type="role"
          name="role"
          placeholder="role"
          value={formData.role}
          onChange={handleChange}
          required
        /> */}
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}

      <p>
        Already registered? <Link to="/Login">Signin here</Link>
      </p>
    </div>
  );
};

export default Signup;
