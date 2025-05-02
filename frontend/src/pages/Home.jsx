import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import toast from "react-hot-toast";

const formatDate = (dateString) => {
    if (!dateString) return "Bilinmeyen";
    const date = new Date(dateString);
    return date.toLocaleString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    return now > expiryDate;
};

function Home() {
    const [surveys, setSurveys] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0); // Toplam anket sayısı
    const [animationParent] = useAutoAnimate();
    const pageSize = 15;

    const fetchSurveys = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/surveys?page=${currentPage}&size=${pageSize}`);
            const data = await response.json();
            setSurveys(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0); // Toplam anket sayısını al
            console.log(data);
        } catch (err) {
            console.error("Anketler yüklenemedi:", err);
            toast.error("Anketler yüklenemedi. Bir hata oluştu.");
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Başlangıç ve bitiş indekslerini hesapla
    const startIndex = currentPage * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6" ref={animationParent}>
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Tüm Anketler</h2>
                {surveys.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm sm:text-base">Henüz anket bulunmamaktadır.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" ref={animationParent}>
                            {surveys.map((survey) => {
                                const surveyExpired = isExpired(survey.expiresAt);
                                const totalVotes = survey.options.reduce(
                                    (sum, option) => sum + option.voteCount,
                                    0
                                );
                                const isActiveAndNotExpired = survey.active && !surveyExpired;

                                return (
                                    <div
                                        key={survey.id}
                                        className="bg-white shadow-sm rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-300 flex flex-col hover:scale-105"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                                                {survey.title}
                                            </h2>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${isActiveAndNotExpired
                                                    ? "bg-green-100 text-green-700"
                                                    : surveyExpired
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {isActiveAndNotExpired
                                                    ? "Aktif"
                                                    : surveyExpired
                                                        ? "Sonlandı"
                                                        : "Pasif"}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-grow">
                                            {survey.description}
                                        </p>
                                        <div className="text-xs text-gray-500 mb-3 space-y-1">
                                            <p>
                                                Oluşturulma: <span className="font-medium">{formatDate(survey.createdAt)}</span>
                                            </p>
                                            <p>
                                                Geçerlilik: <span className="font-medium">{formatDate(survey.expiresAt)}</span>
                                            </p>
                                            <p>
                                                Toplam Oy: <span className="font-medium">{totalVotes}</span>
                                            </p>
                                        </div>
                                        {isActiveAndNotExpired ? (
                                            <Link
                                                to={`/survey/${survey.slug}`}
                                                className="inline-block w-full text-center bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-colors text-white px-4 py-2 rounded-lg font-medium text-sm"
                                            >
                                                Şimdi Oy Ver
                                            </Link>
                                        ) : surveyExpired && survey.publicResult ? (
                                            <Link
                                                to={`/survey/${survey.slug}`}
                                                className="inline-block w-full text-center bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 transition-colors text-white px-4 py-2 rounded-lg font-medium text-sm"
                                            >
                                                Sonuçları Görüntüle
                                            </Link>
                                        ) : (
                                            <button
                                                disabled
                                                className="inline-block w-full text-center bg-gray-200 text-gray-500 px-4 py-2 rounded-lg font-medium text-sm cursor-not-allowed"
                                            >
                                                Anket Kapalı
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Bölümü (Eski Hali) */}
                        {totalPages > 0 && (
                            <div className="mt-8">
                                <div className="text-sm text-gray-700 mb-4">
                                    Gösteriliyor: {startIndex} - {endIndex} / Toplam: {totalElements} anket
                                </div>
                                {totalPages > 1 && (
                                    <nav className="flex justify-center" aria-label="Pagination">
                                        <ul className="inline-flex items-center -space-x-px">
                                            <li>
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 0}
                                                    className={`cursor-pointer px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </li>
                                            {[...Array(totalPages).keys()].map((page) => (
                                                <li key={page}>
                                                    <button
                                                        onClick={() => handlePageChange(page)}
                                                        className={`cursor-pointer px-3 py-2 leading-tight border border-gray-300 ${currentPage === page
                                                            ? "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                                                            : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                                                            }`}
                                                    >
                                                        {page + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li>
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages - 1}
                                                    className={`cursor-pointer px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === totalPages - 1 ? "cursor-not-allowed opacity-50" : ""}`}
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="currentColor"
                                                        viewBox="0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;