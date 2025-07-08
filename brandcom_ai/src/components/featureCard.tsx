const FeatureCard = ({ icon, title, description }: any) => {

  return (
    <div className={`bg-white p-6 border-r-[2px] border-b-[2px] border-black shadow-md flex flex-col justify-between`}>
      {/* Icon (using emoji for demonstration, replace with SVG/Icon component) */}
      <div className=" inline-flex items-center justify-center mb-4 self-start">
        <img src={icon} alt="" />{/* Use a proper icon component here */}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 my-4">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-base leading-relaxed mb-4">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;