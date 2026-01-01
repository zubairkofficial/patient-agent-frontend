import { Activity, Users, Calendar, MessageSquare, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Dashboard() {
  const stats = [
    {
      title: "Total Patients",
      value: "1,234",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Today's Appointments",
      value: "24",
      change: "+3",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Messages",
      value: "18",
      change: "-5",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Active Cases",
      value: "156",
      change: "+8.2%",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const recentActivities = [
    { time: "2 min ago", activity: "New patient registration: John Doe", type: "patient" },
    { time: "15 min ago", activity: "Appointment scheduled for Sarah Smith", type: "appointment" },
    { time: "1 hour ago", activity: "Message received from Dr. Johnson", type: "message" },
    { time: "2 hours ago", activity: "Document uploaded: Medical Report", type: "document" },
    { time: "3 hours ago", activity: "Patient check-in: Emily Brown", type: "patient" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your patients today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground">from last month</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.activity}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent hover:border-primary/50 transition-colors">
              <div className="font-medium text-foreground mb-1">Add New Patient</div>
              <div className="text-sm text-muted-foreground">Register a new patient</div>
            </button>
            <button className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent hover:border-primary/50 transition-colors">
              <div className="font-medium text-foreground mb-1">Schedule Appointment</div>
              <div className="text-sm text-muted-foreground">Book a new appointment</div>
            </button>
            <button className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent hover:border-primary/50 transition-colors">
              <div className="font-medium text-foreground mb-1">Send Message</div>
              <div className="text-sm text-muted-foreground">Contact a patient</div>
            </button>
            <button className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent hover:border-primary/50 transition-colors">
              <div className="font-medium text-foreground mb-1">Upload Document</div>
              <div className="text-sm text-muted-foreground">Add medical records</div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

