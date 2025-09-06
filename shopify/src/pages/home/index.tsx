// import { FacebookIcon, InstagramIcon, LinkedlnIcon } from '../../assets/icons/svg';
import { socialLinks } from '../../utils';
import { motion, useAnimation } from 'framer-motion';
import { SirzLogoLight } from '../../assets';
import { useEffect, useRef } from 'react';

// images
import heroframe from '../../assets/img/shopify-Frame 12.png';
import heroFrame2 from '../../assets/img/shopify-image 2.png';

import detailImg from '../../assets/img/shopify-lucide_store.png';
import detailImg2 from '../../assets/img/shopify-mdi_stars.png';
import detailImg3 from '../../assets/img/shopify-ic_round-more-time.png';

import shopifyAnaluticsImg from '../../assets/img/shopify-Frame 1798.png';
import shopifyAnaluticsImg2 from '../../assets/img/shopify-Frame 1793.png';
import rectangleImg from '../../assets/img/Rectangle 3.png';
import { ShoppingCart } from 'lucide-react';
import AutomationContactForm from '../../components/Forms/contactForm';
import { IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5';
import Checklist from '../../components/checklist';


const metricsCards = [
    {
        title: `1. Turnover (Total Sales)`,
        text: `The store was generating minimal sales due to poor conversion rates and a lack of customer trust. Monthly turnover averaged around $320, despite steady traffic.`,
        text2: `After applying the audit insights and checklist, the store saw a significant revenue boost — climbing to $2,315 in sales. The improvements in product presentation and user experience played a key role.`,
    },
    {
        title: `2. Total Sessions (Traffic)`,
        text: `Despite running ads and promotions, traffic was stagnant at around 562 sessions per week. Most visitors bounced without engaging.`,
        text2: `With strategic changes to SEO, page layout, and call-to-action placements, traffic surged to over 1,800 sessions, driven by better visibility and engagement.`,
    },
    {
        title: `3. Conversion Rate`,
        text: `Out of hundreds of visitors, only about 1.2% made a purchase. The site lacked persuasive elements and didn’t guide users toward action.`,
        text2: `The optimized layout, stronger CTAs, and trust signals increased the conversion rate to 3.9%, more than tripling the effectiveness of existing traffic.`,
    },
    {
        title: `4. Average Order Value (AOV)`,
        text: `Customers often bought just one low-ticket item, with an average order value of $18.75. Upsells and cross-sells were missing or poorly placed`,
        text2: `With upsell strategies and better product bundling in place, the average order value rose to $28.90, increasing revenue per transaction.`,
    },
    {
        title: `5. Cart Abandonment Rate`,
        text: `Abandonment was high at 78%, mostly due to a confusing checkout process, lack of trust, and hidden costs at the final step.`,
        text2: `Streamlining the checkout, clarifying shipping details, and adding reassurance elements reduced abandonment to 42%, recovering lost sales.`,
    },
    {
        title: `6. Returning Customer Rate`,
        text: `Only 12% of customers came back, with no email flows or post-purchase engagement in place.`,
        text2: `After implementing personalized email follow-ups and loyalty perks, the returning customer rate more than doubled to 27%, creating long-term revenue growth.`,
    },
]

const details = [
    {
        img: detailImg,
        title: `Optimized 100+ Shopify Store`,
    },
    {
        img: detailImg2,
        title: `5-Star Rated by Ecommerce Founders`,
    },
    {
        img: detailImg3,
        title: `Takes Less Than 2 Minutes to Claim`,
    },
];

const automationStack = [
    {
        img: ShoppingCart,
        title: `High cart abandonment`,
    },
    {
        img: ShoppingCart,
        title: `Poor mobile experience`,
    },
    {
        img: ShoppingCart,
        title: `Confusing navigation`,
    },
    {
        img: ShoppingCart,
        title: `Low trust signals`,
    },
];

export default function Home() {
    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const scaleIn = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.6 }
    };

    // Scroll-triggered animations
    const controls = useAnimation();
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    controls.start('animate');
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [controls]);

    return (
        <div className=" mx-auto">
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className='relative'
            >
                <div
                    style={{
                        backgroundImage: `url(${rectangleImg})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: "white"
                    }}
                    className='rounded-lg overflow-hidden'
                >
                    <div className='w-[95%] md:w-[90%] lg:w-[80%] mx-auto'>
                        <div className='flex items-center justify-center flex-col px-4'>
                            <motion.div
                                variants={scaleIn}
                                initial="initial"
                                animate="animate"
                                className='absolute top-0 left-0 right-0 flex items-center justify-center bg-colorGreenDeeper py-5 md:py-6'
                            >
                                <img src={SirzLogoLight} alt="SIRz Logo" className='w-[60px] md:w-[70px]' />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section 
                className='bg-colorLight dark:bg-colorDark pt-24 md:pt-32'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <img src={heroframe} alt="Shopify Hero" className='mx-auto pb-4 md:pb-6 object-cover md:w-auto' />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <img src={heroFrame2} alt="Shopify Features" className='mx-auto w-[95%] md:w-auto' />
                </motion.div>                
            </motion.section>

            <motion.section 
                className='w-full mx-auto pb-8'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                ref={ref}
            >
                <motion.div 
                        className='w-[95%] sm:w-[90%] lg:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8'
                        variants={staggerContainer}
                        initial="initial"
                        animate={controls}
                        viewport={{ once: true }}
                    >
                        {
                            details.map((data, index) => (
                            <motion.div 
                            key={index} 
                            className={`bg-colorLight text-center flex flex-col items-center text-sm dark:bg-colorDark px-4 py-5 text-zinc-600 ${index < 2 ? 'sm:border-e sm:border-colorGreen' : ''} shadow-sm hover:shadow-md transition-shadow duration-300`}
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                        >
                            <img src={data.img} alt="" className='w-[70px]' />
                            <h4 className=' text-[20px] py-2'>{data.title}</h4>
                        </motion.div>
                            ))
                        }
                </motion.div>
            </motion.section>

            {/* <motion.section 
                className='bg-colorLight w-[95%] sm:w-[90%] lg:w-[80%] mx-auto dark:bg-colorDark'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.header 
                    className='flex items-center justify-center py-5'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='text-center mx-auto px-4'>
                        <h1 className='font-bold text-[28px] md:text-[40px]'>What&apos;s Inside the <i className=' text-colorGreen italic'>Free</i> Checklist?</h1>
                        <i className='text-sm md:text-base '>This actionable checklist is designed to help Shopify store owners identify hidden leaks in their funnel and turn more visitors into paying customers — fast.</i>
                    </div>
                </motion.header>
                <div className='mx-auto grid grid-cols-1 sm:grid-cols-5 gap-8 md:gap-14 py-8 md:py-12 px-4'>
                  
                    <motion.div 
                        className='sm:col-span-3 my-auto text-md order-2 sm:order-1'
                        variants={fadeInRight}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className='pb-5'>
                            <i className='text-black font-bold text-xl md:text-2xl'>What is SIRz AI Agents?</i>
                            <p className='leading-7 md:leading-8 tracking-wide md:tracking-wider pt-3 text-sm md:text-base'>
                                SIRz AI Agents is your all-in-one automation powerhouse — designed to turn your digital marketing funnel into a smart, self-optimizing engine.
                            </p>
                            <p className='leading-7 md:leading-8 tracking-wide md:tracking-wider py-3 text-sm md:text-base'>
                                Built for growth-focused teams, SIRz brings together intelligent SEO discovery, high-speed content creation, real-time lead scoring, and an always-on AI chatbot — all fully synced with your CRM. From the moment someone searches, to the second your sales team steps in, every touchpoint is tracked, scored, and optimized to drive conversions.                            </p>
                            <p className='leading-8 tracking-wider'>
                                No more guesswork. No more disconnected tools. Just seamless automation that actually works — from search to sale.                            </p>
                        </div>
                    </motion.div>
                    <motion.div 
                        className='sm:col-span-2 order-1 sm:order-2 mb-6 sm:mb-0'
                        variants={fadeInLeft}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <img src={agentImg} alt="SIRz AI Agents" className='w-full rounded-lg shadow-md' />
                    </motion.div>
                </div>
            </motion.section> */}

            <Checklist />

            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className='w-[95%] sm:w-[90%] lg:w-[80%] mx-auto'
            >
                <motion.header 
                    className='flex items-center justify-center py-5'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='text-center mx-auto px-4'>
                        <h1 className='font-semibold text-[28px] md:text-[35px]'>What’s Costing <i className=' text-colorGreen'>You</i>  Sales?</h1>
                        {/* <img src={titleBorder} alt="" className='w-[120px] mx-auto max-sm:pb-5' /> */}
                    </div>
                </motion.header>
                <motion.div 
                    className='grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-7 px-4'
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {automationStack.map((data, index) => (
                        <motion.div 
                            key={index} 
                            className='bg-colorLight border-b-4 border-colorBlueLight text-center flex flex-col items-center text-sm dark:bg-colorDark px-3 md:px-4 py-4 md:py-5 text-zinc-600 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300'
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                        >
                            <data.img height={40} width={40} className='bg-colorBlueLight text-colorBlueDeep p-2 rounded-full' />
                            <h4 className='text-sm md:text-lg py-2 font-medium'>{data.title}</h4>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div 
                    className='flex items-center justify-center py-10 flex-col'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className='text-center text-lg md:text-2xl pb-5 italic font-medium px-4'>Our free audit identifies these issues — and shows you how to fix them</div>
                    <motion.button 
                        className="tracking-widest w-[80%] sm:w-[50%] md:w-[35%] lg:w-[25%] mt-4 bg-colorBlueDeep text-white border-2 border-colorBlueLight rounded-full py-3 md:py-4 cursor-pointer text-xs md:text-sm px-6 md:px-8 whitespace-nowrap font-medium floating-button"
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        // onClick={() => navigate(ROUTES.DASHBOARD.PATH)}
                    >
                        Claim free audit now
                    </motion.button>
                </motion.div>
            </motion.section>



            <motion.section 
                className='pt-12 md:pt-16'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.header 
                    className='flex items-center justify-center py-5'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='text-center max-w-[800px] mx-auto px-4'>
                        <h1 className='font-bold text-[28px] md:text-[45px]'>Real Results from Our Shopify Audit Process - Case Study</h1>
                    </div>
                </motion.header>
                <motion.div 
                    className='py-5 w-[95%] sm:w-[90%] lg:w-[80%] mx-auto'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <img src={shopifyAnaluticsImg2} alt="Shopify Analytics" className='object-cover w-full rounded-lg shadow-md' />
                </motion.div>
                <motion.div 
                    className='py-5 w-[95%] sm:w-[90%] lg:w-[80%] mx-auto'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <img src={shopifyAnaluticsImg} alt="Shopify Analytics Results" className='object-cover w-full rounded-lg shadow-md' />
                </motion.div>
            </motion.section>

            <motion.section 
                className='bg-colorLight dark:bg-colorDark pt-16'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
            </motion.section >


            <motion.section 
                className='bg-whitedark:bg-colorDefaultDark sm:w-[80%] w-[95%] mx-auto py-10 md:py-14'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.header 
                    className='flex items-center max-w-[800px] mx-auto px-4 justify-center py-5'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='text-center max-w-[90%] mx-auto px-4'>
                        <h1 className='font-bold text-[28px] md:text-[25px]'>From Stuck to Scaled: What Changed After the Free Audit?</h1>
                        <i className='text-sm md:text-lg'>Data-backed improvements that speak for themselves.</i>
                    </div>
                </motion.header>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4'>
                        {
                            metricsCards.map((data, index) => (
                                <motion.div 
                                    key={index} 
                                    className='flex flex-col text-sm p-4 md:p-5 text-zinc-600 shadow-lg rounded-2xl hover:shadow-lg transition-shadow duration-300'
                                    variants={fadeInUp}
                                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                                >
                                    <h4 className='text-[18px] md:text-[20px] text-colorBlueDeep font-semibold py-2'>{data.title}</h4>
                                    <h4 className='font-semibold pt-3 text-[14px] md:text-[16px]'>Before:</h4>
                                    <p className='tracking-wide md:tracking-wider text-xs md:text-sm'>{data.text}</p>
                                    <h4 className='font-semibold pt-3 text-[14px] md:text-[16px]'>After:</h4>
                                    <p className='tracking-wide md:tracking-wider text-xs md:text-sm'>{data.text2}</p>
                                </motion.div>
                            ))
                        }
                    </div>
                </motion.div>
            </motion.section>

            <motion.section 
                className="bg-colorLight dark:bg-colorDark py-8 md:py-10 bg-dashboard-form-gradient"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.header 
                    className='flex items-center max-w-[800px] mx-auto text-white px-4 justify-center py-5'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='text-center max-w-[800px] mx-auto px-4'>
                        <h1 className='font-semibold text-[28px] md:text-[35px]'>Claim Your Free Shopify Store Audit + Checklist</h1>
                        {/* <i>No fluff. Just results</i> */}
                    </div>
                </motion.header>
                <motion.div 
                    className="max-w-[800px] mx-auto sm:mt-8 mt-5 px-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <AutomationContactForm />
                </motion.div>
            </motion.section>

            <motion.footer
                className="bg-colorGreenDeeper pt-4 mt-20 md:mt-32 pb-8 relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* <div className='absolute top-[-75px] right-0 left-0 bg-colorGreen max-w-[800px] mx-auto rounded-lg sm:py-10 py-5'>
                    <div className='max-w-[700px] mx-auto flex items-center gap-8 px-4'>
                        <img src={emailImg} alt="" className='h-[80px]' />
                        <div>
                            <h4 className='font-semibold leading-4 pb-3'>
                                Need some help or assistance? Or maybe you want to make an enquiry.
                            </h4>
                            <div className='text-sm'>Reach out to <a href="mailto:support@sirz.co.uk">[support@sirz.co.uk]</a></div>
                        </div>
                    </div>
                </div> */}
                <div className='max-w-[1200px] mx-auto sm:rounded-2xl sm:px-10 px-5 pt-20 md:pt-28 pb-8'>
                    <motion.div 
                        className="pb-8 md:pb-12 border-b border-gray-400"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className='text-center flex items-center justify-center flex-col max-w-[800px] mx-auto'>
                            <img src={SirzLogoLight} alt="SIRz Logo" className='w-[100px] md:w-auto' />
                            <div className='text-[16px] md:text-[20px] text-white pt-5'>
                                SIRz is your one-stop shop for E-commerce, Branding, and Digital Marketing, we help businesses launch, scale, and dominate in the digital space.
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex text-white flex-row items-center justify-center gap-x-5">
                            <motion.a 
                                href={socialLinks.Facebook} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <IoLogoLinkedin className='text-[25px] md:text-[30px]' />
                            </motion.a>
                            <motion.a 
                                href={socialLinks.Facebook} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <IoLogoFacebook className='text-[25px] md:text-[30px]' />
                            </motion.a>
                            <motion.a 
                                href={socialLinks.Instagram} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <IoLogoInstagram className='text-[25px] md:text-[30px]' />
                            </motion.a>
                        </div>
                        <h4 className="text-[#fff] font-nexa-light text-[11px] md:text-[13px] text-center flex flex-col sm:flex-row items-center gap-2 sm:gap-8 font-thin">
                            <p>17 Barmouth Road marine parade LL42 1NA</p>
                            <p>074 07245685</p>
                            <motion.a 
                                href="mailto:support@sirz.co.uk"
                                whileHover={{ scale: 1.05 }}
                            >
                                support@sirz.co.uk
                            </motion.a>
                        </h4>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    )
}