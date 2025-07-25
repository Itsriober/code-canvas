import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCode, FiDatabase, FiGlobe, FiLayout, FiLayers, FiUserPlus, FiLogIn } from 'react-icons/fi';

const Home: FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const languages = [
    { name: 'Python', description: 'Data science, web development, and automation.' },
    { name: 'JavaScript', description: 'Frontend and backend development with Node.js.' },
    { name: 'PHP', description: 'Server-side web development and applications.' },
    { name: 'HTML/CSS', description: 'Web structure and styling fundamentals.' },
    { name: 'Java', description: 'Enterprise applications and Android development.' },
    { name: 'C++', description: 'System programming and game development.' }
  ];

  const benefits = [
    {
      icon: <FiGlobe />,
      title: 'Code Anywhere, Anytime',
      description: 'No setup required. Access your workspace from any browser.'
    },
    {
      icon: <FiLayers />,
      title: 'Project Management',
      description: 'Organize your code with intuitive file and project structure.'
    },
    {
      icon: <FiLayout />,
      title: 'Familiar Interface',
      description: 'VS Code-like experience right in your browser.'
    },
    {
      icon: <FiCode />,
      title: 'Smart Features',
      description: 'Syntax highlighting, auto-completion, and more.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-pulse-slow absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            {...fadeIn}
          >
            CodeCanvas
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl md:text-2xl text-gray-300"
            {...fadeIn}
            transition={{ delay: 0.2 }}
          >
            Your Cloud-Based Coding Workspace
          </motion.p>
          <motion.p 
            className="mt-4 text-gray-400"
            {...fadeIn}
            transition={{ delay: 0.3 }}
          >
            Manage projects, write code, and learn effortlessly in a beautiful online environment.
          </motion.p>
          <motion.div 
            className="mt-8 flex flex-wrap justify-center gap-4"
            {...fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/register"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <FiUserPlus className="text-xl" />
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <FiLogIn className="text-xl" />
              Sign In
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CodeCanvas?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl text-blue-400 mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Supported Languages</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {languages.map((lang, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-2">{lang.name}</h3>
                <p className="text-gray-400">{lang.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">What is CodeCanvas?</h2>
          <p className="text-gray-400 leading-relaxed">
            CodeCanvas is a modern, cloud-based IDE that brings the power of professional development tools right to your browser. 
            Built with Laravel and React, featuring the robust Monaco Editor, it provides a seamless coding experience without the need 
            for local setup. Perfect for students, professionals, and coding enthusiasts alike.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2025 CodeCanvas. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
