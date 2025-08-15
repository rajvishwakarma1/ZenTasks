import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheckSquare, FiZap, FiTarget, FiHeart, FiCode, FiSmartphone, FiTrendingUp, FiGithub, FiGlobe, FiMail, FiLinkedin } = FiIcons;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

const AboutPage = () => {
  const features = [
    {
      icon: FiZap,
      title: 'Lightning Fast',
      description: 'Built with React and optimized for speed with minimal overhead'
    },
    {
      icon: FiTarget,
      title: 'Focus-Driven',
      description: 'Designed to minimize distractions and maximize productivity'
    },
    {
      icon: FiCode,
      title: 'Keyboard First',
      description: 'Full keyboard navigation support for power users'
    },
    {
      icon: FiHeart,
      title: 'User-Centric',
      description: 'Every feature designed with user experience in mind'
    }
  ];

  const techStack = [
    { name: 'React 18', purpose: 'Modern UI framework with hooks and concurrent features' },
    { name: 'Framer Motion', purpose: 'Smooth animations and micro-interactions' },
    { name: 'Tailwind CSS', purpose: 'Utility-first styling with dark mode support' },
    { name: 'React Router', purpose: 'Client-side routing for single-page application' },
    { name: 'Local Storage', purpose: 'Persistent data storage without external dependencies' },
    { name: 'React Icons', purpose: 'Comprehensive icon library with consistent styling' },
    { name: 'Progressive Web App', purpose: 'Installable on devices for offline use' }
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-12 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-notion-100 dark:bg-notion-900/30 rounded-2xl mb-6"
        >
          <SafeIcon icon={FiCheckSquare} className="w-10 h-10 text-notion-600 dark:text-notion-400" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Zen Tasks
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          "The quieter you become, the more you can hear." — Ram Dass
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          A minimalist, powerful todo application designed to help you focus on what truly matters
        </p>
      </div>

      {/* Contact Information */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Contact Me</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
            {/* DEVELOPER INFORMATION - REPLACE WITH YOUR DETAILS */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {/* Replace with your photo if desired */}
                <div className="w-full h-full flex items-center justify-center bg-notion-100 dark:bg-notion-900/30">
                  <SafeIcon icon={FiCheckSquare} className="w-10 h-10 text-notion-600 dark:text-notion-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Name</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Full-Stack Developer</p>
            </div>

            <div className="h-20 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-notion-100 dark:bg-notion-900/30 rounded-full">
                  <SafeIcon icon={FiMail} className="w-5 h-5 text-notion-600 dark:text-notion-400" />
                </div>
                <a
                  href="mailto:your.email@example.com"
                  className="text-gray-700 dark:text-gray-300 hover:text-notion-600 dark:hover:text-notion-400 transition-colors"
                >
                  your.email@example.com
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-notion-100 dark:bg-notion-900/30 rounded-full">
                  <SafeIcon icon={FiGlobe} className="w-5 h-5 text-notion-600 dark:text-notion-400" />
                </div>
                <a
                  href="https://yourportfolio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-notion-600 dark:hover:text-notion-400 transition-colors"
                >
                  yourportfolio.com
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-notion-100 dark:bg-notion-900/30 rounded-full">
                  <SafeIcon icon={FiLinkedin} className="w-5 h-5 text-notion-600 dark:text-notion-400" />
                </div>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-notion-600 dark:hover:text-notion-400 transition-colors"
                >
                  linkedin.com/in/yourusername
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-notion-100 dark:bg-notion-900/30 rounded-full">
                  <SafeIcon icon={FiGithub} className="w-5 h-5 text-notion-600 dark:text-notion-400" />
                </div>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-notion-600 dark:hover:text-notion-400 transition-colors"
                >
                  github.com/yourusername
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Available for freelance work and full-time opportunities. Feel free to reach out for collaborations or inquiries!
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">The Vision</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Zen Tasks was born from the frustration of over-complicated task management tools. We believe that productivity apps should enhance your workflow, not complicate it. Our mission is to create a tool that gets out of your way and lets you focus on what really matters.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Every feature in Zen Tasks is intentionally designed with simplicity and effectiveness in mind. From the clean, distraction-free interface to the powerful keyboard shortcuts, everything serves the purpose of helping you stay organized and productive.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-notion-100 dark:bg-notion-900/30 rounded-lg">
                    <SafeIcon icon={feature.icon} className="w-5 h-5 text-notion-600 dark:text-notion-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}

            {/* PWA Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 bg-notion-100 dark:bg-notion-900/30 rounded-lg">
                  <SafeIcon icon={FiSmartphone} className="w-5 h-5 text-notion-600 dark:text-notion-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Installable App
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Install Zen Tasks as a Progressive Web App on your device for offline use and quick access from your home screen
              </p>
            </motion.div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Technical Implementation</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Zen Tasks is built as a modern single-page application using React 18 with a focus on performance, accessibility, and user experience. The application follows React best practices including hooks, context API for state management, and component composition patterns.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technology Stack</h3>
            <div className="space-y-3">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-center w-2 h-2 bg-notion-600 dark:bg-notion-400 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{tech.name}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">— {tech.purpose}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Design Philosophy</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Minimal but Powerful</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We believe in the power of simplicity. Every UI element serves a purpose, and every feature is designed to enhance productivity without adding complexity.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Accessibility First</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Zen Tasks is built with accessibility in mind, featuring full keyboard navigation, proper contrast ratios, and semantic HTML structure.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance Optimized</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  The application is optimized for speed with efficient React patterns, minimal re-renders, and lightweight dependencies.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <div className="bg-gradient-to-r from-notion-50 to-notion-100 dark:from-notion-900/20 dark:to-notion-800/20 rounded-xl p-8">
            <SafeIcon icon={FiTrendingUp} className="w-12 h-12 text-notion-600 dark:text-notion-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Continuous Improvement
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Zen Tasks is continuously evolving based on user feedback and modern web standards. We're committed to maintaining a balance between simplicity and functionality while adding features that truly enhance productivity.
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default AboutPage;