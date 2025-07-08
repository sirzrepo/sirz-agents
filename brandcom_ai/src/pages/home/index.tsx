

import { motion } from 'framer-motion';
import Hero from './components/hero';
import Footer from './components/footer';
import Nav from './components/nav';
import Why from './components/why';
import Journey from './components/journey';
import Vault from './components/vault';
import Idea from './components/idea';

export default function Home() {

    return (
        <div className=" ">
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className=' '
            >
               <div className="">
               <Nav/>
               <Hero/> 
               </div>
               <Why/>
               <Journey/>
               <Vault/>
               <Idea/>
               <Footer/>
            </motion.section>
        </div>
    )
}