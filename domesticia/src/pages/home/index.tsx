

import { motion } from 'framer-motion';
import Hero from './components/hero';
import Footer from './components/footer';
import Nav from './components/nav';
import Cultured from './components/cultured';
import Signature from './components/signature';
import Why from './components/why';
import Solace from './components/solace';
import Elowen from './components/elowen';
import Testimonial from './components/testimonial';
import NewsletterSignup from './components/newletter';
import Highlights from './components/highlights';

export default function Home() {

    return (
        <div className="">
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className=' mt-20'
            >
               <div className="">
               <Nav/>
               <Hero/> 
               </div>
               <Cultured />
               <Signature />
               <Why />
               <Highlights />
               <Solace />
               <Elowen />
               <Testimonial />
               <NewsletterSignup />
               <Footer/>
            </motion.section>
        </div>
    )
}