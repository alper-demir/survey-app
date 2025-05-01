import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="bg-gradient-to-r from-blue-500 via-yellow-100 to-orange-200 text-white px-4 py-2 sm:px-6 sm:py-3 flex justify-between items-center shadow-lg">
            <Link to="/" className="text-xl sm:text-2xl font-bold">
                SurveyApp
            </Link>
            <Link
                to={location.pathname === "/create" ? "/" : "/create"}
                className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:bg-gray-100 transition-all font-semibold text-sm sm:text-base"
            >
                {location.pathname === "/create" ? "Anketlere Dön" : (<><FaPlus />Anket Oluştur</>)}
            </Link>
        </nav>
    );
};

export default Navbar;