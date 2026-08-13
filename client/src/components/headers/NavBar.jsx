import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const NavBar = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Files', path: '/files' },
    { name: 'Folders', path: '/folders' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b-4 border-black">
      <nav className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center text-3xl font-black tracking-tighter uppercase text-black hover:-rotate-2 transition-transform duration-200">
          SHARE<span className="bg-black text-white px-2 py-0.5 ml-1 border-2 border-black rotate-2 shadow-[2px_2px_0_0_#000]">FLOW</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-10 font-bold uppercase tracking-wide text-sm">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`relative py-1 transition-all duration-200 hover:-translate-y-0.5 inline-block
                  ${isActive(link.path)
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                  }
                `}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[4px] bg-black" />
                )}
                {!isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[4px] bg-black scale-x-0 transition-transform origin-left hover:scale-x-100" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Profile Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="w-12 h-12 rounded-full overflow-hidden border-4 border-black hover:shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all focus:outline-none bg-white"
          >
            <img className='w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all' src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D" alt="Profile" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none group border-2 border-black bg-white shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[3px] bg-black transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-[3px] bg-black transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[3px] bg-black transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-t-4 border-black ${menuOpen ? 'max-h-80' : 'max-h-0 border-t-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-4">
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
          <button
            onClick={() => setMenuOpen(false)}
            className="w-full mt-4 py-3 px-4 bg-[#FF90E8] border-2 border-black text-black font-black text-lg uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  )
}

export default NavBar