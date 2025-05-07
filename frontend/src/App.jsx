import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateSurvey from "./pages/CreateSurvey";
import VotingPage from "./pages/VoteSurvey";
import MainLayout from "./layouts/MainLayout";
import ToasterProvider from "./components/ToasterProvider";
import AdminPanel from './pages/AdminPanel';
import About from "./pages/About";
import LoginAdmin from "./pages/LoginAdmin";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/create" element={<CreateSurvey />} />
                    <Route path="/survey/:slug" element={<VotingPage />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/about" element={<About />} />
                </Route>
                <Route path="/auth/admin" element={<LoginAdmin />} />
            </Routes>
            <ToasterProvider />
        </>

    );
}

export default App;