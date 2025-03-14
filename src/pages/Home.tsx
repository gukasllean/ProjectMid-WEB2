// HomePage.tsx - A central hub for navigating between different features
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation

interface FeatureCard {
  title: string;
  description: string;
  path: string;
  icon: string;
  color: string;
}

const HomePage: React.FC = () => {
  const features: FeatureCard[] = [
    {
      title: "Product",
      description: "Browse, search, and manage your product catalog with advanced filtering options.",
      path: "/product",
      icon: "shopping-bag",
      color: "bg-blue-500"
    },
    {
      title: "Recipes",
      description: "Discover, create, and save your favorite recipes with detailed instructions.",
      path: "/recipes",
      icon: "book-open",
      color: "bg-green-500"
    },
    {
      title: "Todos",
      description: "Keep track of your tasks with an interactive todo list featuring status tracking.",
      path: "/todos",
      icon: "check-square",
      color: "bg-yellow-500"
    },
    {
      title: "Posts",
      description: "Create and manage blog posts with tags, custom authors, and reader reactions.",
      path: "/posts",
      icon: "file-text",
      color: "bg-purple-500"
    },
    {
      title: "Comments",
      description: "Engage with readers through a robust commenting system for all your content.",
      path: "/comments",
      icon: "message-circle",
      color: "bg-pink-500"
    }
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'shopping-bag':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'book-open':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'check-square':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'file-text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'message-circle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero*/}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              DummyJSON Dashboard
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl">
              A comprehensive demo application showcasing various features built with the DummyJSON API
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* About Section */}
        <section className="mb-16">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This App</h2>
            <p className="text-gray-600 mb-4">
              This dashboard demonstrates a complete TypeScript React application built using the DummyJSON API. Each section 
              showcases different CRUD (Create, Read, Update, Delete) operations and user interface patterns common in modern web applications.
            </p>
            <p className="text-gray-600">
              Explore the various features by clicking on the cards below. Each page demonstrates different data management techniques
              and UI components that you can use in your own projects.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link 
                key={index} 
                to={feature.path}
                className="block group"
              >
                <div className="h-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className={`${feature.color} p-6 flex justify-center text-white`}>
                    <div className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-20 rounded-full">
                      {renderIcon(feature.icon)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                    <div className="mt-4 flex items-center text-indigo-600">
                      <span className="font-medium">Explore</span>
                      <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* API Info Section */}
        <section className="mt-16">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About DummyJSON API</h2>
            <p className="text-gray-600 mb-4">
              This application is powered by <a href="https://dummyjson.com" className="text-indigo-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">DummyJSON</a>, 
              a free and open-source fake API service that provides dummy data for testing and prototyping.
            </p>
            <p className="text-gray-600">
              The API supports various endpoints for products, users, posts, comments, todos, recipes, and more, along with full
              CRUD operations for building realistic application prototypes.
            </p>
          </div>
        </section>
      </main>

      {/*Footer*/}
      <footer className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            Built with TypeScript, React, and Tailwind CSS using the DummyJSON API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;