import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaSync } from "react-icons/fa";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
            console.log(data);
            
        } catch (err) {
            console.error("Anket yüklenemedi:", err);
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
            alert("Lütfen en az bir seçenek seçiniz!");
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
                alert("Oyunuz kaydedildi!");
                await fetchSurveyData(); // Oy verdikten sonra verileri güncelle
            } else {
                alert("Daha önce oy kullandınız");
                setSelectedOptions([]);
                setVoted(true);
            }
        } catch (error) {
            alert("Daha önce oy kullandınız");
            console.log(error);
        }
    };

    const handleRefresh = () => {
        fetchSurveyData();
    };

    if (!survey) return <div className="text-center text-gray-500 mt-10 text-base sm:text-lg">Yükleniyor...</div>;

    const totalVotes = survey.options.reduce((sum, option) => sum + option.voteCount, 0);
    const surveyExpired = isExpired(survey.expiresAt);
    const canVote = survey.active && !surveyExpired && !voted;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white shadow-xl rounded-2xl mt-8 sm:mt-12" ref={animationParent}>
            {/* Anket Durum ve Tarih Bilgileri */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div>
                    <p className="text-gray-500 text-xs sm:text-sm">
                        Oluşturulma: <span className="font-medium">{formatDate(survey.createdAt)}</span>
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm">
                        Geçerlilik: <span className="font-medium">{formatDate(survey.expiresAt)}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${survey.active && !surveyExpired
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {survey.active && !surveyExpired
                            ? "Aktif"
                            : surveyExpired
                                ? "Geçerlilik Süresi Doldu"
                                : "Pasif"}
                    </span>
                    {surveyExpired && (
                        <span className="text-red-500 text-xs sm:text-sm font-medium">Oy kullanılamaz</span>
                    )}
                </div>
            </div>

            {/* Başlık ve Yenile Butonu */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{survey.title}</h1>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all font-semibold text-sm sm:text-base cursor-pointer"
                >
                    <FaSync className="h-4 w-4 sm:h-5 sm:w-5" />
                    Yenile
                </button>
            </div>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">{survey.description}</p>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <p className="text-gray-500 text-xs sm:text-sm">
                    Toplam Kullanılan Oy: <span className="font-medium">{totalVotes}</span>
                </p>
                <p className="text-blue-600 text-xs sm:text-sm font-medium">
                    {survey.multipleChoice
                        ? "Bu anket birden fazla seçeneği işaretlemeye izin veriyor."
                        : "Bu anket yalnızca tek bir seçeneği işaretlemeye izin veriyor."}
                </p>
            </div>

            {/* Seçenekler */}
            <div className="flex flex-col gap-3 sm:gap-4" ref={animationParent}>
                {survey.options.map((option) => {
                    const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                    return (
                        <div
                            key={option.id}
                            className="flex flex-col p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition"
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
                                        className="mr-2 sm:mr-3 accent-blue-500 h-4 w-4 sm:h-5 sm:w-5"
                                    />
                                    <span className="text-gray-700 text-sm sm:text-lg">{option.text}</span>
                                </div>
                                <div className="text-gray-500 text-xs sm:text-sm">
                                    {option.voteCount} oy ({percentage.toFixed(1)}%)
                                </div>
                            </label>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {canVote ? (
                <button
                    onClick={handleVote}
                    className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 sm:p-4 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors font-semibold text-sm sm:text-lg cursor-pointer"
                >
                    Oy Ver
                </button>
            ) : (
                <p className="mt-6 sm:mt-8 text-center text-gray-500 text-sm sm:text-base font-medium">
                    {voted
                        ? "Zaten oy kullandınız."
                        : surveyExpired
                            ? "Bu anketin geçerlilik süresi dolmuş."
                            : "Bu anket şu anda aktif değil."}
                </p>
            )}
        </div>
    );
};

export default VoteSurvey;