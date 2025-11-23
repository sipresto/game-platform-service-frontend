import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import SecurityContextProvider from "./context/SecurityContextProvider.tsx"
import {SecuredPage} from "./pages/SecuredPage.tsx"
import {RouteGuard} from "./components/RouteGuard.tsx"
import {BrowserRouter, Navigate, Route, Routes} from "react-router"
import {PublicPage} from "./pages/PublicPage.tsx"

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SecurityContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/securedpage" element={<RouteGuard><SecuredPage/></RouteGuard>}/>
                        <Route path="/publicpage" element={<PublicPage/>}/>
                        <Route path="/" element={<Navigate to="/publicpage"/>}/>
                    </Routes>
                </BrowserRouter>
            </SecurityContextProvider>
        </QueryClientProvider>
    )
}

export default App