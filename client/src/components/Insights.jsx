import React,{ useState, useEffect } from "react"
import {
  TrendingUp,
  Calendar,
  Users,
  Activity,
  AlertCircle,
  BarChart3,
  Clock,
  Heart,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react"
import { backendUrl } from "../App"

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center"
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    success: "bg-green-600 hover:bg-green-700 text-white",
    outline: "border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-white",
  }
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }) => {
  return <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>{children}</div>
}

const BarChart = ({ data, title, color = "bg-blue-500" }) => {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
              <div
                className={`${color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-8 text-sm font-medium text-gray-700">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const LineChart = ({ data, title, color = "stroke-blue-500" }) => {
  const maxValue = Math.max(...data.map((item) => item.value))
  const minValue = Math.min(...data.map((item) => item.value))
  const range = maxValue - minValue || 1

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 300
      const y = 100 - ((item.value - minValue) / range) * 80
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <div className="relative">
        <svg width="100%" height="120" viewBox="0 0 300 100" className="border rounded-lg bg-gray-50">
          <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} className={color} />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 300
            const y = 100 - ((item.value - minValue) / range) * 80
            return (
              <circle key={index} cx={x} cy={y} r="4" fill="currentColor" className={color.replace("stroke", "text")} />
            )
          })}
        </svg>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

const DonutChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <div className="flex items-center space-x-6">
        <div className="relative w-32 h-32">
          <svg width="128" height="128" viewBox="0 0 42 42" className="transform -rotate-90">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E5E7EB" strokeWidth="3" />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const strokeDasharray = `${percentage} ${100 - percentage}`
              const strokeDashoffset = -cumulativePercentage
              cumulativePercentage += percentage

              return (
                <circle
                  key={index}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={colors[index % colors.length]}
                  strokeWidth="3"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-800">({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Insights() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("6months") // 1month, 3months, 6months, 1year
  const [selectedMember, setSelectedMember] = useState("all")
  const [familyMembers, setFamilyMembers] = useState([])

  const [insightsData, setInsightsData] = useState({
    totalVisits: 24,
    totalMembers: 4,
    upcomingAppointments: 3,
    commonDiagnoses: [
      { label: "Routine Checkup", value: 8 },
      { label: "Cold/Flu", value: 5 },
      { label: "Dental", value: 4 },
      { label: "Eye Exam", value: 3 },
      { label: "Vaccination", value: 2 },
    ],
    visitTrends: [
      { label: "Jan", value: 2 },
      { label: "Feb", value: 4 },
      { label: "Mar", value: 3 },
      { label: "Apr", value: 6 },
      { label: "May", value: 5 },
      { label: "Jun", value: 4 },
    ],
    doctorVisits: [
      { label: "Dr. Smith", value: 8 },
      { label: "Dr. Johnson", value: 6 },
      { label: "Dr. Brown", value: 4 },
      { label: "Dr. Davis", value: 3 },
      { label: "Dr. Wilson", value: 3 },
    ],
    memberActivity: [
      { label: "Raj", value: 8 },
      { label: "Jiteh", value: 6 },
      { label: "Sudha", value: 5 },
      { label: "Ram", value: 5 },
    ],
    healthMetrics: {
      averageVisitsPerMonth: 4.2,
      mostActiveMonth: "April",
      topDoctor: "Dr. Kumar",
      healthScore: 85,
    },
  })

  useEffect(() => {
    fetchFamilyMembers()
    fetchInsightsData()
  }, [timeRange, selectedMember])

  const fetchFamilyMembers = async () => {
    try {
      const response = await fetch(`${backendUrl}/members/getmember`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFamilyMembers(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching family members:", error)
    }
  }

  const fetchInsightsData = async () => {
    try {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching insights:", error)
      setIsLoading(false)
    }
  }

  const exportData = () => {
    alert("Export functionality would be implemented here")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
                Health Insights & Analytics <h2 className="ml-6 text-blue-600">(Coming Soon........)</h2>
              </h1>
              <p className="text-gray-600 mt-1">Track your family's health trends and patterns</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button onClick={fetchInsightsData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Family Member:</label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Members</option>
                {familyMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold text-gray-900">{insightsData.totalVisits}</p>
                <p className="text-xs text-green-600">+12% from last period</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Family Members</p>
                <p className="text-2xl font-bold text-gray-900">{insightsData.totalMembers}</p>
                <p className="text-xs text-gray-500">Active members</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{insightsData.upcomingAppointments}</p>
                <p className="text-xs text-orange-600">Appointments this week</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-gray-900">{insightsData.healthMetrics.healthScore}%</p>
                <p className="text-xs text-green-600">Excellent</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <LineChart data={insightsData.visitTrends} title="📈 Visit Trends Over Time" color="stroke-blue-500" />
          </Card>

          <Card className="p-6">
            <DonutChart data={insightsData.commonDiagnoses} title="🏥 Common Diagnoses" />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <BarChart data={insightsData.doctorVisits} title="👨‍⚕️ Doctor Visit Frequency" color="bg-green-500" />
          </Card>

          <Card className="p-6">
            <BarChart data={insightsData.memberActivity} title="👥 Member Activity" color="bg-purple-500" />
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            Health Insights Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{insightsData.healthMetrics.averageVisitsPerMonth}</div>
              <div className="text-sm text-gray-600">Avg Visits/Month</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{insightsData.healthMetrics.mostActiveMonth}</div>
              <div className="text-sm text-gray-600">Most Active Month</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{insightsData.healthMetrics.topDoctor}</div>
              <div className="text-sm text-gray-600">Most Visited Doctor</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">92%</div>
              <div className="text-sm text-gray-600">Appointment Adherence</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2 text-orange-600" />
            Health Recommendations
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-blue-900">Schedule Regular Checkups</h3>
                <p className="text-blue-700 text-sm">
                  Emma hasn't had a checkup in 8 months. Consider scheduling a routine visit.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-green-900">Vaccination Reminder</h3>
                <p className="text-green-700 text-sm">
                  Mike's annual flu shot is due next month. Set a reminder to schedule it.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-orange-900">Follow-up Required</h3>
                <p className="text-orange-700 text-sm">
                  Sarah has a follow-up appointment scheduled with Dr. Johnson for next week.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Insights
