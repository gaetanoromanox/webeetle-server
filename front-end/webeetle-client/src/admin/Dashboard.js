import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';



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
            body: JSON.stringify( data )
        });

        if (response.ok) {
            toast("Film creato con successo")
            const data = await response.json();
            return data;
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
            console.error("Failed to create plan film");
            return null;
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

    const sconti = (day, oldPrice) => {
        const date = new Date(day);
        console.log(date.getHours())
        if (date.getDay() === 1) {
            price = oldPrice * 0.8;
        } else if (date.getDay() === 2) {
            price = oldPrice * 0.6;
        } else { date.getHours() > 17 && date.getDay() === 0 ? price = oldPrice * 1.2 : price = oldPrice * 0.9; }
    }

    useEffect(() => {
        getFilm()
    }, []);
    const totalIncome = film.map((item, index) => { return item.income }).reduce((a, b) => a + b, 0)
    const weekIncome = filteredFilm.map((item, index) => { return item.income }).reduce((a, b) => a + b, 0)

    const columns = [
        {
            name: 'Titolo',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Descrizione',
            selector: row => row.description,
            sortable: true,
        },
        {
            name: 'Programmato',
            selector: row => formattaData(row.start),
            sortable: true,
        },
        {
            name: 'Prezzo',
            selector: row => row.price,
            sortable: true,
        },
        {
            name: 'Incasso',
            selector: row => row.income,
            sortable: true,
        },
    ];

    return (
        <div className="w-screen h-screen flex flex-col">
            <div class="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Aggiungi film alla programmazione</h2>
                </div>
                <ToastContainer />
                
                {/* <div class="mx-auto mt-8 max-w-xl">
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Titolo</label>
                            <div class="mt-2.5">
                                <input type='text' placeholder="Titolo"  value={title} onChange={e => setTitle(e.target.value)} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Data</label>
                            <div class="mt-2.5">
                                <input type="datetime-local" placeholder="Data" value={start} onChange={e => setStart(e.target.value)} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Prezzo</label>
                            <div class="mt-2.5">
                                <input type='number' placeholder="Prezzo" value={price} onChange={e => setPrice(e.target.value)} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Numero ticket</label>
                            <div class="mt-2.5">
                                <input type='number' value={ticket} onChange={e => setTicket(e.target.value)} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div class="flex h-6 items-center">
                            <button type="button" class="bg-gray-200 flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" role="switch" aria-checked="false" aria-labelledby="switch-1-label">
                                <span class="sr-only">Agree to policies</span>
                                <span aria-hidden="true" class="translate-x-0 h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"></span>
                            </button>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="message" class="block text-sm font-semibold leading-6 text-gray-900">Descrizione</label>
                            <div class="mt-2.5">
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows="4" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                        </div>

                    </div>
                    <div class="mt-10">
                        <button onClick={() => createPlanFilm()} class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Aggiungi film</button>
                    </div>
                </div> */}

                <form onSubmit={handleSubmit((data) => createPlanFilm(data))} class="mx-auto mt-8 max-w-xl">
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Titolo</label>
                            <div class="mt-2.5">
                                <input type='text' placeholder="Titolo" {...register('title', { required: true })} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.title && <p>Inserisci un titolo per il film.</p>}
                            </div>
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Data</label>
                            <div class="mt-2.5">
                                <input type="datetime-local" placeholder="Data" {...register('start', { required: true })} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.start && <p>Inserisci un inizio per il film.</p>}
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Prezzo</label>
                            <div class="mt-2.5">
                                <input type='number' placeholder="Prezzo" {...register('price', { required: true })} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.price && <p>Inserisci un prezzo per il film.</p>}
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Numero ticket</label>
                            <div class="mt-2.5">
                                <input type='number' {...register('ticket', { required: true })} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                {errors.ticket && <p>Inserisci un numero di ticket per il film.</p>}
                            </div>
                        </div>

                        <div class="flex h-6 items-center">
                            <button type="button" class="bg-gray-200 flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" role="switch" aria-checked="false" aria-labelledby="switch-1-label">
                                <span class="sr-only">Agree to policies</span>
                                <span aria-hidden="true" class="translate-x-0 h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"></span>
                            </button>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="message" class="block text-sm font-semibold leading-6 text-gray-900">Descrizione</label>
                            <div class="mt-2.5">
                                <textarea {...register('description', { required: true })} rows="4" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                            {errors.description && <p>Inserisci una descrizione per il film.</p>}
                        </div>

                    </div>
                    <div class="mt-10">
                    <input type="submit" class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"/>
                     </div>
                </form>
            </div>



            <div class="bg-white">
                <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 class="text-2xl font-bold tracking-tight text-gray-900">Film in programmazione</h2>
                    <h2 class="text-2xl font-regular tracking-tight text-gray-900">Incasso settimanale €{weekIncome}</h2>





                    <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">{film.map((item, index) => {
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
                                <div class="aspect-h-1 aspect-w-1 w-full mt-4 overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                    <img src="https://pad.mymovies.it/filmclub/2022/09/022/locandinapg2.jpg" alt="Locandina film" class="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                                </div>
                                <div class="mt-4 flex justify-between">
                                    <div>
                                        <h3 class="text-sm text-gray-700">
                                            <span aria-hidden="true" class="absolute inset-0"></span>
                                            {item.title}
                                        </h3>
                                        <p class="mt-1 text-sm text-gray-500 ">{item.description}</p>
                                    </div>
                                    <div className='flex items-end flex-col'>
                                        <p class="text-sm font-medium text-gray-900 ">€{item.price}</p>
                                        <p class="text-sm font-medium text-gray-900">Tot:€{item.income}</p>
                                    </div>
                                </div>
                            </div>

                        )
                    })}  </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
