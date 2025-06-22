import React,{ useState, useEffect } from "react"
import {
  Shield,
  Users,
  Calendar,
  Bell,
  Heart,
  Lock,
  Cloud,
  Smartphone,
  Clock,
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Zap,
  Globe,
  Database,
  Headphones,
  FileText,
} from "lucide-react"
import { Link } from "react-router-dom"

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
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-white",
    ghost: "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
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

const Card = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 ${
        hover ? "hover:shadow-xl transition-all duration-300" : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}


const FeatureDemo = ({ feature, isActive, onActivate }) => {
  const [demoStep, setDemoStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    let interval
    if (isPlaying && isActive) {
      interval = setInterval(() => {
        setDemoStep((prev) => (prev + 1) % feature.demoSteps.length)
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, isActive, feature.demoSteps.length])

  const toggleDemo = () => {
    setIsPlaying(!isPlaying)
    if (!isActive) onActivate()
  }

  const nextStep = () => {
    setDemoStep((prev) => (prev + 1) % feature.demoSteps.length)
  }

  const prevStep = () => {
    setDemoStep((prev) => (prev - 1 + feature.demoSteps.length) % feature.demoSteps.length)
  }

  return (
    <Card className={`p-6 ${isActive ? "ring-2 ring-blue-500 shadow-2xl" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.bgColor}`}>
            <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.subtitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleDemo}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
      </div>

      {/* Demo Area */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[200px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">{feature.demoSteps[demoStep].title}</h4>
            <div className="flex space-x-1">
              {feature.demoSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === demoStep ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">{feature.demoSteps[demoStep].content}</div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={prevStep}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextStep}>
            <ChevronRight size={16} />
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          Step {demoStep + 1} of {feature.demoSteps.length}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
        <div className="flex flex-wrap gap-2">
          {feature.benefits.map((benefit, index) => (
            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
              <CheckCircle size={12} className="mr-1" />
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}


function Features() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const features = [
    {
      id: 1,
      title: "Family Health Records",
      subtitle: "Centralized medical history",
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      category: "records",
      description:
        "Keep all your family's medical records, prescriptions, and health information in one secure, organized place.",
      benefits: ["Secure Storage", "Easy Access", "Complete History"],
      demoSteps: [
        {
          title: "Add Family Members",
          content: (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                  J
                </div>
                <div>
                  <div className="font-medium">Jitesh Sharma</div>
                  <div className="text-xs text-gray-500">Father, Age 45</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm">
                  S
                </div>
                <div>
                  <div className="font-medium">Sudha Sharma</div>
                  <div className="text-xs text-gray-500">Mother, Age 42</div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Medical Records",
          content: (
            <div className="space-y-2">
              <div className="p-3 bg-white rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Annual Checkup</span>
                  <span className="text-xs text-gray-500">Dec 15, 2023</span>
                </div>
                <div className="text-sm text-gray-600">Dr. Kumar - All vitals normal</div>
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Blood Test</span>
                  <span className="text-xs text-gray-500">Nov 20, 2023</span>
                </div>
                <div className="text-sm text-gray-600">Lab Results - Cholesterol: 180</div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 2,
      title: "Smart Reminders",
      subtitle: "Never miss appointments",
      icon: Bell,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      category: "reminders",
      description:
        "Intelligent reminder system for appointments, medications, and health checkups with multiple notification options.",
      benefits: ["Smart Notifications", "Multiple Channels", "Recurring Events"],
      demoSteps: [
        {
          title: "Set Reminders",
          content: (
            <div className="space-y-2">
              <div className="p-3 bg-white rounded border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Dentist Appointment</div>
                    <div className="text-sm text-gray-600">Tomorrow at 2:00 PM</div>
                  </div>
                  <Bell className="w-5 h-5 text-orange-500" />
                </div>
              </div>
              <div className="p-3 bg-white rounded border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Blood Pressure Medication</div>
                    <div className="text-sm text-gray-600">Daily at 8:00 AM</div>
                  </div>
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Notification Options",
          content: (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-white rounded border text-center">
                <Smartphone className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <div className="text-xs">Push Notifications</div>
              </div>
              <div className="p-2 bg-white rounded border text-center">
                <Globe className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <div className="text-xs">Email Alerts</div>
              </div>
            </div>
          ),
        },
        {
          title: "Smart Scheduling",
          content: (
            <div className="text-center py-4">
              <Calendar className="w-16 h-16 text-purple-500 mx-auto mb-2" />
              <div className="font-medium text-gray-800">AI-Powered Scheduling</div>
              <div className="text-sm text-gray-600">Suggests optimal appointment times</div>
            </div>
          ),
        },
      ],
    },
    {
      id: 3,
      title: "Health Analytics (Coming Soon...)",
      subtitle: "Track health trends",
      icon: BarChart3,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      category: "analytics",
      description:
        "Advanced analytics and insights to track your family's health trends, patterns, and improvements over time.",
      benefits: ["Trend Analysis", "Health Insights", "Progress Tracking"],
      demoSteps: [
        {
          title: "Health Dashboard",
          content: (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white rounded border text-center">
                  <div className="text-lg font-bold text-blue-600">24</div>
                  <div className="text-xs text-gray-600">Total Visits</div>
                </div>
                <div className="p-2 bg-white rounded border text-center">
                  <div className="text-lg font-bold text-green-600">4</div>
                  <div className="text-xs text-gray-600">Family Members</div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Trend Charts",
          content: (
            <div className="bg-white rounded border p-2">
              <div className="text-xs text-gray-600 mb-2">Visit Frequency</div>
              <div className="flex items-end space-x-1 h-16">
                <div className="bg-blue-500 w-4" style={{ height: "30%" }}></div>
                <div className="bg-blue-500 w-4" style={{ height: "60%" }}></div>
                <div className="bg-blue-500 w-4" style={{ height: "40%" }}></div>
                <div className="bg-blue-500 w-4" style={{ height: "80%" }}></div>
                <div className="bg-blue-500 w-4" style={{ height: "50%" }}></div>
              </div>
            </div>
          ),
        },
        {
          title: "Health Score",
          content: (
            <div className="text-center py-4">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="30" stroke="#E5E7EB" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="#10B981"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="188.4"
                    strokeDashoffset="37.68"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">85%</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">Health Score</div>
            </div>
          ),
        },
      ],
    },
    {
      id: 4,
      title: "Secure Cloud Storage",
      subtitle: "Cloudinary for storage",
      icon: Shield,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      category: "security",
      description:
        "Enterprise-grade security with HIPAA compliance, end-to-end encryption, and secure cloud storage for all your health data.",
      benefits: ["Cloudinary Storage", "Encryption of Passwords", "Secure Backup"],
      demoSteps: [
        {
          title: "Data Encryption",
          content: (
            <div className="text-center py-4">
              <Lock className="w-16 h-16 text-red-500 mx-auto mb-2" />
              <div className="font-medium text-gray-800">Encryption</div>
              <div className="text-sm text-gray-600">Top Notch security for your data</div>
            </div>
          ),
        },
        {
          title: "Secure Access",
          content: (
            <div className="space-y-2">
              <div className="p-2 bg-white rounded border flex items-center justify-between">
                <span className="text-sm">Two-Factor Authentication</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="p-2 bg-white rounded border flex items-center justify-between">
                <span className="text-sm">JWT Login</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="p-2 bg-white rounded border flex items-center justify-between">
                <span className="text-sm">Session Timeout</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 5,
      title: "Mobile App",
      subtitle: "Health on the go",
      icon: Smartphone,
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      category: "mobile",
      description:
        "Full-featured mobile app for iOS and Android with offline access, push notifications, and seamless sync across devices.",
      benefits: ["Cross-Platform", "Offline Access", "Real-time Sync"],
      demoSteps: [
        {
          title: "Mobile Interface",
          content: (
            <div className="bg-gray-800 rounded-lg p-2 mx-auto w-32">
              <div className="bg-white rounded p-2 space-y-1">
                <div className="h-2 bg-blue-500 rounded w-3/4"></div>
                <div className="h-1 bg-gray-300 rounded w-full"></div>
                <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  <div className="h-6 bg-blue-100 rounded"></div>
                  <div className="h-6 bg-green-100 rounded"></div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Push Notifications",
          content: (
            <div className="bg-gray-100 rounded p-2">
              <div className="bg-white rounded border p-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">TrackMeds</div>
                    <div className="text-gray-600">Appointment reminder: Dr. Kumar at 2 PM</div>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Offline Access",
          content: (
            <div className="text-center py-4">
              <Cloud className="w-16 h-16 text-indigo-500 mx-auto mb-2" />
              <div className="font-medium text-gray-800">Works Offline</div>
              <div className="text-sm text-gray-600">Access your data anywhere, anytime</div>
            </div>
          ),
        },
      ],
    },
    {
      id: 6,
      title: "24/7 Support (Coming soon...)",
      subtitle: "Always here to help",
      icon: Headphones,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      category: "support",
      description:
        "Round-the-clock customer support with multiple channels including chat, email, and phone support for premium users.",
      benefits: ["24/7 Availability", "Multiple Channels", "Expert Help"],
      demoSteps: [
        {
          title: "Live Chat",
          content: (
            <div className="bg-gray-100 rounded p-2 space-y-2">
              <div className="bg-blue-500 text-white rounded p-2 text-xs ml-4">
                Hi! How can I help you today?
              </div>
              <div className="bg-white rounded p-2 text-xs mr-4">
                I need help setting up reminders
              </div>
              <div className="bg-blue-500 text-white rounded p-2 text-xs ml-4">
                I'd be happy to help! Let me guide you through it.
              </div>
            </div>
          ),
        },
        {
          title: "Support Channels",
          content: (
            <div className="grid grid-cols-3 gap-1">
              <div className="p-2 bg-white rounded border text-center">
                <Globe className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <div className="text-xs">Chat</div>
              </div>
              <div className="p-2 bg-white rounded border text-center">
                <Globe className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <div className="text-xs">Email</div>
              </div>
              <div className="p-2 bg-white rounded border text-center">
                <Headphones className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <div className="text-xs">Phone</div>
              </div>
            </div>
          ),
        },
        {
          title: "Response Time",
          content: (
            <div className="text-center py-4">
              <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
              <div className="font-medium text-gray-800\"> 5 Minutes</div>
              <div className="text-sm text-gray-600">Average response time</div>
            </div>
          ),
        },
      ],
    },
  ]

  const categories = [
    { id: "all", name: "All Features", icon: Star },
    { id: "records", name: "Medical Records", icon: FileText },
    { id: "reminders", name: "Reminders", icon: Bell },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "security", name: "Security", icon: Shield },
    { id: "mobile", name: "Mobile", icon: Smartphone },
    { id: "support", name: "Support", icon: Headphones },
  ]

  const filteredFeatures = selectedCategory === "all" ? features : features.filter((f) => f.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Better Health Management
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover how TrackMeds makes managing your family's health simple, secure, and smart with our
              comprehensive suite of features.
            </p>
            <div className="flex flex-col text-black sm:flex-row gap-4 justify-center">
             <Link to='/signup'>
              <Button variant="outline" size="lg" className="border-white text-black hover:text-blue-600">
                Start For Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
             </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "primary" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <category.icon size={16} />
              <span>{category.name}</span>
            </Button>
          ))}
        </div>

        {/* Interactive Feature Demos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {filteredFeatures.map((feature, index) => (
            <FeatureDemo
              key={feature.id}
              feature={feature}
              isActive={activeFeature === index}
              onActivate={() => setActiveFeature(index)}
            />
          ))}
        </div>

        {/* CTA Section */}
        <Card className="p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of families who are already managing their health better with TrackMeds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to='/signup'>
              <Button variant="outline" size="lg" className="border-white text-black hover:text-blue-600">
                Start For Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
             </Link>
          </div>    
        </Card>
      </div>
    </div>
  )
}

export default Features
