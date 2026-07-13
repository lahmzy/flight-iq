interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Calculate which pages to show
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }

    if (page >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, '...', page - 1, page, page + 1, '...', totalPages]
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto py-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg px-3 py-2 transition-all disabled:opacity-30 whitespace-nowrap"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "#94A3B8",
          fontSize: "0.875rem",
        }}
      >
        &larr; Prev
      </button>
      {visiblePages.map((p, index) => {
        if (p === '...') {
          return (
            <span key={`ellipsis-${index}`} className="mono px-2 text-[#475569]">
              ...
            </span>
          )
        }
        
        return (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className="mono h-10 w-10 flex-shrink-0 rounded-lg transition-all"
            style={{
              background:
                p === page
                  ? "rgba(59,130,246,0.2)"
                  : "rgba(255,255,255,0.03)",
              border:
                p === page
                  ? "1px solid rgba(59,130,246,0.4)"
                  : "1px solid rgba(255,255,255,0.05)",
              color: p === page ? "#3B82F6" : "#475569",
              fontSize: "0.8rem",
              fontWeight: p === page ? 700 : 400,
            }}
          >
            {p}
          </button>
        )
      })}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg px-3 py-2 transition-all disabled:opacity-30 whitespace-nowrap"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "#94A3B8",
          fontSize: "0.875rem",
        }}
      >
        Next &rarr;
      </button>
    </div>
  )
}
