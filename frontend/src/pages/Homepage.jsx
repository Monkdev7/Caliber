import { Link } from 'react-router-dom';
import { Briefcase, Search, Filter, Zap, Database, BarChart3, Globe, CheckCircle } from 'lucide-react';

function Homepage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <Briefcase className="h-8 w-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">Caliber</span>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                                Login
                            </button>
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                            Your Dream Job,
                            <span className="text-blue-600"> Aggregated</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Caliber automatically scrapes job listings from LinkedIn and Naukri,
                            bringing all opportunities into one powerful, searchable dashboard.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/dashboard"
                                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Explore Jobs →
                            </Link>
                            <button className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all font-semibold text-lg shadow-sm">
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                                <div className="text-gray-600 font-medium">Jobs Scraped</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
                                <div className="text-gray-600 font-medium">Major Platforms</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                                <div className="text-gray-600 font-medium">Auto Updates</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to streamline your job search in one place
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
                            <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Globe className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Multi-Source Scraping
                            </h3>
                            <p className="text-gray-600">
                                Automatically collect jobs from LinkedIn and Naukri in real-time
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
                            <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Search className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Centralized Search
                            </h3>
                            <p className="text-gray-600">
                                Search across all platforms from a single, unified interface
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
                            <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Filter className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Smart Filters
                            </h3>
                            <p className="text-gray-600">
                                Filter by role, company, location, and source to find perfect matches
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
                            <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Lightning Fast
                            </h3>
                            <p className="text-gray-600">
                                Modern UI with instant search and smooth interactions
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Simple, automated, and efficient job aggregation
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                                    1
                                </div>
                                <Database className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                                    Scrape Jobs
                                </h3>
                                <p className="text-gray-600 text-center text-sm">
                                    Automated scrapers collect live job postings from LinkedIn and Naukri
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                                    2
                                </div>
                                <BarChart3 className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                                    Process Data
                                </h3>
                                <p className="text-gray-600 text-center text-sm">
                                    Clean, normalize, and store data in a structured database
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                                    3
                                </div>
                                <Briefcase className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                                    Display Jobs
                                </h3>
                                <p className="text-gray-600 text-center text-sm">
                                    Present all opportunities in a beautiful, intuitive dashboard
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative">
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                                    4
                                </div>
                                <CheckCircle className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                                    Find & Apply
                                </h3>
                                <p className="text-gray-600 text-center text-sm">
                                    Search, filter, and apply to roles that match your profile
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Supercharge Your Job Search?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of job seekers who trust Caliber to find their next opportunity
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Get Started Now →
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* About */}
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Briefcase className="h-6 w-6 text-blue-500" />
                                <span className="text-xl font-bold text-white">Caliber</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                A modern full-stack job scraping application that aggregates opportunities from multiple platforms into one searchable dashboard.
                            </p>
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Tech Stack</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>React + Vite</li>
                                <li>Node.js + Express</li>
                                <li>MongoDB</li>
                                <li>Python + Selenium</li>
                                <li>Tailwind CSS</li>
                            </ul>
                        </div>

                        {/* Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-gray-800 pt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            © 2026 Caliber. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Homepage;
