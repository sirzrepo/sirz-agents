import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { closeModal } from "../../store/modalSlice";
// import { LuImageUp } from "react-icons/lu";

interface Idata {
    children: React.ReactNode;
    title: string;
    onclick: () => void;
    btnText: string;
    id?: string | undefined | null;
  }



export default function Modal(props: Idata) {
    const {children, title, id} = props;
    const {isOpen, modalId} = useSelector((state: RootState) => state.modal);
    const dispatch = useDispatch();

    // Function to handle closing the modal
    const handleClose = () => {
        dispatch(closeModal());
    };

    // Check if this specific modal should be shown
    const shouldShowModal = isOpen && modalId === id;
    

  return (
    <section id={id ?? undefined}>
          {shouldShowModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50"
              onClick={handleClose} // Clicking outside closes modal
            ></div>
          )}

          {/* === Modal (Slides from Right) === */}
          <div className={`fixed top-0 right-0 h-full px-2 w-[90%] sm:w-[500px] bg-white shadow-lg transition-transform duration-500 ease-in-out will-change-transform z-[60] ${shouldShowModal ? "translate-x-0" : "translate-x-full"}`} >

            <div className='bg-[#FAFAFA] px-1 py-2 flex items-center h-[10%] gap-2'>
              <h2><IoIosArrowBack className='text-2xl font-bold cursor-pointer hover:bg-gray-100 rounded' onClick={handleClose} /></h2>
              <h2 className="text-xl font-medium">{title}</h2>
            </div>

            <section className='p-6 h-[80%] overflow-y-scroll hideScrollBar'>
              {children}
            </section>

            <div className='flex justify-end items-center h-[10%] gap-2 bg-[#FAFAFA] p-4'>
              <button
                onClick={handleClose} 
                className="text-md w-fit bg-white text-black px-4 py-2 rounded-sm hover:bg-slate-100 border border-colorBlueDeep transition"
              >
                Cancel
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  props.onclick();
                }}
                type='button'
                className="text-md w-fit bg-colorBlueDeep text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition"
              >
                {props.btnText}
              </button>
            </div>

          </div>
    </section>
  )
}