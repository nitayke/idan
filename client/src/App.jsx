import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { ThemeProvider, createTheme } from "@mui/material";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import Signup from "./pages/Signup";
import { OpenResearch } from "./pages/OpenResearch";
import "react-toastify/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";
import { BadProduct } from "./pages/BadProduct";
import { ResponsiveAppBar } from "./components/ResponsiveAppBar";
import { AddTasks } from "./pages/AddTasks";
import { MyTasks } from "./pages/MyTasks";
import { MyResearches } from "./pages/MyResearches";
import { Conclusions } from "./pages/Conclusions";
import { StartProduction } from "./pages/StartProduction";
import { OpenApplication } from "./pages/OpenApplication";
import { AllApplications } from "./pages/AllApplications";
import { Statistics } from "./pages/Statistics";

const theme = createTheme({
    typography: {
        allVariants: {
            fontFamily: "Heebo",
            textTransform: "none",
        },
    },
    direction: "rtl",
});

const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <ResponsiveAppBar />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<MyTasks />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/open-app" element={<OpenApplication />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route
                            path="/applications"
                            element={<AllApplications />}
                        />
                        <Route
                            path="/start-production"
                            element={<StartProduction />}
                        />
                        <Route path="/bad-product" element={<BadProduct />} />
                        <Route
                            path="/add-tasks/:researchId"
                            element={<AddTasks />}
                        />
                        <Route
                            path="/my-researches"
                            element={<MyResearches />}
                        />
                        <Route
                            path="/open-research"
                            element={<OpenResearch />}
                        />
                        <Route
                            path="/start-prod"
                            element={<StartProduction />}
                        />
                        <Route
                            path="/conclusions/:research_name"
                            element={<Conclusions />}
                        />
                    </Routes>
                </BrowserRouter>
                <ToastContainer rtl style={{ fontFamily: "Heebo" }} />
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;
