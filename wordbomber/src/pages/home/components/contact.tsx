import AutomationContactForm from "../../../components/Forms/contactForm";

export default function Contact() {
    return (
        <div id="contact-section" className="bg-gradient-to-r from-[#E4E1F5] max-sm:mt-1 via-[#FFFCF9] via-[#FFFCF9] via-[#E0F7D7] to-[#FBF7E1] py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-10 bg-colorBlueDeep rounded-xl gap-10 sm:w-[70%] w-[95%] mx-auto">
            <div className="text-center w-[80%] mx-auto max-md:pt-12">
                <h2 className="text-3xl md:text-4xl font-bold bg-white bg-clip-text text-transparent mb-4">Ready to Make SEO Your Growth Engine?</h2>
                <p className="text-lg text-gray-300 sm:w-[70%] w-[95%] mx-auto mb-6">Experience the Sirz AI Agent for yourself — no credit card required</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg">
                <AutomationContactForm />
            </div>
        </div>
        </div>

    )
}