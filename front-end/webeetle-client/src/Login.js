import arr from "../src/ass/img-login.png";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigate()
    const login = async () => { 
        const response = await fetch("http://localhost:8000/session/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "mail": username, "password": password })
        });
        if (!response.ok) {
            console.error("HTTP error", response.status);
        } else {
            const data = await response.json();
            localStorage.setItem('token', data.token)
            if (data?.level == 0) { navigation("/admin")}

        }
    }
    return (
        <div className="w-screen h-screen flex flex-col lg:flex-row">

            <div className="flex flex-1 items-center justify-center bg-[#17082A]">
                <div className="px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2">
                            Username
                        </label>
                        <input onChange={e => setUsername(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2">
                            Password
                        </label>
                        <input onChange={e => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={() => login()} className="bg-[#6644B875] hover:bg-[#6644B8] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-1 items-center justify-center bg-[#17082A] bg-img overflow-hidden relative">
                <h1 className="text-2xl absolute top-1/3 text-white font-semibold">All-in-one cinema management system</h1>
                <img src={arr} className="absolute top-1/2" />

            </div>

        </div>
    );
}

export default Login;
