// import { useEffect } from 'react';
// import './styles.css'
// import { PiToggleLeftFill, PiToggleRightFill } from 'react-icons/pi';
// import { useAppDispatch, useAppSelector } from '../app/hook';
// import { allReduxSliceInfo, setIsDarkMode } from './reduxSlice';

// interface Idata {
//     isNotVisible?: boolean | null
// }

const DarkModeToggle = () => {
    // const { isNotVisible } = props;

    // const dispatch = useAppDispatch()
    // //   const isDarkMode = useSelector((state: boolean) => state.sliceInfo.isDarkMode)
    // const { isDarkMode } = useAppSelector(allReduxSliceInfo)

    // useEffect(() => {
    //     const storedTheme = localStorage.getItem("theme");
    //     if (storedTheme) {
    //         dispatch(setIsDarkMode(storedTheme === "dark"))
    //     } else {
    //         const prefersDark = window.matchMedia("(prefers-color-sheme: dark)").matches;
    //         dispatch(setIsDarkMode(prefersDark))
    //     }
    // }, [dispatch])

    // const toggleDarkMode = () => {
    //     const newMode = !isDarkMode;
    //     dispatch(setIsDarkMode(newMode))
    //     localStorage.setItem("theme", newMode ? "dark" : "light")
    // };

    // useEffect(() => {
    //     // Update the dark mode class when the state changes
    //     if (isDarkMode) {
    //         document.documentElement.classList.add('dark');
    //         // localStorage.theme = 'dark';
    //     } else {
    //         document.documentElement.classList.remove('dark');
    //         // localStorage.theme = 'light';
    //     }
    // }, [isDarkMode]);

    return (
        // <div>
        //     {
        //         !isNotVisible && (
        //             <label
        //                 data-tooltip-target="tooltip-light"
        //                 data-tooltip-style="light"
        //                 className="switch flex items-center">
        //                 <input
        //                     className='hidden'
        //                     type="checkbox"
        //                     checked={isDarkMode}
        //                     onChange={toggleDarkMode}
        //                 />
        //                 <div className='text-[40px] '>
        //                     {!isDarkMode && <PiToggleLeftFill className=' text-zinc-600 cursor-pointer' />}
        //                     {isDarkMode && <PiToggleRightFill className=' text-zinc-200 cursor-pointer' />}
        //                 </div>
        //             </label>
        //         )
        //     }
        // </div>
        <div>hello</div>
    );
};

export default DarkModeToggle;
