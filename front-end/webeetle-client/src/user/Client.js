import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Client() {
    const token = localStorage.getItem('token');
    const [film, setFilm] = useState([]);

    const getFilm = async () => {
        const response = await fetch("http://localhost:8000/createPlanning/getFilm", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            setFilm(data)
        } else {
            console.error("Failed to get film");
            return null;
        }
    }

    const formattaData = (data) => {
        const date = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(data).toLocaleDateString(undefined, date);
    }

    const removeTicket = async (id) => {
        const response = await fetch(`http://localhost:8000/createPlanning/removeTicket/${id}`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "ticket": 1, "id": id, "income": 30 })
        });

        console.log(response)
        if (response.ok === true) {
            toast("Biglietto acquistato con successo")
        } else {
            toast.error('Biglietto non acquistato', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        }
    }



    useEffect(() => {
        getFilm()
    }, []);

    return (
        
        <div className="w-screen h-screen flex flex-col">
            <div class="isolate bg-white px-6 py-12 lg:px-8">
                <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Programmazione</h2>
                </div>
            </div>
            <ToastContainer />
            <div class="bg-white">
                <div class="mx-auto max-w-2xl px-4 py-16 lg:max-w-7xl lg:px-8">
                    <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">{film.map((item, index) => {
                        return (
                            <div class="group relative" key={index}>
                                <div class="mt-4 flex justify-between">
                                    <div>
                                        <h3 class="text-sm text-gray-700">
                                            Programmato per il:
                                        </h3>
                                    </div>
                                    <p class="text-sm font-medium text-gray-900">  {formattaData(item.start)}</p>
                                </div>
                                <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md mt-4 bg-gray-200 lg:aspect-none lg:h-80">
                                    <img src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg" alt="Front of men&#039;s Basic Tee in black." class="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                                </div>
                                <div class="mt-4 flex justify-between">
                                    <div>
                                        <h3 class="text-sm text-gray-700">
                                            {item.title}
                                        </h3>
                                        <p class="mt-1 text-sm text-gray-500">{item.description}</p>
                                    </div>

                                    <p class="text-sm font-medium text-gray-900">€{item.price}</p>

                                </div>
                                <button onClick={() => removeTicket(item.id)} class="block w-full mt-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Acquista ticket</button>

                            </div>
                        )
                    })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Client;
