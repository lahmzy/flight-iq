"use client"

import { useState } from "react"
import { MessageSquare, Loader2, Send } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"

import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { useAuth } from "@/providers/AuthContext"
import { useGetRequest } from "@/hooks/useGetRequest"
import { useApiMutation } from "@/hooks/useApiMutation"
import { useToast } from "@/hooks/use-toast"
import type { BackendApiResponse } from "@/types/api"

interface Comment {
  id: string
  incidentId: string
  authorId: string
  text: string
  createdAt: string
  updatedAt: string
  author?: {
    id: string
    first_name?: string | null
    last_name?: string | null
  } | null
}

interface CommentsSectionProps {
  incidentId: string
}

function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay === 1) return "yesterday"
  return `${diffDay}d ago`
}

export function CommentsSection({ incidentId }: CommentsSectionProps) {
  const { user, isAuthenticated, loginWithGoogle } = useAuth()
  const { showError } = useToast()
  const [newComment, setNewComment] = useState("")

  // Fetch comments
  const { data, isLoading } = useGetRequest<BackendApiResponse<Comment[]>>({
    url: `/incidents/${incidentId}/comments`,
    queryKey: ["comments", incidentId],
  })

  const commentsList = data?.data || []

  // Post comment mutation
  const postCommentMutation = useApiMutation<Comment, { text: string }>({
    url: `/incidents/${incidentId}/comments`,
    method: "POST",
    successMessage: "Comment posted successfully",
    invalidateQueries: [["comments", incidentId]],
    onSuccess: () => {
      setNewComment("")
    },
  })

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    postCommentMutation.mutate({ text: newComment })
  }

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
          title={`Discussion (${isLoading ? "..." : commentsList.length})`}
        />
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <Loader2 className="animate-spin text-violet-500" size={24} />
        </div>
      ) : commentsList.length === 0 ? (
        <div className="py-8 text-center">
          <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
            No perspectives shared yet. Be the first to add a comment!
          </p>
        </div>
      ) : (
        <div className="mb-6 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {commentsList.map((c) => {
            const authorName = c.author
              ? `${c.author.first_name || ""} ${c.author.last_name || ""}`.trim() || "Anonymous"
              : "Anonymous"
            const initial = authorName.charAt(0).toUpperCase() || "A"

            return (
              <div
                key={c.id}
                className="rounded-xl p-4 transition-all"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="mb-2 flex items-center gap-3">
                  <div
                    className="mono flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                      color: "#fff",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {initial}
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#E2E8F0",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {authorName}
                    </p>
                    <p
                      className="mono"
                      style={{ color: "#475569", fontSize: "0.65rem" }}
                    >
                      {formatRelativeTime(c.createdAt)}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {c.text}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Input Section */}
      <div
        className="pt-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {isAuthenticated ? (
          <form onSubmit={handlePost}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your perspective on this incident (professional context appreciated)…"
              rows={3}
              className="mb-3 w-full resize-none rounded-xl px-4 py-3 transition-all focus:border-violet-500/50"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(59,130,246,0.12)",
                color: "#E2E8F0",
                fontSize: "0.875rem",
                outline: "none",
              }}
              disabled={postCommentMutation.isPending}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || postCommentMutation.isPending}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:hover:shadow-none"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                color: "#fff",
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {postCommentMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={15} />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Post Comment
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <p
              className="mb-4"
              style={{
                color: "#64748B",
                fontSize: "0.875rem",
              }}
            >
              Sign in with Google to contribute your perspective to this investigation.
            </p>
            <div className="relative z-10 transition-transform hover:scale-102">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    await loginWithGoogle(credentialResponse.credential)
                  }
                }}
                onError={() => {
                  showError("Google Authentication failed. Please try again.")
                }}
              />
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
