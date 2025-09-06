import { useNavigate } from "react-router-dom";
import { DefaultProfileImg, SirzLogo } from "../../assets";
import { IoIosArrowDown, IoIosArrowUp, IoIosArrowBack } from "react-icons/io";
import { MdNotifications, MdLightbulbOutline } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
// import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaUser, FaBook, FaSignOutAlt } from "react-icons/fa";
// import { ProjectIcon } from '../../assets';
// import { BsCloudUpload } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

// Menu item interface
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

export default function NavBar() {
    // const [ isProfileOpen, setProfileOpen ] = useState(false);
    const navigate = useNavigate();
    const { logout, isAuthenticated } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    // const [showForm, setShowForm] = useState(false);
    //   const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const {userData} = useSelector((state: RootState) => state.user);

    // Generate menu items based on auth state
    const getMenuItems = (): MenuItem[] => [
      {
        icon: <FaUser className="text-gray-500" />,
        label: "My Profile",
        onClick: () => {
          navigate("/profile");
          setIsProfileOpen(false);
        }
      },
      {
        icon: <FaBook className="text-gray-500" />,
        label: "Introductory Courses",
        onClick: () => {
          navigate("/courses");
          setIsProfileOpen(false);
        }
      },
      ...(isAuthenticated ? [
        {
          icon: <FaSignOutAlt />,
          label: "Log Out",
          onClick: logout,
          className: "text-red-500 hover:bg-red-100"
        }
      ] : [])
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Disable scrolling when dropdown is open
    useEffect(() => {
        if (isProfileOpen) {
            document.body.style.overflow = "hidden"; // Disable scroll
        } else {
            document.body.style.overflow = "auto"; // Enable scroll
        }

        return () => {
            document.body.style.overflow = "auto"; // Reset scroll on unmount
        };
    }, [isProfileOpen]);

    // Disable scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Disable scroll
        } else {
            document.body.style.overflow = "auto"; // Enable scroll
        }

        return () => {
            document.body.style.overflow = "auto"; // Reset scroll on unmount
        };
    }, [isOpen]);

    // Menu items for dropdown
    const menuItems = getMenuItems();

    return (
        <section className="pb-[70px] bg-[#FAFAFA]">
            <div className={`fixed w-full z-40 bg-colorDefaultLight dark:bg-colorDark shadow-md`}>
                <div className={` text-black sm:w-[95%] w-[90%] m-auto flex justify-between transition-all duration-300 h-[70px] items-center `}>
                    <div onClick={() => navigate("/")} className={`cursor-pointer sm:w-20 w-12  transition-all duration-300 `}>
                        <img
                            src={SirzLogo}
                            alt=""
                            className={` w-full rounded-full`}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <section className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-300 flex justify-center items-center cursor-pointer" onClick={() => setIsOpen(true)}>
                                <h2 className="text-2xl"> <MdNotifications /> </h2>
                            </div>
                            <div>
                                <p></p>
                            </div>
                        </section>

                        {/* === Black Transparent Overlay (Full Screen Cover) === */}
                        {isOpen && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50"
                                onClick={() => setIsOpen(false)} // Clicking outside closes modal
                            ></div>
                        )}

                        {/* === Modal (Slides from Right) === */}
                        <div className={`fixed top-0 right-0 h-full w-[90%] sm:w-[500px] bg-white shadow-lg transition-transform duration-300 z-[60] ovedrflow-hidden ${isOpen ? "translate-x-0" : "translate-x-full"
                            }`} >

                            <div className='bg-[#FAFAFA] px-1 py-2 flex items-center h-[10%] gap-2'>
                                <h2><IoIosArrowBack className='text-2xl font-bold cursor-pointer hover:bg-gray-100 rounded' onClick={() => setIsOpen(false)} /></h2>
                                <h2 className="text-xl font-medium">Notification</h2>
                            </div>

                            <section className='p-4 h-[90%]  overflow-y-scroll hideScrollBar'>
                                <div className="bg-[#EFF6FF] border border-[#DBEAFE] flex p-3 gap-2 items-center mb-4">
                                    <MdLightbulbOutline className="text-3xl text-blue-500" />
                                    <p>{`You have 12 new notifications and 3 unread messages`}</p>
                                </div>

                                <div className="sm:flex gap-3 items-center grid grid-cols-1">
                                    <div className='px-4 py-2 flex gap-2 items-center rounded-sm border-2 w-fit max-w-full border-[#ceced0]'>
                                        <IoSearch className='text-xl text-[#ceced0]' />
                                        <input type="text" name="" id="" placeholder='Search...' className='border-0 outline-none bg-none' />
                                    </div>
                                    <div className="border-2 px-3 py-2 w-fit rounded-sm border-[#ceced0] text-[#9CA3AF]">
                                        <select name="" id="" className='border-0 w-20'>
                                            <option value="">Status</option>
                                        </select>
                                    </div>
                                </div>
                            </section>


                        </div>


                        {/* <section className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-300">
                            <img src="" alt="" className="w-full h-full rounded-full"/>
                        </div>
                        <h2 className="text-2xl">{isProfileOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</h2>
                    </section> */}
                        <div className="relative" ref={dropdownRef}>
                            {/* Profile Button */}
                            <section
                                className="flex items-center gap-3 cursor-pointer z-20 relative"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="w-10 h-10 rounded-full border border-green-500 bg-slate-300 overflow-hidden">
                                    <img src={ userData?.image ? userData.image : DefaultProfileImg} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-2xl">
                                    {isProfileOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                </h2>
                            </section>


                            {/* Transparent Overlay */}
                            {isProfileOpen && (
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                            )}

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 sm:mr-[-0.5cm] w-64 bg-white shadow-lg rounded-lg p-4 z-50">
                                    {/* Profile Info */}
                                    <div className="flex items-center gap-3 border-b pb-3">
                                        <div className="w-12 h-12 rounded-full border border-green-500 bg-slate-300 overflow-hidden">
                                            <img src={ userData?.image ? userData.image : DefaultProfileImg} alt="Profile" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">{userData?.firstName} {userData?.lastName}</h3>
                                            <p className="text-sm text-gray-500">{userData?.email}</p>
                                        </div>
                                    </div>

                                    {/* Dropdown Links */}
                                    <ul className="mt-3 space-y-2">
                                        {menuItems.map((item, index) => (
                                            <li 
                                                key={index}
                                                className={`flex items-center gap-5 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer ${item.className || ''}`}
                                                onClick={item.onClick}
                                            >
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

