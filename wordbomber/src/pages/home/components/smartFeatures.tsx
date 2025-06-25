import { FaDiamond } from "react-icons/fa6";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { FeatureSectionImg, FeatureSectionImg2, FeatureSectionImg3 } from "../../../assets";
import { SmartFeatureCard } from "../../../components/layout/card";
import { motion } from 'framer-motion';

export default function SmartFeatures() {

    const features = [
        {
            title: "Discover High-Intent Queries",
            intro: {
              title: "Feature Section",
              icon: <FaDiamond />,
              color: "#005CE6"
            },
            description: "Uncover the actual terms and questions your ideal customers are searching for online — not guesses or assumptions. Get precise, AI‑driven keyword recommendations that reveal how your audience finds you.",
            buttonText: "Discover Insights",
            img: FeatureSectionImg,
            reviewer: {
              name: "Matthew Jason",
              position: "Marketing Lead, SaaS Company",
              img: "https://randomuser.me/api/portraits/men/47.jpg",
              quote: "Before Sirz, we were guessing which keywords would work. After using the SEO Agent, we discovered long‑tail searches that brought in 40% more qualified traffic. It felt like reading our customers’ minds."
            }
        },
        {
            title: "Boost Visibility and Conversions",
            intro: {
              title: "Conversions",
              icon: <BiSolidDownArrow />,
              color: "#FFC600"
            },
            invert: true,
            description: "Rank for searches that matter — not just traffic, but traffic that converts. The SEO Agent ensures every piece of content works harder, bringing higher‑quality leads into your funnel and boosting your ROI.",
            buttonText: "Explore visibility",
            img: FeatureSectionImg2,
            reviewer: {
              name: "David Vanderheeren",
              position: "Marketing Lead, B2B SaaS Company",
              img: "https://randomuser.me/api/portraits/men/47.jpg",
              quote: "“After integrating Sirz's recommendations, our traffic doubled in three months — but more importantly, those visitors started converting. We now have a 30% higher conversion rate from organic search.”"
            }
        },
        {
            title: "Map Queries to Buying Stages",
            intro: {
              title: "Prioritization",
              icon: <BiSolidUpArrow />,
              color: "#FF2638"
            },
            description: "Prioritize keywords based on where your audience is in their journey — from early research to final purchase. This way, every piece of content you create speaks directly to their needs and moves them closer to conversion.",
            buttonText: "Prioritize keywords",
            img: FeatureSectionImg3,
            reviewer: {
              name: "Matthew Jason",
              position: "Growth Manager, Fintech Startup",
              img: "https://randomuser.me/api/portraits/men/47.jpg",
              quote: "With Sirz, we stopped chasing irrelevant traffic. We now target keywords that match our buyer’s intent, and it has increased demo requests by 25% within the first month"
            }
        },
    ]
    return (
        <div className="py-24 bg-[#FAFAFA]">       
            <div className=" sm:w-[80%] w-[95%] mx-auto">
                {
                    features.map((feature, index) => (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            key={index}
                            className="mt-16"
                        >
                            <SmartFeatureCard 
                                title={feature.title} 
                                description={feature.description} 
                                img={feature.img}
                                invert={feature.invert}
                                intro={
                                    {
                                        title: feature.intro.title,
                                        icon: feature.intro.icon,
                                        color: feature.intro.color,
                                    }
                                }
                                buttonText={feature.buttonText}
                                reviewer={
                                    {
                                        name: feature.reviewer.name,
                                        position: feature.reviewer.position,
                                        img: feature.reviewer.img,
                                        quote: feature.reviewer.quote,
                                    }
                                }
                            />
                        </motion.div>
                    ))
                }
            </div>
        </div>
    )
}