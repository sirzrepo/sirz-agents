
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="sm:flex justify-between items-center mt-6 grid grid-cols-1">
      {/* Pagination Controls */}
      <section>
        <div className="flex items-center gap-2 justify-center mt-3 sm:justify-normal sm:mt-0 border border-black rounded-lg px-4 py-1">
          <button
            className={`p-1 text-black text-xl font-bold ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </button>
          <span className="text-lg font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            className={`p-1 text-black text-xl font-bold ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* Items per page dropdown */}
      <section className="flex gap-2 items-center justify-center mt-3 sm:justify-normal sm:mt-0">
        <label htmlFor="itemsPerPage">Show:</label>
        <select id="itemsPerPage" className="border w-16 py-1 px-2 rounded">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </section>
    </div>
  );
};

export default Pagination;
