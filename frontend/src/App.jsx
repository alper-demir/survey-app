import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateSurvey from "./pages/CreateSurvey";
import VotingPage from "./pages/VoteSurvey";
import MainLayout from "./layouts/MainLayout";
import ToasterProvider from "./components/ToasterProvider";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/create" element={<CreateSurvey />} />
                    <Route path="/survey/:slug" element={<VotingPage />} />
                </Route>
            </Routes>
            <ToasterProvider />
        </>

    );
}

export default App;