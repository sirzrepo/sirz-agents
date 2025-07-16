import nihHomesImg from '../../../../public/nih homes.svg'
import nihHomesbg from '../../../../public/Frame 1618873321.svg'
import { ArrowLeftIcon, ArrowRightIcon, Star } from 'lucide-react'

export default function Testimonial() {
    return (
        <div className='relative min-h-screen mt-16 py-6'>
            <div className="bg-white py-28 sm:w-[80%]  w-[95%] mx-auto">
                <div className=" flex flex-col pb-8 items-center text-center justify-center">
                    <h2 className="text-5xl uppercase font-medium pb-8">What our <span className="text-[#CBA461]">clients</span> say</h2>
                    <p className="text-xl md:w-[52%] w-[95%] text-center">
                        Stories of transformation, taste, and timeless style from industry professionals to style-conscious homeowners
                    </p>
                </div>
                <div
                    className=" min-h-[70vh]"
                > 
                    <img src={nihHomesbg} alt="" className='md:absolute left-0' />
                    <div className='md:absolute md:left-1/3 md:bottom-0 md:w-[40%] '>
                        <div className='bg-[#2D2D2D] md:rounded-xl md:p-16 p-8 text-white'>
                            <h2 className='font-bold text-xl'>“The quality is unmatched, and every piece feels like art.”</h2>
                            <div className='py-4 italic text-lg'>
                                My home feels completely transformed. The textures, the craftsmanship, the attention to detail—every element feels intentional. It’s the kind of luxury you don’t just see, you feel.
                            </div>
                            <p className='text-lg'>Amaka I. — Interior Architect</p>
                            <div className='flex gap-2 mt-5'>
                                <Star className='text-yellow-300' fill='yellow' />
                                <Star className='text-yellow-300' fill='yellow' />
                                <Star className='text-yellow-300' fill='yellow' />
                                <Star className='text-yellow-300' fill='yellow' />
                                <Star className='text-yellow-300' fill='yellow' />
                            </div>
                        </div>
                        <div className='flex items-center md:justify-end justify-center gap-8 mt-6 text-white'>
                            <ArrowLeftIcon className='bg-[#734E33] p-4 h-12 w-12 rounded-full ' />
                            <ArrowRightIcon className='bg-[#734E33] p-4 h-12 w-12 rounded-full' />
                        </div>
                    </div>
                </div>

                </div>
            <img src={nihHomesImg} alt="" className='absolute right-0 top-0 bottom-0  h-auto' />
        </div>
    )
}