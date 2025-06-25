import { motion } from 'framer-motion';

interface SmartFeatureCardProps {
    title: string;
    description: string;
    intro: {
      title: string;
      icon: React.ReactNode;
      color: string;
    };
    buttonText: string;
    img: string;
    invert?: boolean;
    reviewer: {
      name: string;
      position: string;
      img: string;
      quote: string;
    }
}

export const SmartFeatureCard = ( { title, description, intro, buttonText, img, invert, reviewer }: SmartFeatureCardProps ) => {
  return (
    <div className="">
      <div className={`flex max-sm:flex-col items-center text-left ${invert ? "flex-row-reverse" : ""}`}>
          <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="sm:w-[50%] w-[95%] mx-auto "
          >
            <motion.div className='sm:w-[70%] mx-auto'>
            <div 
            style={{ color: intro.color }}
            className="flex items-center space-x-2 uppercase"
            >
              <div>{intro.icon}</div>
              <div className="font-semibold text-sm">{intro.title}</div>
            </div>
            <h2 className="sm:text-4xl text-3xl font-extrabold text-gray-800 my-6">
              {title}
            </h2>
            <p className="text-black mb-8 leading-relaxed">
              {description}
            </p>
            <button className={`font-semibold border px-8 py-4  mb-6`}>
              {buttonText}
            </button>

            <div className="pt-8">
              <div className="text-gray-500 mb-4 italic">
                {reviewer.quote}
              </div>
              <div className="flex items-center space-x-2">
                <img 
                className='w-12 h-12 rounded-full'
                src={reviewer.img} alt="" />
                <div className="flex flex-col">
                  <h2 className="font-semibold max-sm:text-sm">{reviewer.name}</h2>
                  <div className="text-sm text-gray-500 max-sm:text-xs">{reviewer.position}</div>
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>
            
          <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="sm:w-[50%] w-[95%] mx-auto max-sm:mt-4 "
          >
              <img src={img} alt="" className="object-cover mx-auto " />
          </motion.div>
      </div>
    </div>
  );
};
