import signatureImg from "../../../../public/Frame 1618873304.svg"
export default function Signature() {
    return (
        <div className="bg-[#F8F6F5] py-16">
           <div className=" flex flex-col items-center text-center justify-center">
                <h2 className="sm:text-5xl text-3xl font-medium">Signature Collections</h2>
                <p className="text-xl mt-3">Explore our most sought-after designs, hand-selected for their craftsmanship, character, and charm</p>
            </div>
            <div className="rounded-[2.7em] lg:mt-20 mt-10 lg:grid lg:grid-cols-2 lg:items-end gap-10 lg:w-[80%] w-[90%] mx-auto">
                <div className="">
                    <h3 className="text-[8em] font-medium">1</h3>
                    <h2 className="text-5xl font-medium">Serene Living Collection:</h2>
                    <p className="md:text-xl text-lg my-5">Organic textures. Calming tones. Inspired by stillness.Wrap your home in tranquility with pieces that breathe softness into every space. From textured fabrics to muted hues, this collection evokes the quiet luxury of minimal living—where comfort and clarity meet.
                    Perfect for: mindful living rooms, quiet corners, and airy bedrooms.</p>
                </div>
                <img src={signatureImg} alt="" className="w-full" />
            </div>
        </div>
    )
}