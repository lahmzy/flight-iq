interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg px-4 py-2 transition-all disabled:opacity-30"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "#94A3B8",
          fontSize: "0.875rem",
        }}
      >
        &larr; Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="mono h-10 w-10 rounded-lg transition-all"
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
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg px-4 py-2 transition-all disabled:opacity-30"
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
