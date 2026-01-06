import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card/Card"
import { 
  Users, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Clock,
  FileText,
  MessageSquare,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardStats {
  totalPatients: number
  activePatients: number
  appointmentsToday: number
  pendingAppointments: number
  totalDocuments: number
  recentMessages: number
  completedTasks: number
  growthRate: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    appointmentsToday: 0,
    pendingAppointments: 0,
    totalDocuments: 0,
    recentMessages: 0,
    completedTasks: 0,
    growthRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch dashboard stats
    const fetchStats = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data - replace with actual API call
      setStats({
        totalPatients: 1248,
        activePatients: 856,
        appointmentsToday: 23,
        pendingAppointments: 12,
        totalDocuments: 3421,
        recentMessages: 48,
        completedTasks: 156,
        growthRate: 12.5
      })
      
      setIsLoading(false)
    }

    fetchStats()
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="w-full min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your patients today.</p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Patients Card */}
          <Card
            icon={Users}
            title="Total Patients"
            description="All registered patients"
            headerRight={
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1",
                stats.growthRate > 0 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              )}>
                {stats.growthRate > 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(stats.growthRate)}%
              </span>
            }
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">
                {isLoading ? "..." : formatNumber(stats.totalPatients)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.activePatients} active this month
            </p>
          </Card>

          {/* Active Patients Card */}
          <Card
            icon={Activity}
            title="Active Patients"
            description="Currently active"
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">
                {isLoading ? "..." : formatNumber(stats.activePatients)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {((stats.activePatients / stats.totalPatients) * 100).toFixed(1)}% of total
            </p>
          </Card>

          {/* Appointments Today Card */}
          <Card
            icon={Calendar}
            title="Appointments Today"
            description="Scheduled for today"
            headerRight={
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            }
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">
                {isLoading ? "..." : stats.appointmentsToday}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.pendingAppointments} pending
            </p>
          </Card>

          {/* Pending Appointments Card */}
          <Card
            icon={Clock}
            title="Pending"
            description="Awaiting confirmation"
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">
                {isLoading ? "..." : stats.pendingAppointments}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Require attention
            </p>
          </Card>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Documents Card */}
          <Card
            icon={FileText}
            title="Documents"
            description="Total documents stored"
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">
                {isLoading ? "..." : formatNumber(stats.totalDocuments)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Medical records & files
            </p>
          </Card>

          {/* Recent Messages Card */}
          <Card
            icon={MessageSquare}
            title="Messages"
            description="Recent conversations"
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">
                {isLoading ? "..." : stats.recentMessages}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Unread messages
            </p>
          </Card>

          {/* Completed Tasks Card */}
          <Card
            icon={CheckCircle2}
            title="Completed"
            description="Tasks finished this week"
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">
                {isLoading ? "..." : stats.completedTasks}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Great progress!
            </p>
          </Card>

          {/* Growth Rate Card */}
          <Card
            icon={TrendingUp}
            title="Growth Rate"
            description="Patient growth this month"
            headerRight={
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1",
                stats.growthRate > 0 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              )}>
                {stats.growthRate > 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(stats.growthRate)}%
              </span>
            }
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">
                {isLoading ? "..." : `${stats.growthRate}%`}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Compared to last month
            </p>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              title="New Patient"
              description="Register a new patient"
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary"
            >
              <div className="text-center py-4">
                <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Add new patient record</p>
              </div>
            </Card>

            <Card
              title="Schedule Appointment"
              description="Book a new appointment"
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary"
            >
              <div className="text-center py-4">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Create new appointment</p>
              </div>
            </Card>

            <Card
              title="View Reports"
              description="Access patient reports"
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary"
            >
              <div className="text-center py-4">
                <FileText className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Browse all documents</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

