import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 shadow-xl sticky top-0 z-50 backdrop-blur-md w-full">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="text-xl sm:text-2xl font-extrabold tracking-tight hover:scale-105 transition-transform duration-300"
                >
                    SurveyApp
                </Link>
                <Link
                    to={location.pathname === "/create" ? "/" : "/create"}
                    className="flex items-center gap-2 bg-transparent border border-white text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300 font-semibold text-sm sm:text-base"
                >
                    {location.pathname === "/create" ? (
                        "Anketlere Dön"
                    ) : (
                        <>
                            <FaPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                            Anket Oluştur
                        </>
                    )}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;