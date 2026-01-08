export type ClusterStatus = "in-progress" | "completed" | "upcoming"

export interface Cluster {
  id: string
  name: string
  description: string
  status: ClusterStatus
  progress: number
}

