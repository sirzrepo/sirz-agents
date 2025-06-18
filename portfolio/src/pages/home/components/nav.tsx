export default function Nav() {
    return (
        <header className="flex sm:w-[85%] w-[95%] mx-auto text-white items-center justify-between px-6 py-6 border-b border-slate-700 relative z-10">
            <div className="text-xl font-bold tracking-wider">BABAFEMI</div>
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
                <a href="#home" className="text-gray-300 hover:text-cyan-400 transition-colors font-light">
                    HOME
                </a>
                <a href="#about" className="text-gray-300 hover:text-cyan-400 transition-colors font-light">
                    ABOUT
                </a>
                <a href="#works" className="text-gray-300 hover:text-cyan-400 transition-colors font-light">
                    WORKS
                </a>
                <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors font-light">
                    CONTACT
                </a>
            </nav>
        </header>
    )
}