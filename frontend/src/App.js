import "@/App.css";
import "@/i18n";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { BetaProvider } from "@/contexts/BetaContext";
import { AmbienceProvider } from "@/contexts/AmbienceContext";
import Landing from "@/pages/Landing";
import DoctorsLanding from "@/pages/DoctorsLanding";
import AttorneysLanding from "@/pages/AttorneysLanding";
import TeachersLanding from "@/pages/TeachersLanding";
import ManagersLanding from "@/pages/ManagersLanding";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminBeta from "@/pages/AdminBeta";
import AuthCallback from "@/pages/AuthCallback";
import AppDashboard from "@/pages/AppDashboard";
import CheckIn from "@/pages/CheckIn";
import BetaLanding from "@/pages/BetaLanding";
import BetaRedeem from "@/pages/BetaRedeem";
import FounderStory from "@/pages/FounderStory";
import PricingSuccess from "@/pages/PricingSuccess";
import ProtectedRoute from "@/components/ProtectedRoute";
import BetaGate from "@/components/beta/BetaGate";

function AppRouter() {
    const location = useLocation();
    // CRITICAL: Detect session_id during render to win the race with normal routes.
    if (location.hash?.includes("session_id=")) {
        return <AuthCallback />;
    }
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/doctors" element={<DoctorsLanding />} />
            <Route path="/attorneys" element={<AttorneysLanding />} />
            <Route path="/teachers" element={<TeachersLanding />} />
            <Route path="/managers" element={<ManagersLanding />} />
            <Route path="/beta" element={<BetaLanding />} />
            <Route path="/beta/redeem" element={<BetaRedeem />} />
            <Route path="/founder" element={<FounderStory />} />
            <Route path="/pricing/success" element={<PricingSuccess />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/beta" element={<AdminBeta />} />
            <Route
                path="/app"
                element={
                    <ProtectedRoute>
                        <BetaGate>
                            <AppDashboard />
                        </BetaGate>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/app/check-in"
                element={
                    <ProtectedRoute>
                        <BetaGate>
                            <CheckIn />
                        </BetaGate>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <BetaProvider>
                        <AmbienceProvider>
                            <AppRouter />
                        </AmbienceProvider>
                    </BetaProvider>
                </AuthProvider>
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
