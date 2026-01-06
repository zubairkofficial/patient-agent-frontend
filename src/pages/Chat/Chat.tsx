import { useState } from "react"
import Message from "@/components/Message/Message"
import { Button } from "@/components/ui/Button/Button"
import { cn } from "@/lib/utils"

type ChatMessage = {
  id: string
  isBot: boolean
  message: string
  avatarUrl?: string
}

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      isBot: true,
      message: "Hello! 👋\n\nI'm your **Patient Agent** assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isSending) return

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      isBot: false,
      message: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsSending(true)

    // Simulate bot reply – replace with real API call
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `${Date.now()}-bot`,
        isBot: true,
        message: `You said:\n\n> ${trimmed}\n\nThis is a **demo** response. Hook this up to your backend/LLM to make it smart.`,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsSending(false)
    }, 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-70px)] w-full max-w-5xl mx-auto py-4 px-4 md:px-6">
      <div className="flex flex-col w-full rounded-2xl border bg-card shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-muted/60">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground">
              Patient Agent Chat
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Ask questions, summarize records, or get patient insights.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Assistant online
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-4 space-y-1 bg-background">
          {messages.map((m) => (
            <Message
              key={m.id}
              isBot={m.isBot}
              message={m.message}
              avatarUrl={m.avatarUrl}
            />
          ))}
        </div>

        {/* Input area */}
        <div className="border-t bg-card/80 backdrop-blur px-3 md:px-4 py-3">
          <div className="flex items-end gap-2 md:gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className={cn(
                "flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                "placeholder:text-muted-foreground/70"
              )}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            />
            <Button
              type="primary"
              size="large"
              text={isSending ? "Sending..." : "Send"}
              disabled={isSending || !input.trim()}
              onClick={handleSend}
              className="whitespace-nowrap"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat


