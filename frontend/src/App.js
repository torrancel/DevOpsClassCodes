import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
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
