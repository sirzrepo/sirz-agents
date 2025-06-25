import { TopKeywordsImg } from "../../../assets";
import { LuChevronRight } from "react-icons/lu";

const keyPoints = [
    {
        title: "Target the right audience",
    },
    {
        title: "Save hours of keyword research",
        description: "Build the right features for customers and the business using standardized, data-informed prioritization.",
        url: "Explore agent"
    },
    {
        title: "Build a predictable leads funnel",
    },
    {
        title: "Maximize ROI",
    },
    {
        title: "Boost Visibility",
    },
]
export default function TopKeywords() {
    return (
        <div className=" grid sm:grid-cols-2 lg:grid-cols-3 lg:w-[60%] sm:w-[80%] w-[95%] mx-auto gap-4 items-center pb-16">
            <img src={TopKeywordsImg} alt="" className="object-cover col-span-2" />
            <div className="flex col-span-1 flex-col space-y-4">
                {
                    keyPoints.map((point, index) => (
                        <div key={index} className=" items-center bg-white py-6 px-8 rounded-lg space-y-4">
                            <div className="text-lg font-semibold">{point.title}</div>
                            {
                                point.description && (
                                    <div className="text-sm font-normal leading-relaxed">{point.description}</div>
                                )
                            }
                            {
                                point.url && (
                                    <div className="text-sm flex items-center space-x-2 gap-2 text-blue-500 font-semibold">{point.url} <LuChevronRight /></div>
                                )
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}