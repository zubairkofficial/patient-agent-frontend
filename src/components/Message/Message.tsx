import React from "react"
import ReactMarkdown from "react-markdown"

type MessageProps = {
  isBot: boolean
  message: string
  avatarUrl?: string
}

const Message: React.FC<MessageProps> = ({ isBot, message, avatarUrl }) => {
  const defaultUserAvatar =
    "https://api.dicebear.com/9.x/adventurer/svg?seed=user"
  const defaultBotAvatar =
    "https://api.dicebear.com/9.x/bottts/svg?seed=bot"

  const finalAvatar = avatarUrl || (isBot ? defaultBotAvatar : defaultUserAvatar)

  return (
    <div
      className={`flex w-full gap-3 py-3 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot && (
        <img
          src={finalAvatar}
          alt={isBot ? "Bot avatar" : "User avatar"}
          className="h-9 w-9 rounded-full border bg-background object-cover"
        />
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm border ${
          isBot
            ? "bg-muted text-foreground border-border"
            : "bg-primary text-primary-foreground border-primary/70"
        }`}
      >
        <ReactMarkdown
          className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-2 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-black/10 dark:prose-code:bg-white/10"
        >
          {message}
        </ReactMarkdown>
      </div>

      {!isBot && (
        <img
          src={finalAvatar}
          alt={isBot ? "Bot avatar" : "User avatar"}
          className="h-9 w-9 rounded-full border bg-background object-cover"
        />
      )}
    </div>
  )
}

export default Message


