import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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

    const handleOptionCountChange = (e) => {
        const count = parseInt(e.target.value) || 0;
        setOptionCount(count);
    };

    const handleOptionCountBlur = () => {
        if (optionCount < 2) {
            alert("En az 2 seçenek eklemelisiniz!");
            setOptionCount(2);
            setOptions(["", ""]);
        } else {
            setOptions(Array(optionCount).fill(""));
        }
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
            alert("En az 2 seçenek olmalı!");
            return;
        }
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        setOptionCount(optionCount - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (options.length < 2) {
            alert("En az 2 seçenek eklemelisiniz!");
            return;
        }
        if (options.some((opt) => !opt)) {
            alert("Tüm seçenekler dolu olmalıdır!");
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
                alert("Anket oluşturuldu! Link: " + window.location.origin + "/survey/" + data.slug);
                navigate("/");
            })
            .catch((err) => console.error("Anket oluşturulamadı:", err));
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-2xl mt-6 sm:mt-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-5">Anket Oluştur</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 font-medium text-xs sm:text-sm mb-1">Başlık</label>
                        <input
                            type="text"
                            placeholder="Anket başlığını giriniz"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                            required
                        />
                    </div>
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 font-medium text-xs sm:text-sm mb-1">Açıklama</label>
                        <textarea
                            placeholder="Anket açıklamasını giriniz (isteğe bağlı)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                        />
                    </div>
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 font-medium text-xs sm:text-sm mb-1">
                            Toplam Kaç Seçenek Eklemek İstiyorsunuz?
                        </label>
                        <input
                            type="number"
                            min="2"
                            value={optionCount}
                            onChange={handleOptionCountChange}
                            onBlur={handleOptionCountBlur}
                            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                            required
                        />
                    </div>
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 font-medium text-xs sm:text-sm mb-1">Seçenekler</label>
                        <div ref={animationParent}>
                            {options.map((opt, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder={`Seçenek ${index + 1}`}
                                        value={opt}
                                        onChange={(e) => updateOption(index, e.target.value)}
                                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                                        required
                                    />
                                    {index >= 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="text-red-500 hover:text-red-700 transition-all"
                                        >
                                            <FaTrash className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addOption}
                            className="bg-gray-200 text-gray-700 px-4 sm:px-5 py-1 sm:py-2 rounded-full hover:bg-gray-300 transition-all font-medium text-xs sm:text-sm"
                        >
                            Seçenek Ekle
                        </button>
                    </div>
                    <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
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
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 font-medium text-xs sm:text-sm mb-1">
                            Geçerlilik Süresi
                        </label>
                        <input
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 sm:p-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-semibold text-sm sm:text-base cursor-pointer"
                    >
                        Anketi Oluştur
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateSurvey;