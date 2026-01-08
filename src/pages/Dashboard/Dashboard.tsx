import { useNavigate } from "react-router-dom"
import { Calendar, ChevronRight } from "lucide-react"

type ClusterStatus = "in-progress" | "completed" | "upcoming"

interface Cluster {
  id: string
  name: string
  description: string
  status: ClusterStatus
  progress: number
}

const clusters: Cluster[] = [
  {
    id: "gad",
    name: "GAD (Generalized Anxiety Disorder)",
    description:
      "Weekly focus on managing daily worries, tracking triggers, and practicing coping strategies.",
    status: "in-progress",
    progress: 65,
  },
  {
    id: "sleep-hygiene",
    name: "Sleep Hygiene",
    description:
      "Strengthen your bedtime routine, adjust your environment, and review your weekly sleep trends.",
    status: "completed",
    progress: 100,
  },
  {
    id: "mindfulness-basics",
    name: "Mindfulness Basics",
    description:
      "Learn simple meditation and grounding techniques to build a calm daily check-in habit.",
    status: "upcoming",
    progress: 0,
  },
]

const getStatusChip = (status: ClusterStatus) => {
  switch (status) {
    case "in-progress":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          In Progress
        </span>
      )
    case "completed":
      return (
        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
          Completed
        </span>
      )
    case "upcoming":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          Upcoming
        </span>
      )
  }
}

const Dashboard = () => {
  const navigate = useNavigate()

  const handleClusterClick = (clusterId: string) => {
    navigate(`/cluster/${clusterId}`)
  }

  return (
    <div className="w-full min-h-screen bg-background px-4 sm:px-8 pt-8 pb-10">
      <div className="max-w-8xl mx-auto">
        {/* Top heading & icon */}
        

        {/* Weekly clusters heading */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Calendar className="h-4 w-4" />
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Weekly Clusters
          </h2>
        </div>

        {/* Cluster cards */}
        <div className="grid gap-4">
          {clusters.map((cluster, index) => (
            <button
              key={cluster.id}
              onClick={() => handleClusterClick(cluster.id)}
              className="w-full text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-3xl animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
            >
              <div className="w-full rounded-3xl border border-border/40 bg-card/60 backdrop-blur shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                <div className="px-6 py-7 pb-8 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-semibold text-base sm:text-lg text-foreground">
                        {cluster.name}
                      </h3>
                      {getStatusChip(cluster.status)}
                    </div>
                    <p className="text-muted-foreground text-sm max-w-2xl">
                      {cluster.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Progress
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {cluster.progress}%
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

