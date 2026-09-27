import { createContext, useContext, useMemo, useState } from 'react'

const NavSectionContext = createContext(null)

// Home and Navbar are siblings (Navbar is rendered once in App.jsx, above
// <Routes>, so it never remounts on navigation) — this is how Home's
// scroll position reaches Navbar's active-link highlighting without a
// route change. Only Home ever calls setSection; Navbar (and everything
// else) just reads section.
export function NavSectionProvider({ children }) {
  const [section, setSection] = useState('home')
  const value = useMemo(() => ({ section, setSection }), [section])
  return <NavSectionContext.Provider value={value}>{children}</NavSectionContext.Provider>
}

export function useNavSection() {
  const ctx = useContext(NavSectionContext)
  if (!ctx) throw new Error('useNavSection must be used within a NavSectionProvider')
  return ctx
}
