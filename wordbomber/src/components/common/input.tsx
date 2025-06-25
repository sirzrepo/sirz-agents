// import { IInputProps } from "../../constants/types";

import { IInputProps } from "../../types"

export default function Input(props: IInputProps) {
    const { onChange, name, type, placeholder, value, title } = props;
    
    if (type === 'file') {
        return (
            <div className="w-full">
                <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-1'>
                    {title}
                </label>
                <label 
                    htmlFor={name}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                            {placeholder || 'SVG, PNG, JPG or GIF (MAX. 5MB)'}
                        </p>
                    </div>
                    <input 
                        id={name} 
                        name={name}
                        type="file" 
                        className="hidden" 
                        onChange={onChange}
                        accept="image/*"
                        multiple
                    />
                </label>
            </div>
        );
    }

    return (
        <div>
            <label htmlFor={name} className='flex justify-between mb-3 mt-4 items-center'>
                <h2 className='font-normal'>{title}</h2>
            </label>
            <input
                type={type || 'text'}
                name={name}
                placeholder={placeholder}
                className="w-full py-4 pt-2 px-2 border-[1.4px] placeholder:text-xs rounded-md mb-4"
                onChange={onChange}
                value={value}
            />
        </div>
    )
}