import { motion } from 'framer-motion';
import { PersonImg } from '../../../assets';


export default function ReviewSection() {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="bg-gradient-to-r from-[#E4E1F5] via-[#FFFCF9] via-[#FFFCF9] via-[#E0F7D7] to-[#FBF7E1] py-20"
  >
    <div className='flex max-md:flex-col justify-center items-center space-x-4 sm:w-[60%] gap-20 w-[95%] mx-auto'>
      <img src={PersonImg} alt="" className='sm:w-48 sm:h-48 w-36 h-36 object-cover rounded-full' />
       
      <div className='md:w-[50%] w-[95%]'>
        <p className='text-lg md:text-2xl max-sm:text-center font-semibold'>“The seamless handoff from Sirz to our content team cut down planning time by 50%. We’re publishing quality articles faster — and seeing higher engagement too.”</p>
        <div className=' space-x-4 mt-10 text-xs md:text-base mx-auto'>
          <p>— Amanda R., Content Director, SaaS SaaS Company</p>
        </div>
      </div>
     </div> 

    </motion.div>
  )
}
