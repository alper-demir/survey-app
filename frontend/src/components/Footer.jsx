import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 px-4 sm:px-6 py-4 sm:py-6 mt-8">
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                {/* Sol Kısım: Logo ve Kısa Açıklama */}
                <div className="text-center sm:text-left">
                    <Link to="/" className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
                        SurveyApp
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                        Kullanıcı odaklı anket oluşturma platformu.
                    </p>
                </div>

                {/* Sağ Kısım: Bağlantılar */}
                <div className="flex gap-4 sm:gap-6">
                    <Link
                        to="/"
                        className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Ana Sayfa
                    </Link>
                    <Link
                        to="/about"
                        className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Hakkında
                    </Link>
                    <Link
                        to="/create"
                        className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Anket Oluştur
                    </Link>
                </div>
            </div>

            {/* Telif Hakkı */}
            <div className="max-w-2xl mx-auto text-center mt-4 border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} SurveyApp. Tüm hakları saklıdır.
                </p>
            </div>
        </footer>
    );
}

export default Footer;