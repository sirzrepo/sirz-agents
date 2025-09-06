import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SirzLogo } from "../../assets";
import Loader from "../../features/loader";
import { BASE_URL } from "../../utils";



const AutomationContactForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        website: "",
        challenge: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            website: formData.website,
            challenge: formData.challenge,
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

    return (
        <>
            <form onSubmit={handleSubmit} action="">
                <div className=" grid sm:grid-colws-2 gap-5 py-8     
                px-6 border-b-[6px] border-s-[5px] border-e-[7px] border-colorGreen rounded-xl bg-white dark:bg-colorDefaultDark">
                    <header className="relative">
                        <div className=" sm:w-[70%]">
                            <h4 className=" font-bold">Let's get started</h4>
                            <p className="  max-sm:text-justify pt-1 sm:text-[13px] text-[13px]">
                            Fill out the form below to receive your personalized Strategy PDF . It takes less than 2 minutes!
                            </p>
                        </div>
                        <div className="absolute top-3 right-0"><img src={SirzLogo} alt="" className=" h-3" /></div>
                    </header>

                    <section className="grid sm:grid-cols-2 gap-5">
                        <div className="relative pt-2">
                            <input
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
                            <input
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
                            <input
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
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className={`w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary`}
                                placeholder={'input url'}
                            />
                            <div className=" absolute top-0 left-3 bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">{'Shopify Store URL'}</div>
                        </div>
                    </section>
                    <div className="relative pt-2">
                            <input
                                type="text"
                                name="challenge"
                                value={formData.challenge}
                                onChange={handleChange}
                                className={`w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary`}
                                placeholder={'Type here'}
                            />
                            <div className=" absolute top-0 left-3 whitespace-nowrap bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">{`What's Your Biggest Store Challenge?`}</div>
                        </div>
                </div>

                <section className="mt-6">
                    {
                        isLoading ? (
                            <Loader />
                        ) : (
                            <div className=" sm:w-[40%] w-[80%] max-sm:m-auto flex justify-end">
                                <button
                                    type="submit"
                                    className={`tracking-widest bg-white text-black rounded-full w-full max-sm:mt-5
                                'w-full flex align-center justify-center py-4 cursor-pointer text-sm px-8 font-medium floating-button`}
                                >
                                    Claim my strategy PDF
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

