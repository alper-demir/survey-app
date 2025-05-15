import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaSort, FaSortAmountDownAlt, FaSortAmountDown } from "react-icons/fa";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const AdminPanel = () => {

    const navigate = useNavigate();

    const [overview, setOverview] = useState(null);
    const [surveys, setSurveys] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({
        isActive: "",
        isExpired: "",
        isMultipleChoice: "",
        isPublicResult: "",
        title: "",
        sortBy: "createdAt",
        sortDir: "desc",
    });

    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
        toast.error("Bu sayfaya erişim yetkiniz yok!");
        return <Navigate to="/" />;
    }

    const getSurveyStatus = (survey) => {
        if (!survey || !survey.expiresAt) {
            return "Bilinmeyen";
        }

        const now = new Date();
        const expiresAt = new Date(survey.expiresAt);

        if (!survey.active) {
            return "Pasif";
        } else if (expiresAt < now) {
            return "Süresi Dolan";
        } else {
            return "Aktif";
        }
    };

    const fetchOverview = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/admin/overview", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes

            if (response.status === 401 || response.status === 403) {
                toast.error("Oturum süresi dolmuş veya yetkisiz işlem.");
                navigate("/");
                return;
            }

            if(response.status === 500){
                navigate("/");
                return;
            }

            if (!response.ok) {
                toast.error("Genel istatistikler alınamadı.");
                return;
            }

