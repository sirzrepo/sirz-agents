
export default function Hero() {
  return (
    <div className=" relative  sm:w-[85%] w-[95%] mx-auto h-[90vh] mx-auto">
      <img
            src="https://images.unsplash.com/photo-1563247156-b52f14b741b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGtpdGNoZW4lMjB1dGVzaWxzfGVufDB8fDB8fHww"
            alt="Cozy seating area with fireplace and neutral furnishings"
            className="object-cover w-full h-full sm:rounded-3xl rounded-xl"
        />
          {/* <div> */}
            <div className="lg:text-[3rem] text-4xl font-medium text-white absolute lg:top-1/2 max-lg:text-center top-32 lg:left-10 max-w-4xl ">
                Elevate the Art of Living Through Timeless Design and Refined Comfort
            </div>

            <div className=" absolute lg:bottom-1/4 lg:right-[25%] bottom-20 max-lg:text-center lg:transform lg:translate-x-1/2 lg:translate-y-1/2">
              <div className="text-white text-2xl lg:max-w-xl">
              Discover timeless home essentials that blend sophistication, comfort, and curated elegance.
              </div>
              <button className="bg-white py-3 px-6 rounded-full mt-5">Explore the Collection</button>
            </div>

          {/* </div> */}
    </div>
  )
}
