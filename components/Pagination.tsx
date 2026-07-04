"use client";

import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages);
  }
  if (currentPage >= totalPages - 2) {
    startPage = Math.max(1, totalPages - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-sky-500 hover:text-black hover:border-sky-500 transition-all active:scale-95"
      >
        <HiChevronLeft size={20} />
      </button>

      <div className="flex gap-2">
        {startPage > 1 && (
          <>
            <PageButton page={1} currentPage={currentPage} onClick={onPageChange} />
            {startPage > 2 && <span className="text-zinc-500 px-2 py-3">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <PageButton key={page} page={page} currentPage={currentPage} onClick={onPageChange} />
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-zinc-500 px-2 py-3">...</span>}
            <PageButton page={totalPages} currentPage={currentPage} onClick={onPageChange} />
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-sky-500 hover:text-black hover:border-sky-500 transition-all active:scale-95"
      >
        <HiChevronRight size={20} />
      </button>
    </div>
  );
};

const PageButton = ({ page, currentPage, onClick }: { page: number, currentPage: number, onClick: (p: number) => void }) => {
  const isActive = page === currentPage;

  return (
    <button
      onClick={() => onClick(page)}
      className={`relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl text-xs font-black transition-all ${
        isActive 
          ? "text-black" 
          : "text-zinc-400 bg-white/5 border border-white/10 hover:text-white hover:border-white/30"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="pagination-active"
          className="absolute inset-0 bg-sky-500 rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.4)]"
          style={{ zIndex: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{page}</span>
    </button>
  );
};

export default Pagination;
