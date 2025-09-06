// import { useState } from "react";
import { LuImageUp } from "react-icons/lu";
// import { BsCloudUpload } from "react-icons/bs";
// import { LuImageUp } from "react-icons/lu";


export default function CourseForm() {
    return (
        <div>
            <form className="mt-4">
                <div className='mb-7'>
                    <label htmlFor="" className='flex justify-between items-center'>
                        <h2 className='font-bold'>Course</h2>
                        <p className='text-sm'>Required</p>
                    </label>
                    <div className='border-[1.4px] px-3 py-2'>
                        <select name="" id="" className='border-0 outline-none w-full'>
                            <option value="">Slect Service</option>
                            <option value="">Option 1</option>
                        </select>
                    </div>
                </div>

                <div className='mb-4'>
                    <label htmlFor="" className='font-bold'>
                        Project Image
                    </label>
                    <div className='flex items-center gap-3 px-3 border-[1.4px] py-2 rounded-md w-full'>
                        <LuImageUp className='text-2xl font-bold' />
                        <input
                            type="text"
                            placeholder="Type here.."
                            className="border-none outline-none w-full"
                        />
                    </div>
                </div>

                <div className='mb-7'>
                    <label htmlFor="" className='flex justify-between items-center'>
                        <h2 className='font-bold'>Project</h2>
                        <p className='text-sm'>Required</p>
                    </label>
                    <textarea name="" id=""
                        placeholder="Type here.."
                        className="w-full p-2 border-[1.4px] rounded-md mb-4"></textarea>
                </div>

            </form>
        </div>
    )
}