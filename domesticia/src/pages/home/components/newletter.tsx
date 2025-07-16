
export default function NewsletterSignup() {
  return (
    <div className="flex items-center mx-auto justify-center sm:py-28 py-16 bg-[#F8F6F5] sm:mt-16 ">
      <div className="max-md:w-[95%]  text-center space-y-6 sm:space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight">
          <span className="text-custom-dark-gray">STAY INSPIRED...</span>{" "}
          <span className="text-[#CBA461]">LIVE BEAUTIFULLY...</span>
        </h1>
        <p className="text-lg sm:text-xl text-custom-medium-gray px-4 sm:px-0">
          Join our exclusive mailing list for early access to new arrivals, private events, and styling tips.
        </p>
        <form className="flex flex-col items-center space-y-6 pt-4">
          <div className="w-full max-w-xl">
            {/* <label htmlFor="email" className="text-left">
              Email address.
            </label> */}
            <input
              id="email"
              type="email"
              placeholder="Email address"
              className="w-full border-b outline-none border-gray-300 focus:border-[#CBA461] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none px-0 py-2 text-left bg-transparent placeholder:text-gray-500 text-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-[#734E33] shadow-xl text-white hover:bg-[#734E33]/90 px-12 py-3 rounded-full text-lg font-semibold shadow-md transition-colors duration-200"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  )
}
