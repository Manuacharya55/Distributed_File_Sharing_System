import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'


const NavBar = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { token, setToken } = useAuth()

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Files', path: '/files' },
    { name: 'Folders', path: '/folders' },
   [{ name: 'Profile', path: '/profile' }]
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 w-full flex justify-center pointer-events-none">
      {/* The Notch */}
      <div className="bg-white pointer-events-auto border-b-4 border-x-4 border-black rounded-b-3xl px-4 md:px-8 py-2 flex items-center justify-between gap-4 md:gap-6 shadow-[0_4px_0_0_#000] relative z-50 transition-all duration-300 max-w-[95vw]">
        
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl md:text-2xl font-black tracking-tighter uppercase text-black hover:-rotate-1 transition-transform duration-200 shrink-0" onClick={() => setMenuOpen(false)}>
          SHARE<span className="bg-black text-white px-1.5 py-0.5 ml-1 border-2 border-black rotate-2 shadow-[2px_2px_0_0_#000] text-sm md:text-base leading-none">FLOW</span>
        </Link>

        {/* Hamburger Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1 p-1.5 focus:outline-none group bg-white border-2 border-black shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] rounded-md transition-all shrink-0"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[2px] bg-black transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-5 h-[2px] bg-black transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-black transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Full Screen Overlay / Dropdown Menu */}
      <div 
        className={`fixed inset-0 pointer-events-auto bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-40`}
        onClick={() => setMenuOpen(false)}
      >
        <div 
          className={`absolute top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 flex flex-col gap-4 transition-all duration-300 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`text-lg font-bold tracking-wide p-3 border-2 border-black transition-all uppercase text-center shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px]
                  ${isActive(link.path) 
                    ? 'bg-black text-white shadow-none translate-y-[4px] translate-x-[4px]' 
                    : 'bg-white text-black hover:bg-gray-100'}
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-1 bg-black w-full my-2 border-t-2 border-b-2 border-black" style={{ height: '4px' }}></div>

          <div className="flex flex-col gap-3">
            {!token ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full py-3 px-4 bg-[#FF90E8] border-2 border-black text-black font-black text-lg uppercase text-center shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  console.log('Logout clicked');
                  setToken(null);
                  setMenuOpen(false);
                }}
                className="w-full py-3 px-4 bg-red-400 border-2 border-black text-black font-black text-lg uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar