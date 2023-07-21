import React, { useState } from "react";

import { INavItem } from "../../../../typings";

const Navigation = ({
  navItems,
  activePage,
  setActivePage,
}: {
  navItems: Record<string, INavItem>;
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuChange = (page: string) => {
    setActivePage(page);
  };

  return (
    <nav className="py-6">
      <div className="flex justify-between items-center">
        <button className="lg:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <div className="hidden lg:flex space-x-4">
          {Object.entries(navItems).map(([key, value], id) => {
            return (
              <a
                key={id}
                onClick={() => handleMenuChange(key)}
                className={`text-xl font-bold text-gray-700 cursor-pointer ${
                  key === activePage
                    ? "underline underline-offset-4 decoration-blue-800 decoration-2"
                    : ""
                }`}
              >
                {value.name}
              </a>
            );
          })}
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col mt-4 space-y-2 lg:hidden">
          {Object.entries(navItems).map(([key, value]) => {
            return (
              <a
                key={key}
                onClick={() => handleMenuChange(key)}
                className="text-gray-700"
              >
                {value.name}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
