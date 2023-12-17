import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import Card from '../component/Card';



function Dashboard() {
    const token = localStorage.getItem('token');
    const [start, setStart] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [ticket, setTicket] = useState("");
    const [film, setFilm] = useState([]);
    const [filteredFilm, setFilteredFilm] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const createPlanFilm = async (data) => {

        const response = await fetch("http://localhost:8000/createPlanning/createPlanFilm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            toast("Film creato con successo")
            getFilm()
        } else {
            toast.error('Creazione film non avvenuta', {
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
            setFilm(data.sort((a, b) => new Date(a.start) - new Date(b.start)))
            setFilteredFilm(data.filter((item) => { return new Date(item.start) >= startW && new Date(item.start) <= endW }))
        } else {
            toast.error('Failed to get film', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            console.error("Failed to get film");
            return null;
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

    const formattaData = (data) => {
        const date = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(data).toLocaleDateString(undefined, date);
    }

    useEffect(() => {
        getFilm()
    }, []);

    const weekIncome = filteredFilm.map((item, index) => { return item.income }).reduce((a, b) => a + b, 0)


    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Aggiungi film alla programmazione</h2>
                </div>
                <ToastContainer />
                <form onSubmit={handleSubmit((data) => createPlanFilm(data))} className="mx-auto mt-8 max-w-xl">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold leading-6 text-gray-900">Titolo</label>
                            <div className="mt-2.5">
                                <input type='text' placeholder="Titolo" {...register('title', { required: true })} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.title && <p>Inserisci un titolo per il film.</p>}
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold leading-6 text-gray-900">Data</label>
                            <div className="mt-2.5">
                                <input type="datetime-local" placeholder="Data" {...register('start', { required: true })} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.start && <p>Inserisci un inizio per il film.</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold leading-6 text-gray-900">Prezzo</label>
                            <div className="mt-2.5">
                                <input type='number' placeholder="Prezzo" {...register('price', { required: true })} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.price && <p>Inserisci un prezzo per il film.</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold leading-6 text-gray-900">Numero ticket</label>
                            <div className="mt-2.5">
                                <input type='number' {...register('ticket', { required: true })} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.ticket && <p>Inserisci un numero di ticket per il film.</p>}
                            </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" {...register('discoutActive')} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900">Attiva sconto</span>
                        </label>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold leading-6 text-gray-900">Descrizione</label>
                            <div className="mt-2.5">
                                <textarea {...register('description', { required: true })} rows="4" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                            {errors.description && <p>Inserisci una descrizione per il film.</p>}
                        </div>
                    </div>
                    <div className="mt-10">
                        <input type="submit" className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" />
                    </div>
                </form>
            </div>



            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Film in programmazione</h2>
                    <h2 className="text-2xl font-regular tracking-tight text-gray-900">Incasso settimanale €{weekIncome}</h2>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">{film.map((item, index) => {
                        return (
                            <Card index={index} item={item} income={true}/>

                        )
                    })}  </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
