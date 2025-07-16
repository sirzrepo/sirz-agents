import ImgOne from "../../../../public/Frame 1618873309.svg"
import ImgTwo from "../../../../public/Frame 1618873312.svg"
import ImgThree from "../../../../public/Frame 1618873313.svg"
import ImgFour from "../../../../public/Frame1618873309.svg"
import ImgFive from "../../../../public/Frame 1618873312 (1).svg"

const arrOne = [
    ImgOne,
    ImgTwo,
    ImgThree,
]

export default function Why() {
    return (
        <div className="bg-[white py-28 sm:w-[80%] w-[95%] mx-auto">
           <div className=" flex flex-col pb-20 items-center text-center justify-center">
                <h2 className="text-5xl font-medium pb-8">Why <span className="text-[#CBA461]">Choose</span> us</h2>
                <p className="text-xl md:w-[50%] w-[95%] text-center">Explore our most sought-after designs, hand-selected for their craftsmanship, character, and charm</p>
            </div>
            <div className="">  
                <div className="grid grid-cols-3 lg:gap-10 gap-2">
                    {arrOne.map((item, index) => (
                        <div key={index}>
                            <img src={item} alt="" className="w-full" />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-3 lg:gap-10 gap-2 lg:mt-10 mt-2">
                        <div className="col-span-2">
                            <img src={ImgFour} alt="" className="w-full" />
                        </div>
                        <div>
                            <img src={ImgFive} alt="" className="w-full" />
                        </div>
                </div>
            </div>
        </div>
    )
}