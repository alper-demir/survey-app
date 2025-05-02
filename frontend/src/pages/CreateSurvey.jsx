import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaCopy } from "react-icons/fa";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import toast from "react-hot-toast";

function CreateSurvey() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [multipleChoice, setMultipleChoice] = useState(false);
    const [publicResult, setPublicResult] = useState(false);
    const [expiresAt, setExpiresAt] = useState("");
    const [optionCount, setOptionCount] = useState(2);
    const navigate = useNavigate();
    const [animationParent] = useAutoAnimate();

    // datetime-local formatına çevir
    const now = new Date(Date.now());
    const minDateTime = now.toISOString().slice(0, 16); // "2025-05-02T15:05" formatına çevirir

    const handleOptionCountBlur = () => {
        if (optionCount < 2) {
            toast.error("En az 2 seçenek eklemelisiniz!");
            setOptionCount(2);
            setOptions(["", ""]);
        } else {
            setOptions(Array(optionCount).fill(""));
        }
    };

    const handleOptionCountChange = (e) => {
        const count = parseInt(e.target.value) || 0;
        setOptionCount(count);
    };

    const addOption = () => {
        setOptions([...options, ""]);
        setOptionCount(optionCount + 1);
    };

    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const removeOption = (index) => {
        if (options.length <= 2) {
            toast.error("En az 2 seçenek olmalı!");
            return;
        }
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        setOptionCount(optionCount - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (options.length < 2) {
            toast.error("En az 2 seçenek eklemelisiniz!");
            return;
        }
        if (options.some((opt) => !opt)) {
            toast.error("Tüm seçenekler dolu olmalıdır!");
            return;
        }

        const selectedDate = new Date(expiresAt);
        const now = new Date();
        if (selectedDate <= now) {
            toast.error("Anketin sona erme tarihi mevcut tarihten daha ileri olmalıdır!");
            return;
        }

        const surveyData = { title, description, options, multipleChoice, publicResult, expiresAt };
        fetch("http://localhost:8080/api/surveys", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(surveyData),
        })
            .then((res) => res.json())
            .then((data) => {
                const surveyLink = `${window.location.origin}/survey/${data.slug}`;
                toast.success(
                    <div className="flex items-center gap-2">
                        <span>Anket başarıyla oluşturuldu!</span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(surveyLink);
                                toast.success("Link kopyalandı!");
                            }}
                            className="flex items-center gap-1 bg-indigo-500 text-white px-2 py-1 rounded-md hover:bg-indigo-600 transition-all cursor-pointer"
                        >
                            <FaCopy className="h-4 w-4" />
                            Linki Kopyala
                        </button>
                    </div>,
                    { duration: 7000 }
                );
                navigate("/");
            })
            .catch((err) => {
                console.error("Anket oluşturulamadı:", err);
                toast.error("Anket oluşturulamadı. Bir hata oluştu.");
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-xl mt-6 sm:mt-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Anket Oluştur</h1>
                <form onSubmit={handleSubmit}>
                    {/* Başlık */}
                    <div className="mb-3 sm:mb-4">
                        <label className="block text-gray-700 font-medium text-xs sm:text-sm mb-1">Başlık</label>
                        <input
                            type="text"
                            placeholder="Anket başlığını giriniz"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            required
                        />
                    </div>

                    {/* Açıklama */}
                    <div className="mb-3 sm:mb-4">
                        <label className="block text-gray-700 font-medium text-xs sm:text-sm mb-1">Açıklama</label>
                        <textarea
                            placeholder="Anket açıklamasını giriniz (isteğe bağlı)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        />
                    </div>

                    {/* Seçenek Sayısı */}
                    <div className="mb-3 sm:mb-4">
                        <label className="block text-gray-700 font-medium text-xs sm:text-sm mb-1">
                            Toplam Kaç Seçenek Eklemek İstiyorsunuz?
                        </label>
                        <input
                            type="number"
                            min="2"
                            value={optionCount}
                            onChange={handleOptionCountChange}
                            onBlur={handleOptionCountBlur}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            required
                        />
                    </div>

                    {/* Seçenekler */}
                    <div className="mb-3 sm:mb-4">
                        <label className="block text-gray-700 font-medium text-xs sm:text-sm mb-1">Seçenekler</label>
                        <div ref={animationParent}>
                            {options.map((opt, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder={`Seçenek ${index + 1}`}
                                        value={opt}
                                        onChange={(e) => updateOption(index, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                        required
                                    />
                                    {index >= 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="text-red-500 hover:text-red-700 transition-all"
                                        >
                                            <FaTrash className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addOption}
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition-all font-medium text-xs"
                        >
                            Seçenek Ekle
                        </button>
                    </div>

                    {/* Çoklu Seçim ve Sonuçlar Herkese Açık */}
                    <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={multipleChoice}
                                onChange={(e) => setMultipleChoice(e.target.checked)}
                                className="mr-2 accent-blue-500 h-4 w-4 cursor-pointer"
                            />
                            <span className="text-gray-700 font-medium text-xs sm:text-sm">Çoklu Seçim</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={publicResult}
                                onChange={(e) => setPublicResult(e.target.checked)}
                                className="mr-2 accent-blue-500 h-4 w-4 cursor-pointer"
                            />
                            <span className="text-gray-700 font-medium text-xs sm:text-sm">Sonuçlar Herkese Açık</span>
                        </label>
                    </div>

                    {/* Sonlanma Tarihi */}
                    <div className="mb-3 sm:mb-4">
                        <label className="block text-gray-700 font-medium text-xs sm:text-sm mb-1">
                            Sonlanma Tarihi
                        </label>
                        <input
                            min={minDateTime}
                            required
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        />
                    </div>

                    {/* Anketi Oluştur Butonu */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-colors text-white p-2 sm:p-2.5 rounded-lg font-medium text-sm cursor-pointer"
                    >
                        Anketi Oluştur
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateSurvey;