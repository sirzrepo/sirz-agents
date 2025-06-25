import { IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin } from "react-icons/io5";
import { SirzLogoLight } from "../../assets";
import { socialLinks } from "../../utils";
import { motion } from "framer-motion";

export const Footer = () => {
    return (
        <motion.footer
            className="bg-colorGreenDeeper pt-4 pb-8 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className='max-w-[1200px] mx-auto sm:rounded-2xl sm:px-10 px-5 pt-28 pb-8'>
                <div className="pb-12 border-b border-gray-400">
                    <div className='text-center flex items-center justify-center flex-col max-w-[800px] mx-auto'>
                        <img src={SirzLogoLight} alt="" />
                        <div className='text-[20px] text-white pt-5'>
                            SIRz is your one-stop shop for E-commerce, Branding, and Digital Marketing, we help businesses launch, scale, and dominate in the digital space.
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex text-white flex-row items-center justify-center gap-x-5">
                        <a href={socialLinks.Facebook} target="_blank" rel="noopener noreferrer">
                            <IoLogoLinkedin className='text-[30px]' />
                        </a>
                        <a href={socialLinks.Facebook} target="_blank" rel="noopener noreferrer">
                            <IoLogoFacebook className='text-[30px]' />
                        </a>
                        <a href={socialLinks.Instagram} target="_blank" rel="noopener noreferrer">
                            <IoLogoInstagram className='text-[30px]' />
                        </a>
                    </div>
                    <h4 className="text-[#fff] font-nexa-light text-[13px] text-center flex flex-col sm:flex-row items-center gap-2 sm:gap-8 font-thin">
                        <p>17 Barmouth Road marine parade LL42 1NA</p>
                        <p>074 07245685</p>
                        <a href="mailto:support@sirz.co.uk">
                            support@sirz.co.uk
                        </a>
                    </h4>
                </div>
            </div>
        </motion.footer>
    )
}