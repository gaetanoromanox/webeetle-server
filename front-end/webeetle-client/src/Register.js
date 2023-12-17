import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const [mailAdmin, setMailAdmin] = useState()
    const [passAdmin, setPassAdmin] = useState()

    const [mailUser, setMailUser] = useState()
    const [passUser, setPassUser] = useState()



    const navigation = useNavigate()
    const regAdmin = async () => {
        const response = await fetch("http://localhost:8000/session/register-admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                "firstName": 'admin', "lastName": 'admin', "mail": mailAdmin, "password": passAdmin, "level": 0
            })
        });
        if (response.ok) {
            toast("Admin registrato con successo")
        } else {
            toast.error('Registrazione fallita', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            console.error("HTTP error", response.status);
        }
    }


    const regUser = async () => {
        const response = await fetch("http://localhost:8000/session/register-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": 'user', "surname": 'user', "mail": mailUser, "password": passUser
            })
        });
        if (response.ok) {
            toast("User registrato con successo")
        } else {
            toast.error('Registrazione fallita', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            console.error("HTTP error", response.status);
        }
    }
    return (
        <div className="w-screen h-screen flex flex-col lg:flex-row">
         <ToastContainer />
            <div className="flex flex-1 items-center justify-center bg-[#17082A]">
                <div className="px-8 pt-6 pb-8 mb-4">
                    <p className="block text-white text-sm font-bold mb-2">Registrazione utente</p>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2">
                            Username
                        </label>
                        <input onChange={e => setMailUser(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2">
                            Password
                        </label>
                        <input onChange={e => setPassUser(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={() => regUser()} className="bg-[#6644B875] hover:bg-[#6644B8] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Registra
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center bg-[#17082A]">
                <div className="px-8 pt-6 pb-8 mb-4">
                    <p className="block text-white text-sm font-bold mb-2">Registrazione admin</p>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2">
                            Username
                        </label>
                        <input onChange={e => setMailAdmin(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2">
                            Password
                        </label>
                        <input onChange={e => setPassAdmin(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={() => regAdmin()} className="bg-[#6644B875] hover:bg-[#6644B8] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Registra
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Register;
