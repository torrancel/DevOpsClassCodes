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
                toastOptions={{
                    style: {
                        background: "#FFFFFF",
                        color: "#1A1A1A",
                        border: "1px solid #DCD7C9",
                        fontFamily: "Figtree, sans-serif",
                    },
                }}
            />
        </div>
    );
}

export default App;
