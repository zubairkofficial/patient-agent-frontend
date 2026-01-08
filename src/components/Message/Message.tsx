import React from "react"
import ReactMarkdown from "react-markdown"
import { Bot, User } from "lucide-react"
import type { MessageProps } from "@/types/Message.types"

const Message: React.FC<MessageProps> = ({ isBot, message }) => {

  return (
    <div
      className={`flex w-full gap-3 py-3 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot && (
        <div className="h-9 w-9 rounded-full border bg-background flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm border ${
          isBot
            ? "bg-muted text-foreground border-border"
            : "bg-primary text-primary-foreground border-primary/70"
        }`}
      >
        <ReactMarkdown>
          {message}
        </ReactMarkdown>
      </div>

      {!isBot && (
        <div className="h-9 w-9 rounded-full border bg-background flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
      )}
    </div>
  )
}

export default Message


