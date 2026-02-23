import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const mailLink = 'mailto:ratanchowdhury169@gmail.com';
  const fbLink = 'https://www.facebook.com/ratanchowdhury360';

  return (
    <footer className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-t-3xl 
                       py-12 md:py-16 lg:py-20 px-6 md:px-10">

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">

        {/* Navigation Links */}
        <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 
                        text-base md:text-lg font-medium">
          <a href="/" className="hover:text-gray-200 transition-colors duration-300">
            Home
          </a>
          <a href={mailLink} className="hover:text-gray-200 transition-colors duration-300">
            Contact
          </a>
          <a href="/#about" className="hover:text-gray-200 transition-colors duration-300">
            About
          </a>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-6 md:gap-8">

          {/* Email Icon */}
          <a
            href={mailLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 hover:text-gray-200 transition-all duration-300"
            title="Email"
            aria-label="Email"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="md:w-6 md:h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>

          {/* Facebook Icon */}
          <a
            href={fbLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 hover:text-gray-200 transition-all duration-300"
            title="Facebook"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="md:w-6 md:h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>

        </div>

        {/* Copyright */}
        <p className="text-sm md:text-base text-white/80">
          © {currentYear} Find Iftar Spot. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;