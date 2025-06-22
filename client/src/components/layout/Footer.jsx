import React from 'react'
import {
  Stethoscope,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  GithubIcon,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Heart,
  HeartIcon,
} from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Medical Records", href: "/records" },
      { name: "Health Insights", href: "/insights" },
      { name: "Reminder", href: "/reminders" },
    ],
    
  }

  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Brand Section */}
            <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    TrackMeds
                  </span>
                  <div className="text-xs text-gray-400 font-medium">Healthcare Management</div>
                </div>
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed text-lg text-center lg:text-left">
                Empowering families with secure, comprehensive healthcare management. Your medical data, protected and
                accessible when you need it most.
              </p>

              {/* Trust Badges */}
              <div className="space-y-4 mb-8 w-full">
                <div className="flex items-center text-sm text-gray-300 bg-gray-800/30 rounded-lg p-3">
                  <ShieldCheck className="w-5 h-5 mr-3 text-green-400" />
                  <span className="font-medium">Secured Cloud Storage</span>
                </div>
                <div className="flex items-center text-sm text-gray-300 bg-gray-800/30 rounded-lg p-3">
                  <ShieldCheck className="w-5 h-5 mr-3 text-blue-400" />
                  <span className="font-medium">Encryption & Zero-Trust Security</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3 justify-center lg:justify-start">
                {[
                  { icon: GithubIcon, href: "https://github.com/VikasPrasad27", label: "Github" },
                  { icon: HeartIcon, href: "https://vikasprasad-portfolio.vercel.app/", label: "Portfolio" },
                  { icon: Linkedin, href: "https://linkedin.com/in/vikas-prasad-47b8642b0", label: "LinkedIn" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <h3 className="font-bold text-white mb-6 text-center text-lg">Product</h3>
              <div className="flex flex-wrap justify-center gap-2 lg:flex-col lg:space-y-4 lg:gap-0 lg:items-center">
                {footerLinks.product.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group px-3 py-1 lg:px-0 lg:py-0"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Get in Touch */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <h3 className="font-bold text-white mb-6 text-center text-xl">Get in Touch</h3>
              <div className="space-y-6 flex flex-col items-center lg:items-start">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Email Support</div>
                    <a
                      href="mailto:vikasicem123@gmail.com"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      vikasicem123@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">24/7 Support</div>
                    <div className="text-gray-400">Available round the clock</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Global Coverage</div>
                    <div className="text-gray-400">Serving families worldwide</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-t border-gray-800/50 mt-16 pt-12">
            <div className="flex justify-center">
              {/* Newsletter - Centered */}
              <div className="max-w-2xl w-full text-center">
                <h3 className="font-bold text-white mb-6 text-xl">Stay Updated</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Get the latest health tips, product updates, and security insights delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-400 transition-all duration-300"
                  />
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center">
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  By subscribing, you agree to our Privacy Policy and Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800/50 bg-gray-950/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
                <div>© {currentYear} TrackMeds. All rights reserved.</div>
                <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
              </div>

              <div className="flex items-center space-x-2 text-l">
                <span className="text-gray-400">Designed & Developed with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-gray-400">by</span>
                <a
                  href="https://vikasprasad-portfolio.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-300"
                >
                  Vikas Prasad
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer