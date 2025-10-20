import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-gray-900 text-gray-400 text-center">
      &copy; {new Date().getFullYear()} AI Guitar TAB. All rights reserved.
    </footer>
  );
};

export default Footer;
