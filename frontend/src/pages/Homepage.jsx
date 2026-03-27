import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Zap,
  Database,
  BarChart3,
  Globe,
  CheckCircle,
} from 'lucide-react';
import Header from '../components/Header';

function Homepage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <Header showScrapers={false} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-semibold text-slate-100 tracking-tight mb-6">
              Your Dream Job,
              <span className="text-accent"> Aggregated</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Caliber automatically scrapes job listings from LinkedIn and
              Naukri, bringing all opportunities into one powerful, searchable
              dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all font-semibold text-lg shadow-md"
              >
                Explore Jobs →
              </Link>
              <Link
                to="/upload"
                className="px-8 py-4 bg-slate-900 text-slate-300 border border-slate-800 rounded-lg hover:bg-slate-800 transition-all font-semibold text-lg shadow-md text-center"
              >
                Upload Resume ↑
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-md">
                <div className="text-4xl font-bold text-accent mb-2">50K+</div>
                <div className="text-slate-400 font-medium">Jobs Scraped</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-md">
                <div className="text-4xl font-bold text-accent mb-2">2</div>
                <div className="text-slate-400 font-medium">
                  Major Platforms
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-md">
                <div className="text-4xl font-bold text-accent mb-2">24/7</div>
                <div className="text-slate-400 font-medium">Auto Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-slate-100 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to streamline your job search in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 hover:shadow-md transition-shadow">
              <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Multi-Source Scraping
              </h3>
              <p className="text-slate-400">
                Automatically collect jobs from LinkedIn and Naukri in real-time
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 hover:shadow-md transition-shadow">
              <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Centralized Search
              </h3>
              <p className="text-slate-400">
                Search across all platforms from a single, unified interface
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 hover:shadow-md transition-shadow">
              <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Filter className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Smart Filters
              </h3>
              <p className="text-slate-400">
                Filter by role, company, location, and source to find perfect
                matches
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 hover:shadow-md transition-shadow">
              <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Lightning Fast
              </h3>
              <p className="text-slate-400">
                Modern UI with instant search and smooth interactions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-slate-100 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Simple, automated, and efficient job aggregation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  1
                </div>
                <Database className="h-10 w-10 text-accent mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-slate-100 mb-2 text-center">
                  Scrape Jobs
                </h3>
                <p className="text-slate-400 text-center text-sm">
                  Automated scrapers collect live job postings from LinkedIn and
                  Naukri
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  2
                </div>
                <BarChart3 className="h-10 w-10 text-accent mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-slate-100 mb-2 text-center">
                  Process Data
                </h3>
                <p className="text-slate-400 text-center text-sm">
                  Clean, normalize, and store data in a structured database
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  3
                </div>
                <Briefcase className="h-10 w-10 text-accent mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-slate-100 mb-2 text-center">
                  Display Jobs
                </h3>
                <p className="text-slate-400 text-center text-sm">
                  Present all opportunities in a beautiful, intuitive dashboard
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  4
                </div>
                <CheckCircle className="h-10 w-10 text-accent mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-slate-100 mb-2 text-center">
                  Find & Apply
                </h3>
                <p className="text-slate-400 text-center text-sm">
                  Search, filter, and apply to roles that match your profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-slate-100 mb-6">
            Ready to Supercharge Your Job Search?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of job seekers who trust Caliber to find their next
            opportunity
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all font-semibold text-lg shadow-md"
          >
            Get Started Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6 text-accent" />
                <span className="text-xl font-bold text-slate-100">
                  Caliber
                </span>
              </div>
              <p className="text-slate-500 text-sm">
                A modern full-stack job scraping application that aggregates
                opportunities from multiple platforms into one searchable
                dashboard.
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-slate-100 font-semibold mb-4">Tech Stack</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>React + Vite</li>
                <li>Node.js + Express</li>
                <li>MongoDB</li>
                <li>Python + Selenium</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-slate-100 font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-slate-100 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-slate-100 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-slate-100 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-slate-100 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              © 2026 Caliber. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
