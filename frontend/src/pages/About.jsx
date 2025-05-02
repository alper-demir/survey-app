import { Link } from "react-router-dom";

function About() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-xl mt-6 sm:mt-8">
                {/* Başlık */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Hakkında</h1>

                {/* Giriş */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                    SurveyApp, kullanıcıların kolayca anket oluşturup paylaşabileceği modern bir platformdur. Amacımız, anket oluşturmayı hızlı, basit ve kullanıcı dostu bir deneyime dönüştürmek.
                </p>

                {/* Özellikler */}
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Neler Sunuyoruz?</h2>
                    <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1">
                        <li>Kolay ve hızlı anket oluşturma</li>
                        <li>Çoklu seçim ve sonuç paylaşımı seçenekleri</li>
                        <li>Modern ve kullanıcı dostu arayüz</li>
                        <li>Esnek sonlanma tarihi ayarları</li>
                    </ul>
                </div>

                <Link
                    to="/create"
                    className="inline-block w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-colors text-white p-2 sm:p-2.5 rounded-lg font-medium text-sm text-center"
                >
                    Şimdi Anket Oluştur
                </Link>
            </div>
        </div>
    );
}

export default About;