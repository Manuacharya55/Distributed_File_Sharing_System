import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./features/auth/pages/LoginPage"
import RegisterPage from "./features/auth/pages/RegisterPage"
import NotFound from "./features/NotFound"
import FilesPage from "./features/files/page/FilesPage"
import Dashboard from "./features/dashboard/pages/Dashboard"
import FoldersPage from "./features/folders/pages/FoldersPage"
import FolderDetailsPage from "./features/folders/pages/FolderDetailsPage"
import VerifyEmailPage from "./features/auth/pages/VerifyEmailPage"
import ProfilePage from "./features/profile/pages/ProfilePage"
import TrashPage from "./features/trash/TrashPage"
import SharedResourcePage from "./features/share/SharedResourcePage"
import { AuthProvider } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext"
import ProtectedLayout from "./components/layout/ProtectedLayout"

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-black font-sans bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:24px_24px]">
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/share/:shareToken" element={<SharedResourcePage />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/files" element={<FilesPage />} />
                  <Route path="/folders" element={<FoldersPage />} />
                  <Route path="/folders/:folderId" element={<FolderDetailsPage />} />
                  <Route path="/trash" element={<TrashPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
