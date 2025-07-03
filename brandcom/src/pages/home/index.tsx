import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import IdentityForm from './components/identityForm';
import BrandAssetsForm from './components/generateForm';
import { addProjectActive } from '@/store/addProjectSlice';
import { BrandAssets } from '@/types';
import { BASE_URL } from '@/utils';
import axios from 'axios';
import { brandRegistered } from '@/store/brandSlice';
// import { Agent } from '../agent';

export default function Home() {
    const [isOpen] = useState(false);
   const {userData} = useSelector((state: RootState) => state.user);
    const {isBrandRegistered} = useSelector((state: RootState) => state.brand);
    const {isAddProjectPageActive} = useSelector((state: RootState) => state.addProject);
    const [brandAssets, setBrandAssets] = useState<BrandAssets | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    
    const hasImages = (brandAssets?.assets?.length ?? 0) > 0;

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${BASE_URL}/api/brand-data/company-assets/${userData?.id}`)
        .then((res) => {
            setBrandAssets(res.data);
            console.log('database response for brand assets', res.data);
            if (res.data.companyData.companyName) {
                dispatch(brandRegistered());
            }
        })
        .catch((err) => {
            console.error('Error fetching brand assets:', err);
            setBrandAssets(null);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [userData?.id, dispatch])
        

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


    return (
        <section className=' sm:w-[95%] w-full m-auto'>
            <div className='mb-10'>
               {
                !isAddProjectPageActive && (
                    <div className='mb-6 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold mb-2 capitalize'>Hello 👋, {userData?.firstName} {userData?.lastName}</h1>
                        <p className='text-lg mb-8'>Keep track of your project, tasks and documents here.</p>
                    </div>

                   
                    <div className='mb-6'>

                        <button 
                            onClick={() => dispatch(addProjectActive())}
                            className='flex items-center gap-2 lg:h-20 lg:w-20 h-14 w-14 justify-center bg-[#7e22ce] text-white  rounded-full hover:bg-blue-600 transition-colors'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            {/* <span className='hidden lg:block'>Create Your Brand</span> */}
                        </button>
                    </div>
               </div>
                )
               }
                
                <div className='mb-10'>

                    {isAddProjectPageActive && !isBrandRegistered && (
                        <IdentityForm />
                    )}

                    {isAddProjectPageActive && isBrandRegistered && (
                        <BrandAssetsForm />
                        // <Agent />
                    )}
                    
                    {!isAddProjectPageActive && (
                        <>
                        {isLoading ? (
                            <div className='flex justify-center items-center py-20'>
                                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
                            </div>
                        ) : !hasImages ? (
                            <div className='text-center py-12 bg-gray-50 rounded-lg'>
                                <p className='text-gray-500 mb-4'>No Projects to display</p>
                                <button 
                                    onClick={() => dispatch(addProjectActive())}
                                    className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                                >
                                    Create First Project
                                </button>
                            </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                            {brandAssets?.assets?.map((asset, index) => (
                                <Link 
                                    key={asset._id} 
                                    to={`/assets/${asset._id}`}
                                    className='block relative group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-blue-500'
                                >
                                    <img 
                                        src={asset.website_image || asset.logo_image} 
                                        alt={`Asset ${index + 1}`} 
                                        className='w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center'>
                                        <span className='text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium'>
                                            View Details
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                        </>
                    )}
                </div>
            </div>

        </section>
    );
};