import { IInputProps } from "../../types";

export default function Input(props: IInputProps) {
    const { 
        onChange, 
        name, 
        type, 
        placeholder, 
        value, 
        required, 
        title, 
        className = '',
        icon,
        error
    } = props;

    return (
        <div className={className}>
            <label htmlFor={name} className='flex justify-between items-center mb-1'>
                <h2 className='font-bold'>{title}</h2>
                {required && <p className='text-sm'>Required</p>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type || 'text'}
                    name={name}
                    placeholder={placeholder}
                    className={`w-full p-2 border-[1.5px] rounded-md ${icon ? 'pl-10' : ''} ${
                        error ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    onChange={onChange}
                    value={value}
                    id={name}
                />
            </div>
            {error && typeof error === 'string' && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}