import { SirzLogo } from "../../assets";
import { motion } from "framer-motion";

export default function NavBar() {

    return (
        <div className='flex items-center border-b border-gray-200 justify-center sm:h-[130px] h-[70px] flex-col px-4'>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <img src={SirzLogo} alt="" className="sm:w-[130px] w-[70px] object-cover" />
            </motion.div>
        </div>
    );
}

