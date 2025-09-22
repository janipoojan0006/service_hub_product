
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} ServiceHub. All rights reserved.</p>
      </div>
    </footer>
  );
};
