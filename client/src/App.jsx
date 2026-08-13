import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./features/auth/pages/LoginPage"
import RegisterPage from "./features/auth/pages/RegisterPage"
import NotFound from "./features/NotFound"
import NavBar from "./components/headers/NavBar"
import Footer from "./components/headers/Footer"
import ImageComponent from "./components/shared/ImageComponent"
import Dashboard from "./features/dashboard/Dashboard"
import FoldersPage from "./features/folders/FoldersPage"
import FolderDetailsPage from "./features/folders/FolderDetailsPage"

function App() {

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-black font-sans bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:24px_24px]">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/files" element={<ImageComponent/>} />
            <Route path="/folders" element={<FoldersPage/>} />
            <Route path="/folders/:folderId" element={<FolderDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
