import { Video } from "../../../assets";

export default function VideoSection() {
    return (
        <div className=" bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 py-16">
            <div className="text-center md:w-[40%] w-[90%] mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
                Turn Searches Into Sales — See the SEO Agent in Action
                </h2>
            </div>
            <video src={Video} autoPlay loop muted className=" sm:w-[70%] w-[95%] mx-auto " />
        </div>
    )
}