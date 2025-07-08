import vaultImg from '../../../../public/Rectangle 25254 (1).svg'
export default function Vault() {
    return (
        <section className="px-6 py-16 sm:w-[80%] w-[90%] mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-4xl font-semibold text-gray-900 mb-4">Asset Vault</h2>
            <p className="text-xl text-gray-600 sm:w-[40%] mx-auto text-center">Keep all your brand visuals, files, and content assets organized, accessible, and beautifully managed in a single dashboard.</p>
            <div className="mt-12 sm:mt-4">
                <img src={vaultImg} alt="" className="object-cover " />
            </div>
        </section>
    )
}