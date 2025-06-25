import { motion } from "framer-motion";
import { Vector2Img, VectorImg } from "../../../assets";
import { scrollToElement } from "../../../utils";

export default function GrowthEngine() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className=" sm:py-16"
        >
            <div className=" bg-gradient-to-r from-[#E4E1F5] via-[#FFFCF9] via-[#FFFCF9] via-[#E0F7D7] to-[#FBF7E1] sm:rounded-xl relative border-2 py-24 overflow-hidden sm:w-[70%] mx-auto flex flex-col items-center justify-center px-4">
                <div className="text-center md:w-[60%] w-[90%] mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold bg-black bg-clip-text text-transparent mb-4">
                    Ready to Make SEO Your Growth Engine?”
                    </h2>
                    <p className="text-lg text-gray-900 sm:w-[70%] w-[95%] mx-auto mb-6">
                    Experience the Sirz AI Agent for yourself — no credit card required
                </p>
                </div>
                <section className="flex space-x-2 static z-10">
                    <div onClick={() => scrollToElement('agent-section')} className="">
                        <button className="bg-colorBlueDeep border-colorBlueDeep border hover:bg-blue-700 text-white sm:px-8 px-6 sm:py-4 py-3 sm:text-lg text-sm rounded-md">Book a demo</button>
                    </div>
                    <div onClick={() => scrollToElement('contact-section')} className="">
                        <button className="border-colorBlueDeep hover:bg-blue-100 text-colorBlueDeep border-2 sm:px-8 px-6 sm:py-4 py-3 sm:text-lg text-sm rounded-md">Get started</button>
                    </div>
                </section>
                <div className=" flex items-center absolute justify-center ">
                    <img src={Vector2Img} alt="" className="object-cover" />
                    <img src={VectorImg} alt="" />
                </div>
            </div>
        </motion.div>
    )
}