import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Client() {
    const token = localStorage.getItem('token');
    const [film, setFilm] = useState([]);
   
    const getWeekDates = () => {

        let now = new Date();
        let dayOfWeek = now.getDay();
        let numDay = now.getDate();

        let start = new Date(now);
        start.setDate(numDay - dayOfWeek);
        start.setHours(0, 0, 0, 0);


        let end = new Date(now);
        end.setDate(numDay + (7 - dayOfWeek));
        end.setHours(0, 0, 0, 0);

        return [start, end];
    }

    const formattaData = (data) => {
        const date = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(data).toLocaleDateString(undefined, date);
    }

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
            const [startW, endW] = getWeekDates();
            const list = await data.filter((item) => { return new Date(item.start) >= startW && new Date(item.start) <= endW })
            setFilm(list.sort((a, b) => new Date(a.start) - new Date(b.start)))
        } else {
            console.error("Failed to get film");
            return null;
        }
    }

    const removeTicket = async (id) => {
        const response = await fetch(`http://localhost:8000/createPlanning/removeTicket/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "ticket": 1, "id": id })
        });
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




    const isBefore = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(date) > today;
    }
    useEffect(() => {
        getFilm()
    }, []);
    return (

        <div className="w-screen h-screen flex flex-col">
            <div class="isolate bg-white px-6 py-12 lg:px-8">
                <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Programmazione settimana corrente</h2>
                </div>
            </div>
            <ToastContainer />
            <div class="bg-white">
                <div class="mx-auto max-w-2xl px-4 py-16 lg:max-w-7xl lg:px-8">
                    <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">{film?.map((item, index) => {
                        return (
                            <div class="group relative" key={index}>
                                <div class="mt-4 flex justify-between">
                                    <div>
                                        <h3 class="text-sm text-gray-700">
                                            Programmato per il:
                                        </h3>
                                    </div>
                                    <p class="text-sm font-medium text-gray-900"> {formattaData(item.start)}</p>
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
                                {isBefore(item.start) ?
                                    <>
                                        <p class="text-sm font-medium text-gray-900">Disponibili: {item.ticket}</p>
                                        <button onClick={() => removeTicket(item.id)} class="block w-full mt-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Acquista ticket</button>

                                    </>
                                    :
                                    <p class="text-sm font-medium text-gray-900">Film terminato</p>}

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
