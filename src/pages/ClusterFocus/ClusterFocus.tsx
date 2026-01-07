import { useNavigate, useParams } from "react-router-dom"
import {
  Activity,
  BookOpen,
  Heart,
  MessageSquare,
  ArrowLeft,
} from "lucide-react"

const activities = [
  {
    id: "morning-checkin",
    title: "Morning Check-in",
    description: "Start your day with a quick assessment.",
    icon: Activity,
    iconBg: "bg-[#E7F1FF]",
    iconColor: "text-[#2F6FE8]",
  },
  {
    id: "worry-log",
    title: "Worry Log",
    description: "Record thoughts causing anxiety.",
    icon: BookOpen,
    iconBg: "bg-[#F4E9FF]",
    iconColor: "text-[#8B5CF6]",
  },
  {
    id: "coping-strategies",
    title: "Coping Strategies",
    description: "Immediate actions for panic or stress.",
    icon: Heart,
    iconBg: "bg-[#FFECEF]",
    iconColor: "text-[#F97373]",
  },
  {
    id: "progress-chat",
    title: "Progress Chat",
    description: "Talk to your AI guide about goals.",
    icon: MessageSquare,
    iconBg: "bg-[#EBFAF1]",
    iconColor: "text-[#22C55E]",
  },
]

const ClusterFocus = () => {
  const navigate = useNavigate()
  const { clusterId } = useParams()

  const title =
    clusterId && clusterId.toUpperCase() === "GAD"
      ? "GAD FOCUS"
      : "FOCUS"

  const handleActivityClick = (id: string) => {
    // For now all activities lead to chat. Later we can branch by id.
    if (id === "progress-chat") {
      navigate("/chat")
    } else {
      navigate("/chat")
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 pt-6 pb-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card text-foreground shadow-sm hover:bg-muted transition-colors"
            aria-label="Back to clusters"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
              Select an activity to continue your progress.
            </p>
          </div>
        </div>

        {/* Activity cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => handleActivityClick(activity.id)}
              className="text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
            >
              <div className="w-full rounded-3xl border border-border/60 bg-card shadow-sm px-6 py-5 flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300 group-active:scale-[0.99]">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${activity.iconBg}`}>
                  <activity.icon className={`h-7 w-7 ${activity.iconColor}`} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClusterFocus


