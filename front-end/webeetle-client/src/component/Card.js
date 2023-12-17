function Card({ index, item, income, action }) {





    const formattaData = (data) => {
        const date = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(data).toLocaleDateString(undefined, date);
    }
    const isBefore = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(date) > today;
    } 
    return (

        <div className="group relative" key={index}>
            <div className="mt-4 flex flex-col">
                 
                    <h3 className="text-sm text-gray-700">
                        Programmato per il:
                    </h3>
                    <p className="text-sm font-medium text-gray-900"> {formattaData(item.start)}</p>
            
             
            </div>
            <div className="aspect-h-1 aspect-w-1 w-full mt-4 overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                <img src="https://pad.mymovies.it/filmclub/2022/09/022/locandinapg2.jpg" alt="Locandina film" className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700">
                        {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 ">{item.description}</p>
                </div>
                <div className='flex items-end flex-col'>
                    <p className="text-sm font-medium text-gray-900 ">€{Math.round(item.price * 100) / 100}</p>
                    {income && <p className="text-sm font-medium text-gray-900">Tot:€{item.income === null ? '0' : item.income}</p>}
                </div>

            </div>
            {income === false ?
                isBefore(item.start) && item.ticket != 0  ?
                    <>
                        <p className="text-sm font-medium text-gray-900">Disponibili: {item.ticket}</p>
                        <button onClick={action} className="block w-full mt-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Acquista ticket</button>
                    </>
                    :
                    <p className="text-sm font-medium text-gray-900">Film terminato</p>
                : null
            }
        </div>



    );
}

export default Card;
