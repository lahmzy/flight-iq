"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"

const comments = [
  {
    author: "Capt. R. Martinez",
    role: "Commercial Pilot (B737 Type-Rated)",
    time: "3 days ago",
    text: "The crew response was textbook. Shutting down the engine within 2 minutes of the warning light and immediately declaring is exactly what the procedures demand. The KDEN controllers also handled this perfectly.",
  },
  {
    author: "Dr. Helena Krause",
    role: "Aerospace Engineer, Turbomachinery",
    time: "2 days ago",
    text: "The extended inspection interval for this blade PN warrants close scrutiny. HCF crack initiation at a coating delamination site is well-documented in literature. The real question is whether FPI at that interval is sufficient for this failure mode.",
  },
  {
    author: "M. Okonkwo",
    role: "Aviation Safety Researcher",
    time: "1 day ago",
    text: "Another data point for the ongoing conversation around STC inspection interval extensions. This should trigger fleet-wide review of blade sets with similar cycle counts under the amended maintenance program.",
  },
]

export function CommentsSection() {
  const [newComment, setNewComment] = useState("")

  return (
    <GlassCard hover={false}>
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <MessageSquare size={15} style={{ color: "#8B5CF6" }} />
        </div>
        <SectionLabel
          eyebrow=""
          title={`Expert Discussion (${comments.length})`}
        />
      </div>

      <div className="mb-6 space-y-5">
        {comments.map((c, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div
                className="mono flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  color: "#fff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                {c.author.charAt(0)}
              </div>
              <div>
                <p
                  style={{
                    color: "#E2E8F0",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {c.author}
                </p>
                <p
                  className="mono"
                  style={{ color: "#475569", fontSize: "0.65rem" }}
                >
                  {c.role} · {c.time}
                </p>
              </div>
            </div>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.875rem",
                lineHeight: 1.7,
              }}
            >
              {c.text}
            </p>
          </div>
        ))}
      </div>

      <div
        className="pt-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your perspective (professional context appreciated)…"
          rows={3}
          className="mb-3 w-full resize-none rounded-xl px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(59,130,246,0.12)",
            color: "#E2E8F0",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
        <button
          className="rounded-lg px-5 py-2.5 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          style={{
            background: "#3B82F6",
            color: "#fff",
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          Post Comment
        </button>
      </div>
    </GlassCard>
  )
}
