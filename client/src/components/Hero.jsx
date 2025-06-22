import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Shield,
  Calendar,
  FileText,
  Users,
  Pill,
  Bell,
  Activity,
  CheckCircle,
  ArrowRight,
  Clock
} from 'lucide-react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, ...props }) => {
  const baseClasses = 'font-semibold rounded-full transition-all duration-300 flex items-center justify-center';
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-white',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
    {children}
  </span>
);

const Hero = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    { icon: Pill, text: "Track Prescriptions", color: "text-blue-600" },
    { icon: Calendar, text: "Appointment Reminders", color: "text-green-600" },
    { icon: FileText, text: "Medical History", color: "text-purple-600" },
    { icon: Users, text: "Family Management", color: "text-orange-600" },
  ];

  // const stats = [
  //   { number: "+", label: "Families Protected" },
  //   { number: "99.8%", label: "Uptime Guarantee" },
  //   { number: "Blowfish Cipher", label: "Encryption" },
  //   { number: "24/7", label: "Support Available" },
  // ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-blue-400"></div>
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-purple-400"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full bg-green-400"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-orange-400"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  <Heart className="w-4 h-4 mr-1" />
                  Trusted
                </Badge>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your Family's
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                    Medical Records
                  </span>
                  Made Simple
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Never forget prescriptions or appointments again. Securely manage your family's complete medical history in one place.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-red-600 mb-2 flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      The Problem
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Forgotten prescriptions</li>
                      <li>• Missed appointments</li>
                      <li>• Lost medical history</li>
                      <li>• Family health chaos</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-600 mb-2 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Our Solution
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Smart reminders</li>
                      <li>• Secure cloud storage</li>
                      <li>• Family management</li>
                      <li>• 24/7 accessibility</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to='/signup'>
                  <Button size="lg" className="group">
                    Start For Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to='/features'>
                  <Button variant="outline" size="lg">
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-green-600" />
                  Easy To Use
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-blue-600" />
                  No Credit Card Required
                </div>
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-1 text-purple-600" />
                  99.8% Uptime SLA
                </div>
              </div>
            </div>

            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="relative">
                <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Raj Family</h3>
                          <p className="text-sm text-gray-500">4 members protected</p>
                        </div>
                      </div>
                      <Bell className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="space-y-4">
                      {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                          <div
                            key={index}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                              currentFeature === index
                                ? "bg-blue-50 border-l-4 border-blue-500 transform scale-105"
                                : "bg-gray-50 opacity-60"
                            }`}
                          >
                            <IconComponent className={`w-5 h-5 ${feature.color}`} />
                            <span className="font-medium text-gray-700">{feature.text}</span>
                            {currentFeature === index && (
                              <div className="ml-auto">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">15</div>
                        <div className="text-xs text-gray-600">Active Prescriptions</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">5</div>
                        <div className="text-xs text-gray-600">Upcoming Appointments</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Heart className="w-8 h-8 text-white" />
                </div>

                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* <div className={`mt-20 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