>>>>>>> Stashed changes
            const data = await response.json();
            setOverview(data);
        } catch (err) {
            console.error("Genel istatistikler yüklenemedi:", err);
            toast.error("Genel istatistikler yüklenemedi.");
        }
    };

    const fetchSurveys = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                size: pageSize,
                sortBy: filters.sortBy,
                sortDir: filters.sortDir,
                ...(filters.isActive !== "" && { isActive: filters.isActive }),
                ...(filters.isExpired !== "" && { isExpired: filters.isExpired }),
                ...(filters.isMultipleChoice !== "" && { isMultipleChoice: filters.isMultipleChoice }),
                ...(filters.isPublicResult !== "" && { isPublicResult: filters.isPublicResult }),
                ...(filters.title && { title: filters.title }),
            });

            const response = await fetch(`http://localhost:8080/api/admin/surveys?${queryParams}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
<<<<<<< Updated upstream
=======

            if (response.status === 401 || response.status === 403) {
                return;
            }

            if(response.status === 500){
                return;
            }

            if (!response.ok) {
                toast.error("Anketler alınamadı.");
                setSurveys([]);
                return;
            }

>>>>>>> Stashed changes
            const data = await response.json();
            console.log(data);
            if(data.status === 403){
                toast.error("Erişim yetkiniz yok");
                navigate("/")
                
            }
            setSurveys(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            console.error("Anketler yüklenemedi:", err);
            toast.error("Anketler yüklenemedi.");
            setSurveys([]);
        }
    };

    const toggleSurveyStatus = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/surveys/${id}/toggle-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                toast.success("Anket durumu değiştirildi!");
                fetchSurveys();
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Anket durumu değiştirilemedi.");
            }
        } catch (err) {
            console.error("Anket durumu değiştirilemedi:", err);
            toast.error("Anket durumu değiştirilemedi.");
        }
    };


    useEffect(() => {
        fetchOverview();
        fetchSurveys();
    }, [currentPage, pageSize, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(0);
    };

    // Sıralama yönünü değiştirme fonksiyonu
    const toggleSortDirection = () => {
        setFilters((prev) => ({
            ...prev,
            sortDir: prev.sortDir === "desc" ? "asc" : "desc",
        }));
        setCurrentPage(0);
    };

    const dailyVotesData = overview?.dailyVotes
        ? Object.entries(overview.dailyVotes).map(([date, votes]) => ({
            date,
            votes,
        }))
        : [];

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">Admin Paneli</h1>

            {/* Genel İstatistikler */}
            {overview && (
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">Genel İstatistikler</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Toplam Anket</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{overview.totalSurveys}</p>
                        </div>
                        <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Aktif Anket</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-green-600">{overview.activeSurveys}</p>
                        </div>
                        <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Kapalı Anket</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-red-600">{overview.closedSurveys}</p>
                        </div>
                        <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Toplam Oy</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{overview.totalVotes}</p>
                        </div>
                        <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Farklı Oy Veren</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{overview.distinctVoters}</p>
                        </div>
                        <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Herkese Açık Anket</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-teal-600">{overview.publicSurveys}</p>
                        </div>
                        <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Çoklu Seçim Anket</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-orange-600">{overview.multipleChoiceSurveys}</p>
                        </div>
                    </div>

                    {/* Günlük Oy Dağılımı Grafiği */}
                    {dailyVotesData.length > 0 && (
                        <div className="mt-6 sm:mt-8 bg-white shadow-md rounded-2xl p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Günlük Oy Dağılımı</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={dailyVotesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="votes" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}

            {/* Anket Tablosu ve Filtreleme */}
            <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">Anketler</h2>

                {/* Filtreleme Formu */}
                <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium text-sm mb-1">Başlık</label>
                            <input
                                type="text"
                                name="title"
                                value={filters.title}
                                onChange={handleFilterChange}
                                placeholder="Anket başlığı giriniz"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium text-sm mb-1">Aktiflik</label>
                            <select
                                name="isActive"
                                value={filters.isActive}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            >
                                <option value="">Tümü</option>
                                <option value="true">Aktif</option>
                                <option value="false">Pasif</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium text-sm mb-1">Süre Durumu</label>
                            <select
                                name="isExpired"
                                value={filters.isExpired}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            >
                                <option value="">Tümü</option>
                                <option value="true">Süresi Dolan</option>
                                <option value="false">Süresi Dolmayan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium text-sm mb-1">Çoklu Seçim</label>
                            <select
                                name="isMultipleChoice"
                                value={filters.isMultipleChoice}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            >
                                <option value="">Tümü</option>
                                <option value="true">Evet</option>
                                <option value="false">Hayır</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium text-sm mb-1">Herkese Açık</label>
                            <select
                                name="isPublicResult"
                                value={filters.isPublicResult}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            >
                                <option value="">Tümü</option>
                                <option value="true">Evet</option>
                                <option value="false">Hayır</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Anket Tablosu */}
                <div className="bg-white shadow-md rounded-2xl overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-[20%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                                <th className="w-[20%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                <th className="w-[10%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam Oy</th>
                                <th className="w-[15%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center gap-1">
                                        <span>Oluşturulma</span>
                                        <button onClick={toggleSortDirection} className="focus:outline-none cursor-pointer">
                                            {filters.sortDir === "desc" ? (
                                                <FaSortAmountDown className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                            ) : filters.sortDir === "asc" ? (
                                                <FaSortAmountDownAlt className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                            ) : (
                                                <FaSort className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                            )}
                                        </button>
                                    </div>
                                </th>
                                <th className="w-[15%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bitiş</th>
                                <th className="w-[10%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                <th className="w-[10%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Herkese Açık</th>
                                <th className="w-[10%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çoklu Seçim</th>
                                <th className="w-[10%] px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eylem</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {surveys.map((survey) => {
                                const status = getSurveyStatus(survey);
                                const isActive = survey.active && status !== "Süresi Dolan";
                                return (
                                    <tr key={survey.id}>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 truncate" title={survey.title}>
                                            {survey.title}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 truncate" title={survey.slug}>
                                            {survey.slug}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                                            {survey.totalVotes}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                                            {new Date(survey.createdAt).toLocaleString("tr-TR")}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                                            {survey.expiresAt ? new Date(survey.expiresAt).toLocaleString("tr-TR") : "Bilinmeyen"}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                                            {status === "Aktif" && (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Aktif</span>
                                            )}
                                            {status === "Süresi Dolan" && (
                                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Süresi Dolan</span>
                                            )}
                                            {status === "Pasif" && (
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">Pasif</span>
                                            )}
                                            {status === "Bilinmeyen" && (
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Bilinmeyen</span>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                                            {survey.publicResult ? "Evet" : "Hayır"}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                                            {survey.multipleChoice ? "Evet" : "Hayır"}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isActive}
                                                    onChange={() => toggleSurveyStatus(survey.id)}
                                                    disabled={status === "Süresi Dolan"}
                                                    className="sr-only peer"
                                                />
                                                <div
                                                    className={`w-11 h-6 bg-gray-200 rounded-full peer 
                                            ${status === "Süresi Dolan" ? "opacity-50 cursor-not-allowed" : "peer-checked:bg-indigo-600"} 
                                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                                            after:h-5 after:w-5 after:transition-all duration-500`}
                                                ></div>
                                            </label>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <label className="text-sm text-gray-700 mr-2">Sayfa Başına:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(0);
                            }}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                            disabled={currentPage === 0}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 transition-all cursor-pointer"
                        >
                            Önceki
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                            disabled={currentPage === totalPages - 1}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 transition-all cursor-pointer"
                        >
                            Sonraki
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;