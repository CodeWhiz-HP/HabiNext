import { useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col items-center w-[272px]  bg-white rounded">
      <h2 className="text-2xl mb-4 w-fit px-2 py-1 text-gray-200 rounded text-center bg-indigo-500">Login</h2>
      <form onSubmit={handleLogin} className=" gap-4 w-full flex flex-col items-center">
        <input type="email" className="input w-[95%] input-bordered bg-gray-100 focus:bg-gray-200 px-2 py-1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input w-[95%] input-bordered bg-gray-100 focus:bg-gray-200 px-2 py-1" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary w-fit px-1.5 py-0.5 bg-indigo-500 text-gray-200 hover:bg-indigo-600 focus:bg-indigo-600 mb-3 " type="submit">Log In</button>
      </form>
      <p className="text-sm text-indigo-500 focus:text-indigo-600 hover:text-indigo-600 hover:cursor-pointer" onClick={() => navigate('/signup')}>New User ? Sign Up</p>
    </div>
  );
}