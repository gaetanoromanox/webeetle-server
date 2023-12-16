import { useEffect, useState } from 'react';



function Dashboard() {
    const token = localStorage.getItem('token');
    const [start, setStart] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [ticket, setTicket] = useState("");
    const [film, setFilm] = useState([]);
    const createPlanFilm = async () => {

        const response = await fetch("http://localhost:8000/createPlanning/createPlanFilm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "start": start, "title": title, "price": price, "description": description, "ticket": ticket })
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
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
            setFilm(data)
        } else {
            console.error("Failed to get film");
            return null;
        }
    }

    const getWeekDates = () => {

        let now = new Date();
        let dayOfWeek = now.getDay(); //0-6
        let numDay = now.getDate();

        let start = new Date(now); //copy
        start.setDate(numDay - dayOfWeek);
        start.setHours(0, 0, 0, 0);


        let end = new Date(now); //copy
        end.setDate(numDay + (7 - dayOfWeek));
        end.setHours(0, 0, 0, 0);

        return [start, end];
    }



    const filterDatesByCurrentWeek = () => {
        const [startW, endW] = getWeekDates();

        const list = film.filter((item) => { return new Date(item.start) >= startW && new Date(item.start) <= endW })
        return list
    }

    useEffect(() => {
        getFilm()
        filterDatesByCurrentWeek()
    }, []);
    const totalIncome = film.map((item, index) => { return item.income }).reduce((a, b) => a + b, 0)
const weekIncome = filterDatesByCurrentWeek().map((item, index) => { return item.income }).reduce((a, b) => a + b, 0)

    return (
        <div className="w-screen h-screen flex flex-col">
            <div class="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Aggiungi film alla programmazione</h2>
                </div>
                <div class="mx-auto mt-8 max-w-xl">
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Titolo</label>
                            <div class="mt-2.5">
                                <input placeholder="Titolo" value={title} onChange={e => setTitle(e.target.value)} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Data</label>
                            <div class="mt-2.5">
                                <input type="date" placeholder="Data" value={start} onChange={e => setStart(e.target.value)} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Prezzo</label>
                            <div class="mt-2.5">
                                <input placeholder="Prezzo" value={price} onChange={e => setPrice(e.target.value)} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold leading-6 text-gray-900">Numero ticket</label>
                            <div class="mt-2.5">
                                <input value={ticket} onChange={e => setTicket(e.target.value)} class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
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
                </div>
            </div>
            <div class="bg-white">
                <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 class="text-2xl font-bold tracking-tight text-gray-900">Incasso settimanale</h2>
                    <h2 class="text-2xl font-bold tracking-tight text-gray-900">{weekIncome}</h2>
                </div>
            </div>
            <div class="bg-white">
                <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 class="text-2xl font-bold tracking-tight text-gray-900">Film in programmazione</h2>
                    <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">{film.map((item, index) => {
                        return (

                            <div class="group relative" key={index}>
                                <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                    <img src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg" alt="Front of men&#039;s Basic Tee in black." class="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                                </div>
                                <div class="mt-4 flex justify-between">
                                    <div>
                                        <h3 class="text-sm text-gray-700">
                                            <span aria-hidden="true" class="absolute inset-0"></span>
                                            {item.title}
                                        </h3>
                                        <p class="mt-1 text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <div>
                                    <p class="text-sm font-medium text-gray-900">€{item.price}</p>
                                    <p class="text-sm font-medium text-gray-900">€{item.income}</p>
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
