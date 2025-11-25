import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import SecurityContextProvider from "./context/SecurityContextProvider.tsx"
import {SecuredPage} from "./pages/SecuredPage.tsx"
import {RouteGuard} from "./components/RouteGuard.tsx"
import {BrowserRouter, Navigate, Route, Routes} from "react-router"
import {PublicPage} from "./pages/PublicPage.tsx"
import {MainLayout} from "./components/layout/MainLayout.tsx";
import {StorePage} from "./pages/StorePage.tsx";

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SecurityContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/publicpage" element={<PublicPage />} />
                        <Route element={<RouteGuard><MainLayout /></RouteGuard>}>
                            <Route path="/store" element={<StorePage />} />
                            <Route path="/securedpage" element={<SecuredPage />} />

                            <Route path="/" element={<Navigate to="/store" />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/publicpage" />} />
                    </Routes>
                </BrowserRouter>
            </SecurityContextProvider>
        </QueryClientProvider>
    )
}

export default App