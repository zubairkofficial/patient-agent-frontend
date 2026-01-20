import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Message from "@/components/Message/Message"
import { Input } from "@/components/ui/Input/Input"
import { Activity, ArrowLeft, Send, Bot } from "lucide-react"
import type { ChatMessage } from "@/types/Message.types"

const Chat = () => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      isBot: true,
      message:
        "Hi there! I'm your wellness guide. How are you feeling about your weekly goals today?",
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

    // Focus input immediately after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)

    // Simulated bot reply – replace with API call later.
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `${Date.now()}-bot`,
        isBot: true,
        message:
          "Thanks for sharing. Let's take this one step at a time and focus on what you can control this week.",
      }
      setMessages((prev) => [...prev, botMessage])
      setIsSending(false)
      
      // Focus input after bot response
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }, 700)
  }

  // Auto-focus input on component mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed inset-0 w-full bg-background flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background">
        <div className="max-w-8xl mx-auto h-[64px] px-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card text-foreground shadow-sm hover:bg-muted transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-md">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Wellness Guide
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 w-full overflow-hidden">
        <div className="max-w-8xl mx-auto h-full flex flex-col">
          {/* Messages */}
            <div className="flex-1 px-4 pt-6 pb-4 overflow-y-auto flex flex-col items-start">
              <div className="w-full flex justify-start mb-6 pl-2 sm:pl-4">
                {messages.length > 0 && (
                  <div className="max-w-3xl w-full flex flex-col items-start">
                    {/* Welcome bot message with icon */}
                    <div className="w-full flex justify-start">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-md">
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="rounded-2xl bg-muted px-8 py-6 shadow-sm text-base text-foreground">
                          {messages[0].message}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            {/* Remaining messages in regular chat layout */}
            <div className="w-full space-y-2 px-4">
              {messages.slice(1).map((m) => (
                <Message
                  key={m.id}
                  isBot={m.isBot}
                  message={m.message}
                />
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t bg-background py-4 px-4">
            <div className="max-w-6xl mx-auto flex items-center gap-3">
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
                className="bg-muted/60"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Chat


