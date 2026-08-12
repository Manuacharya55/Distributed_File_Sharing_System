import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const NavBar = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Files', path: '/files' },
    { name: 'Folders', path: '/folders' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="w-full bg-black text-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          <span className="text-white">Share</span>
          <span className="text-gray-400">Flow</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`relative py-1 transition-colors duration-200
                  ${isActive(link.path)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Profile Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(false)}
            className="w-full  text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <img className='rounded-full w-8 h-8 object-cover object-top' src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D" alt="" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-60' : 'max-h-0'}`}>
        <div className="px-6 pb-6 flex flex-col gap-4 border-t border-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium pt-4 transition-colors
                ${isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white'}
              `}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => setMenuOpen(false)}
            className="w-full mt-2 px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <img className='rounded-full w-8 h-8' src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D" alt="" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default NavBar