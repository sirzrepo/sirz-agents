
import { motion } from 'framer-motion';

import NavBar from '../../components/layout/nav';
import SmartFeatures from './components/smartFeatures';
import { Footer } from '../../components/layout/footer';
import GrowthEngine from './components/growthEngine';
import Hero from './components/hero';
import TopKeywords from './components/topKeywords';
import ReviewSection from './components/review';
import VideoSection from './components/videoSection';
import Contact from './components/contact';
import AgentWrapper from './components/agent/wrapper';


export default function Home() {

    return (
        <div className=" ">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-[#E4E1F5] via-[#FFFCF9] via-[#FFFCF9] via-[#E0F7D7] to-[#FBF7E1]"
            >
                <NavBar />
                <Hero />
                <TopKeywords />
            </motion.div>

            <AgentWrapper />
            <SmartFeatures />
            <ReviewSection />
            <VideoSection />
            <GrowthEngine />
            <Contact />

            <Footer />
        </div>
    )
}