import soloceImg from '../../../../public/Frame_1618873316.svg'

export default function Solace() {
    return (
        <div className="min-h-screen bg-[#2D2D2D] text-white flex items-center justify-center py-20 font-sans">
            <div className="sm:w-[85%] w-[95%] mx-auto rounded-lg lg:flex flex-col lg:flex-row ">
            {/* Left Section - Image */}
            <div className="relative w-full lg:w-1/2 min-h-[400px] lg:min-h-screen-75 lg:flex items-center justify-center md:p-8">
                <div className='h-[600px]'>
                <img
                    src={soloceImg} // Placeholder image
                    alt="Elowen Lounge Chair"
                    className=" object-cover w-full h-full rounded-lg shadow-xl"
                />
                {/* Pagination/Navigation */}
                <div className="flex justify-between items-center mt-2">
                    <button className="text-white text-2xl hover:text-gray-300 transition duration-300">
                        &larr;
                    </button>
                    <span className="text-lg">1/5</span>
                    <button className="text-white text-2xl hover:text-gray-300 transition duration-300">
                        &rarr;
                    </button>
                </div>
                </div>
                <div className="absolute md:top-[-15px] top-[-55px] md:left-20 left-5 bg-white text-[#6F5B4E] rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-md">
                    2
                </div>
                <div className="absolute top-0 bottom-0 left-0 right-0 inset-0 flex items-center justify-center">
                <h1 className="md:text-6xl text-4xl lg:text-7xl font-bold text-white text-center leading-tight">
                    <div className='lg:absolute md:right-[-1em] md:top-1/3'>
                        <span className='text-black'>THE SOL</span>ACE
                    </div>
                    <div className='lg:absolute lg:right-[-5.7em] lg:top-1/3 lg:mt-20'>
                        <span className='text-black'>SCEN</span>TED CANDLE
                    </div>
                </h1>
                </div>
                
            </div>
    
            {/* Right Section - Content */}
            <div className="w-full lg:w-1/2 py-8 lg:py-16 flex flex-col justify-between">
                <div>
                <p className="text-lg mb-8 leading-relaxed md:ps-32">
                Hand-poured in small batches, the Solace Candle blends notes of white cedar, amber, and vetiver to create a grounding, luxurious ambiance. Encased in a minimal ceramic vessel, it&apos;s a statement in scent and style.
                </p>
                </div>
    
                <div className='mt-20  lg:mt-64 '>
                    <button className="border-white border hover:text-[#6F5B4E] px-14 py-3 max-md:w-full rounded-full text-lg font-semibold shadow-md hover:bg-gray-200 transition duration-300">
                        Shop now
                    </button>
                </div>
                <div className=" text-left mt-16 flex flex-col justify-end items-end">
                    <div className=' md:w-[60%] '>
                        <p className="italic text-lg mb-4">
                        “It smells like peace. I light it every evening, and my entire living room feels like a retreat. Elegant packaging too!”
                        </p>
                        <p className="font-semibold text-lg">
                        — Chidera M., Home Fragrance Collector
                        </p>
                    </div>
                </div>
            </div>
            </div>
        </div>
        );
}