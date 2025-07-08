// import PropTypes from "prop-types";

import { ReactNode } from "react";


export default function Button({ type, text, className, onClick, loading, disabled }: {
  type?: string;
  text: string | ReactNode;
  className?: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean
}) {
  return (
    <button className={` tracking-widest
    ${type === "inverted" ? " bg-[#fff] text-colorBlueDeep  rounded-sm " :
        " bg-colorBlueDeep text-colorDefaultLight  rounded-sm "}  
    ${className?.length ? ` ${className}` :
        'w-full'} flex align-center justify-center py-3 cursor-pointer text-[12px] px-8 font-normal floating-button 
    ${loading || disabled ? "opacity-25" : ""} `}
      style={{ cursor: `${loading || disabled ? "not-allowed" : ""}` }}
      onClick={onClick}>
      {loading ? "Please wait..." : text}
    </button>
  )
}
