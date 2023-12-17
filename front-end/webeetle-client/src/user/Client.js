import { useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../component/Card';


function Client() {
    const token = localStorage.getItem('token');
    const [film, setFilm] = useState([]);
    const [titleSort, setTitleSort] = useState(true);
    const filmSort = useMemo(() => {
        if (titleSort === true) {
            return film.sort((a, b) => a.title.localeCompare(b.title))
        } else {
            return film.sort((a, b) => new Date(a.start) - new Date(b.start))
        }
    }, [titleSort, film])
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
            setFilm(list)
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
            getFilm()
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


    useEffect(() => {
        getFilm()
    }, []);


    return (

        <div className="w-screen h-screen flex flex-col">
            <div className="isolate bg-white px-6 py-6 pt-12 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Programmazione settimana corrente</h2>
                </div>
                <div className="mx-auto max-w-2xl text-center mt-4">
                    <p className="text-xl font-bold tracking-tight text-gray-900 m-2">Ordina per:</p>

                    <button onClick={() => setTitleSort(true)} className={`${titleSort === true ? "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" : "inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"} `}>
                        Nome
                    </button>

                    <button onClick={() => setTitleSort(false)} className={`ml-3 ${titleSort === false ? "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" : "inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"} `}>
                        Data
                    </button>

                </div>
            </div>
            <ToastContainer />
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8 mb-8">
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">{filmSort?.map((item, index) => {
                        return (

                            <Card index={index} item={item} income={false} action={() => removeTicket(item.id)}/>
                        )
                    })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Client;
