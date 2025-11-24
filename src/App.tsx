import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import SecurityContextProvider from "./context/SecurityContextProvider.tsx"
import {SecuredPage} from "./pages/SecuredPage.tsx"
import {RouteGuard} from "./components/RouteGuard.tsx"
import {RegistrationGuard} from "./components/RegistrationGuard.tsx"
import {BrowserRouter, Route, Routes} from "react-router"
import {PublicPage} from "./pages/PublicPage.tsx"
import {WelcomePage} from "./pages/WelcomePage.tsx"
import {HomePage} from "./pages/HomePage.tsx"
import {BrowseGamesPage} from "./pages/BrowseGamesPage.tsx"
import {useContext} from "react"
import SecurityContext from "./context/SecurityContext.ts"

const queryClient = new QueryClient()

function AppContent() {
    const {isInitialised} = useContext(SecurityContext)

    if (!isInitialised) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '1.5rem'
        }}>Loading...</div>
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/browse-games" element={<BrowseGamesPage/>}/>
                <Route path="/publicpage" element={<PublicPage/>}/>

                <Route
                    path="/welcome"
                    element={
                        <RouteGuard>
                            <WelcomePage/>
                        </RouteGuard>
                    }
                />

                <Route
                    path="/securedpage"
                    element={
                        <RouteGuard>
                            <RegistrationGuard>
                                <SecuredPage/>
                            </RegistrationGuard>
                        </RouteGuard>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SecurityContextProvider>
                <AppContent />
            </SecurityContextProvider>
        </QueryClientProvider>
    )
}

export default App