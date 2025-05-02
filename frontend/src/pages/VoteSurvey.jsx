import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaSync } from "react-icons/fa";
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

const VoteSurvey = () => {
    const { slug } = useParams();
    const [survey, setSurvey] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [voted, setVoted] = useState(false);
    const [animationParent] = useAutoAnimate();

    const fetchSurveyData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/surveys/${slug}`);
            const data = await response.json();
            setSurvey(data);
        } catch (err) {
            console.error("Anket yüklenemedi:", err);
            toast.error("Anket yüklenemedi. Bir hata oluştu.");
        }
    };

    useEffect(() => {
        fetchSurveyData();
    }, [slug]);

    const handleOptionChange = (optionId) => {
        if (survey.multipleChoice) {
            setSelectedOptions((prev) =>
                prev.includes(optionId)
                    ? prev.filter((id) => id !== optionId)
                    : [...prev, optionId]
            );
        } else {
            setSelectedOptions([optionId]);
        }
    };

    const handleVote = async () => {
        if (selectedOptions.length === 0) {
            toast.error("Lütfen en az bir seçenek seçiniz!");
            return;
        }

        const url = survey.multipleChoice
            ? "http://localhost:8080/api/votes/multi"
            : `http://localhost:8080/api/votes/${selectedOptions[0]}`;
        const body = survey.multipleChoice ? { optionIds: selectedOptions } : null;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: body ? JSON.stringify(body) : null,
            });

            if (response.ok) {
                setVoted(true);
                toast.success("Oyunuz başarıyla kaydedildi!"); // Başarı bildirimi
                await fetchSurveyData();
            } else {
                toast.error("Daha önce oy kullandınız.");
                setSelectedOptions([]);
                setVoted(true);
            }
        } catch (error) {
            toast.error("Daha önce oy kullandınız.");
            console.log(error);
        }
    };

    const handleRefresh = () => {
        fetchSurveyData();
        toast("Veriler yenilendi.", {
            icon: "🔄", // Yenileme ikonu
            style: {
                background: "#E0F7FA",
                color: "#006064",
            },
        }); // Bilgi bildirimi
    };

    if (!survey) return <div className="text-center text-gray-500 mt-10 text-base sm:text-lg">Yükleniyor...</div>;

    const totalVotes = survey.options.reduce((sum, option) => sum + option.voteCount, 0);
    const surveyExpired = isExpired(survey.expiresAt);
    const canVote = survey.active && !surveyExpired && !voted;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 bg-white shadow-lg rounded-xl mt-6 sm:mt-8">
                {/* Üst Bilgi Bölümü */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                        <p>
                            Oluşturulma: <span className="font-medium">{formatDate(survey.createdAt)}</span>
                        </p>
                        <p>
                            Geçerlilik: <span className="font-medium">{formatDate(survey.expiresAt)}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${survey.active && !surveyExpired
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {survey.active && !surveyExpired
                                ? "Aktif"
                                : surveyExpired
                                    ? "Sonlandı"
                                    : "Pasif"}
                        </span>
                        {surveyExpired && (
                            <span className="text-red-500 text-xs font-medium">Oy kullanılamaz</span>
                        )}
                    </div>
                </div>

                {/* Başlık ve Yenile Butonu */}
                {!surveyExpired && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{survey.title}</h1>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition-all font-medium text-sm cursor-pointer"
                        >
                            <FaSync className="h-4 w-4" />
                            Yenile
                        </button>
                    </div>
                )}

                {/* Açıklama */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                    {survey.description}
                </p>

                {/* Toplam Oy ve Çoklu Seçim Bilgisi */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <p className="text-gray-500 text-xs sm:text-sm">
                        Toplam Kullanılan Oy: <span className="font-medium">{totalVotes}</span>
                    </p>
                    <p className="text-blue-600 text-xs sm:text-sm font-medium">
                        {survey.multipleChoice
                            ? "Birden fazla seçenek işaretlenebilir."
                            : "Yalnızca tek seçenek işaretlenebilir."}
                    </p>
                </div>

                {/* Seçenekler */}
                <div className="flex flex-col gap-2 sm:gap-3" ref={animationParent}>
                    {survey.options.map((option) => {
                        const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                        return (
                            <div
                                key={option.id}
                                className="flex flex-col p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
                            >
                                <label className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                                    <div className="flex items-center">
                                        <input
                                            type={survey.multipleChoice ? "checkbox" : "radio"}
                                            name={survey.multipleChoice ? `option-${option.id}` : "vote"}
                                            value={option.id}
                                            checked={
                                                survey.multipleChoice
                                                    ? selectedOptions.includes(option.id)
                                                    : selectedOptions[0] === option.id
                                            }
                                            onChange={() => handleOptionChange(option.id)}
                                            disabled={!canVote}
                                            className="mr-2 accent-blue-500 h-4 w-4"
                                        />
                                        <span className="text-gray-700 text-sm sm:text-base">{option.text}</span>
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {option.voteCount} oy ({percentage.toFixed(1)}%)
                                    </div>
                                </label>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                    <div
                                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Oy Ver Butonu veya Mesaj */}
                {canVote ? (
                    <button
                        onClick={handleVote}
                        className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2.5 sm:p-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors font-medium text-sm sm:text-base cursor-pointer"
                    >
                        Oy Ver
                    </button>
                ) : (
                    <p className="mt-4 sm:mt-6 text-center text-gray-500 text-sm font-medium">
                        {voted
                            ? "Zaten oy kullandınız."
                            : surveyExpired
                                ? "Bu anket sonlandı."
                                : "Bu anket şu anda aktif değil."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default VoteSurvey;