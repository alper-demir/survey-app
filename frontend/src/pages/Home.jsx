import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import toast from "react-hot-toast";

const formatDate = (dateString) => {
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
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    return now > expiryDate;
};

function Home() {
    const [surveys, setSurveys] = useState([]);
    const [animationParent] = useAutoAnimate();

    useEffect(() => {
        fetch("http://localhost:8080/api/surveys")
            .then((res) => res.json())
            .then((data) => {
                setSurveys(data);
                console.log(data);
            })
            .catch((err) => {
                console.error("Anketler yüklenemedi:", err);
                toast.error("Anketler yüklenemedi. Bir hata oluştu.");
            });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Tüm Anketler</h2>
            {surveys.length === 0 ? (
                <p className="text-center text-gray-500 text-base sm:text-lg">Henüz anket bulunmamaktadır.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" ref={animationParent}>
                    {surveys.map((survey) => {
                        const surveyExpired = isExpired(survey.expiresAt);
                        const totalVotes = survey.options.reduce(
                            (sum, option) => sum + option.voteCount,
                            0
                        );
                        return (
                            <div
                                key={survey.id}
                                className="bg-white shadow-md rounded-2xl p-4 sm:p-6 hover:shadow-xl transition transform hover:scale-105"
                            >
                                <div className="flex justify-between items-center mb-3 sm:mb-4">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1">
                                        {survey.title}
                                    </h2>
                                    <span
                                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${survey.active && !surveyExpired
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {survey.active && !surveyExpired
                                            ? "Aktif"
                                            : surveyExpired
                                                ? "Anket sonlandı"
                                                : "Pasif"}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-3 sm:mb-4">
                                    {survey.description}
                                </p>
                                <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
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
                                <Link
                                    to={`/survey/${survey.slug}`}
                                    className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-colors text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base"
                                >
                                    Şimdi Oy Ver
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Home;