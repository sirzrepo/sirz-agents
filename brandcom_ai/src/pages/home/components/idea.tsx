import Button from "../../../components/common/ui/Button";

export default function Idea() {
    return (
        <div className="sm:w-[80%] w-[90%] mx-auto ">
            <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#4D5832] via-[#4D5832] to-[#4D5832] px-6 py-20">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-green-500/20 rounded-full"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-green-400/10 rounded-full"></div>
                <div className="absolute top-1/4 right-1/3 w-40 h-40 bg-green-400/10 rounded-full"></div>
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                    GOT AN IDEA? LET'S BUILD IT TOGE
                    <span className="italic font-light">THE</span>R!
                </h2>

                <p className="text-lg md:text-xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Start with just a spark—Brandcom handles the branding, website, and marketing magic. No code, no stress,
                    just launch.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold">
                    Get started for free
                    </Button>
                    <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-3 text-lg font-semibold bg-transparent"
                    >
                    Request a demo
                    </Button>
                </div>
                </div>
            </section>
        </div>
    )
}