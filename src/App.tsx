import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import SecurityContextProvider from "./context/SecurityContextProvider.tsx"
import {RouteGuard} from "./components/RouteGuard.tsx"
import {BrowserRouter, Navigate, Route, Routes} from "react-router"
import {MainLayout} from "./components/layout/MainLayout.tsx";
import {StorePage} from "./pages/StorePage.tsx";
import {LobbyPage} from "./pages/LobbyPage.tsx";
import {LibraryPage} from "./pages/LibraryPage.tsx";
import {ProfilePage} from "./pages/ProfilePage.tsx";
import {ProfileEditPage} from "./pages/ProfileEditPage.tsx";
import {GamePage} from "./pages/GamePage.tsx";
import {UsersPage} from "./pages/UsersPage.tsx";
import {PurchasePage} from "./pages/PurchasePage.tsx";
import {SessionsPage} from "./pages/SessionsPage.tsx";
import {LobbyRoomPage} from "./pages/LobbyRoomPage.tsx";
import {FriendsPage} from "./pages/FriendsPage.tsx";

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SecurityContextProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public routes that don't require authentication */}
                        <Route element={<MainLayout />}>
                            <Route path="/store" element={<StorePage />} />
                            <Route path="/game/:gameId" element={<GamePage />} />
                            <Route path="/" element={<Navigate to="/store" />} />
                        </Route>

                        {/* Protected routes - require authentication */}
                        <Route element={<RouteGuard><MainLayout /></RouteGuard>}>
                            <Route path="/lobby/:gameId" element={<LobbyPage />} />
                            <Route path="/game/:gameId/lobby/:lobbyId" element={<LobbyRoomPage />} />
                            <Route path="/library" element={<LibraryPage />} />
                            <Route path="/sessions" element={<SessionsPage />} />
                            <Route path="/profile/:keycloakId" element={<ProfilePage />} />
                            <Route path="/profile/edit" element={<ProfileEditPage />} />
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/friends" element={<FriendsPage />} />
                            <Route path="/purchase/:gameId" element={<PurchasePage />} />
                        </Route>

                        {/* Catch all - redirect to store (public) */}
                        <Route path="*" element={<Navigate to="/store" />} />
                    </Routes>
                </BrowserRouter>
            </SecurityContextProvider>
        </QueryClientProvider>
    )
}

export default App