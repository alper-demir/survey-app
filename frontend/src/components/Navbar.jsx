import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg sticky top-0 z-50 backdrop-blur-md w-full">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="text-lg sm:text-xl font-bold tracking-tight hover:scale-105 transition-transform duration-300"
                >
                    SurveyApp
                </Link>
                <Link
                    to={location.pathname === "/create" ? "/" : "/create"}
                    className="flex items-center gap-1.5 bg-transparent border border-white/80 text-white px-3 py-1.5 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300 font-medium text-sm"
                >
                    {location.pathname === "/create" ? (
                        "Anketlere Dön"
                    ) : (
                        <>
                            <FaPlus className="h-4 w-4" />
                            Anket Oluştur
                        </>
                    )}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;