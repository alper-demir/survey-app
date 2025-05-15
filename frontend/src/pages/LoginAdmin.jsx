import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginAdmin = () => {

    const URL = import.meta.env.VITE_SERVER_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // const isAdmin = localStorage.getItem("isAdmin") === "true";
    // if (isAdmin) {
    //     return <Navigate to="/admin" />;
    // }

    const token = localStorage.getItem("token");

    const checkAuthStatus = async () => {
        if (token) {
            const response = await fetch(`${URL}/api/auth/validate-token`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
            console.log(data);

            if (response.ok && data.valid && data.success) {
                console.log(data);
                navigate("/admin");
            }
        } else {
            return <Navigate to="/" />;
        }
    }

    useEffect(() => {
        checkAuthStatus();
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${URL}/api/auth/admin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log(data);


            if (response.ok) {
                localStorage.setItem("isAdmin", "true");
                toast.success("Giriş başarılı! Admin paneline yönlendiriliyorsunuz...");
                localStorage.setItem("token", data.token);
                navigate("/admin");
            } else {
                toast.error(data.message || "E-posta veya şifre yanlış!");
            }
        } catch (err) {
            console.error("Giriş sırasında hata oluştu:", err);
            toast.error("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="max-w-md w-full bg-white shadow-sm rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                    Admin Giriş
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium text-sm mb-2">
                            E-posta
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-posta adresinizi giriniz"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium text-sm mb-2">
                            Şifre
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şifrenizi giriniz"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                            </button>
                        </div>
                        <div className="text-right mt-2">
                            <a
                                href="#"
                                className="text-sm text-blue-500 hover:text-blue-700 hover:underline font-semibold"
                                onClick={(e) => e.preventDefault()}
                            >
                                Şifremi Unuttum
                            </a>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-3 rounded-lg font-medium text-sm transition-colors duration-300 cursor-pointer"
                        >
                            Giriş Yap
                        </button>
                    </div>
                </form>
            </div>
            <div className="absolute right-10 bottom-10"><button type="text" className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg font-medium text-sm transition-colors duration-300 cursor-pointer">Uygulamaya dön</button></div>
        </div>
    );
};

export default LoginAdmin;