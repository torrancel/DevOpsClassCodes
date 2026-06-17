import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";
import DoctorsLanding from "@/pages/DoctorsLanding";
import AttorneysLanding from "@/pages/AttorneysLanding";
import TeachersLanding from "@/pages/TeachersLanding";
import ManagersLanding from "@/pages/ManagersLanding";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/doctors" element={<DoctorsLanding />} />
                    <Route path="/attorneys" element={<AttorneysLanding />} />
                    <Route path="/teachers" element={<TeachersLanding />} />
                    <Route path="/managers" element={<ManagersLanding />} />
                </Routes>
            </BrowserRouter>
            <Toaster
                position="bottom-right"
                theme="dark"
                toastOptions={{
                    style: {
                        background: "#110820",
                        color: "#F4EEFF",
                        border: "1px solid rgba(138,77,255,0.3)",
                        fontFamily: "Space Grotesk, sans-serif",
                    },
                }}
            />
        </div>
    );
}

export default App;
