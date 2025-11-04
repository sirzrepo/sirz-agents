// 'use client';

// import { useRef } from 'react';
// import { useState } from 'react';

// export default function OtpInput() {
//   const [otp, setOtp] = useState(Array(6).fill(''));
//   const inputsRef = useRef<HTMLInputElement[]>([]);

//   const handleChange = (value: string, index: number) => {
//     if (!/^\d?$/.test(value)) return; // Only allow digits
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Move to next input if not last
//     if (value && index < 5) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       const prev = inputsRef.current[index - 1];
//       prev?.focus();
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent) => {
//     const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
//     if (pasted.length) {
//       const newOtp = Array(6).fill('');
//       for (let i = 0; i < pasted.length; i++) {
//         newOtp[i] = pasted[i];
//         if (inputsRef.current[i]) {
//           inputsRef.current[i]!.value = pasted[i];
//         }
//       }
//       setOtp(newOtp);
//       inputsRef.current[pasted.length - 1]?.focus();
//     }
//     e.preventDefault();
//   };

//   return (
//     <div onPaste={handlePaste} className="flex gap-2 justify-center">
//       {otp.map((digit, i) => (
//         <input
//           key={i}
//           type="text"
//           inputMode="numeric"
//           maxLength={1}
//           value={digit}
//           onChange={(e) => handleChange(e.target.value, i)}
//           onKeyDown={(e) => handleKeyDown(e, i)}
//           ref={(el) => {
//             inputsRef.current[i] = el!;
//           }}
//           className="w-10 h-12 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
//         />
//       ))}
//     </div>
//   );
// }


'use client';

import { useRef, useState } from 'react';

interface OtpInputProps {
  length?: number;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
}

export default function OtpInput({
  length = 6,
  onChange,
  name,
  className = '',
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange?.(newOtp.join(''));

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted.length) {
      const newOtp = Array(length).fill('');
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
        if (inputsRef.current[i]) {
          inputsRef.current[i]!.value = pasted[i];
        }
      }
      setOtp(newOtp);
      onChange?.(newOtp.join(''));
      inputsRef.current[Math.min(pasted.length, length) - 1]?.focus();
    }
  };

  return (
    <div onPaste={handlePaste} className={`flex gap-2 justify-evenly ${className}`}>
      {otp.map((digit, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          name={name}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          ref={(el) => {
            inputsRef.current[i] = el!;
          }}
          className="w-14 h-14 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      ))}
    </div>
  );
}


