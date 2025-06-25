import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SirzLogo } from "../../assets";
import Loader from "../../features/loader";
import { BASE_URL } from "../../utils";
import Input from "../common/ui/Input";



const AutomationContactForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        website: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.firstName.trim()) {
            toast.error("Please enter your first name");
            return;
        }
        
        if (!formData.email.trim()) {
            toast.error("Please enter your email address");
            return;
        }
        
        setIsLoading(true);

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            website: formData.website,
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/automations`, payload);
            // const response = await axios.post(`http://localhost:5000/api/automations`, payload);
            console.log("response", response);
            toast.success("Message sent successfully!");
            setIsLoading(false);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error sending message. Please try again.");
            setIsLoading(false);
        }
    };

    // Check if required fields are filled
    const isFormValid = formData.firstName.trim() !== '' && formData.lastName.trim() !== '' && formData.email.trim() !== '';

    return (
        <>
            <form onSubmit={handleSubmit} action="" className="">
                <div className=" py-8     
                px-6">
                    <header className="relative pt-5">
                        <div className=" sm:w-[70%]">
                            <h4 className=" text-2xl font-bold">Let's get started</h4>
                            <p className="  max-sm:text-justify py-4 text-sm">
                            Fill out the form below to receive your personalized Strategy PDF . It takes less than 2 minutes!
                            </p>
                        </div>
                        <div className="absolute top-0 right-0"><img src={SirzLogo} alt="" className=" w-16 object-cover" /></div>
                    </header>

                    <section className="grid md:grid-cols-2 gap-5">
                        <div className="relative pt-2">
                            <Input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary`}
                                placeholder={'first name'}
                            />
                            <div className=" absolute top-0 left-3 bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">{'First Name'}</div>
                        </div>

                        <div className="relative pt-2">
                            <Input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary`}
                                placeholder={'last name'}
                            />
                            <div className=" absolute top-0 left-3 bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">{'Last Name'}</div>
                        </div>

                        <div className="relative pt-2">
                            <Input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary`}
                                placeholder={'email'}
                            />
                            <div className=" absolute top-0 left-3 bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">{'Email Address'}</div>
                        </div>

                        <div className="relative pt-2">
                            <Input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className={`w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary`}
                                placeholder={'website'}
                            />
                            <div className=" absolute top-0 left-3 bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">{'Website (optional)'}</div>
                        </div>
                    </section>
                </div>

                <section className="my-8">
                    {
                        isLoading ? (
                            <Loader />
                        ) : (
                            <div className=" sm:w-[60%] w-[80%] mx-auto flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!isFormValid || isLoading}
                                    className={`tracking-widest text-white rounded-full w-full max-sm:mt-5 flex align-center justify-center py-4 text-sm px-8 font-medium floating-button ${
                                        isFormValid && !isLoading 
                                            ? 'bg-colorBlueDeep hover:bg-blue-700 cursor-pointer' 
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isLoading ? 'Sending...' : 'Contact us'}
                                </button>
                            </div>
                        )
                    }
                </section>
            </form>
        </>
    );
};

export default AutomationContactForm;

