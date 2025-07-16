// import { IInputProps } from "../../constants/types";

import { IInputProps } from "../../types"

export default function Input(props: IInputProps) {
    const { onChange, name, type, placeholder, value, required, title } = props
    return (

        <div>
                    <label htmlFor="" className='flex justify-between items-center'>
                        <h2 className='font-bold'>{title}</h2>
                        {required && <p className='text-sm'>Required</p>}
                    </label>
                    <input
                        type={type || 'text'}
                        name={name}
                        placeholder={placeholder}
                        className="w-full p-2 border-[1.4px] rounded-md mb-4"
                        onChange={onChange}
                        value={value}
                    />
                </div>
    )
}