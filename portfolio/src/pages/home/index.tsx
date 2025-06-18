

import { motion } from 'framer-motion';
import Hero from './components/hero';
import Footer from './components/footer';
import About from './components/about';
import ContactForm from './components/form';
import Projects from './components/project';
import Nav from './components/nav';

export default function Home() {

    return (
        <div className="bg-[#141414] ">
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className=' '
            >
               <div className="bg-[radial-gradient(circle,_#172935_0%,_#141414_80%)]">
               <Nav/>
               <Hero/> 
               </div>
               <About/>
               <Projects />
               <ContactForm />
               <Footer/>
            </motion.section>
        </div>
    )
}