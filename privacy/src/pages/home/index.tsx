
import { motion } from 'framer-motion';
import PrivacyPolicy from './components/PrivacyPolicy';

export default function Home() {
    return (
        <div className="bg-[#141414] min-h-screen">
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <PrivacyPolicy />
            </motion.section>
        </div>
    )
}