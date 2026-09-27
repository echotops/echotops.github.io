import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Navbar from './components/Navbar/Navbar'
import { NavSectionProvider } from './context/NavSectionContext'
import Home from './pages/Home/Home'
import Software from './pages/Software/Software'
import Digital from './pages/Digital/Digital'
import UnderConstruction from './pages/UnderConstruction/UnderConstruction'
// One page per project, not per year — see ProjectsGrid.jsx.
import DukeAeroLiquids from './pages/Projects/DukeAeroLiquids'
import DukeAeroSolids from './pages/Projects/DukeAeroSolids'
import SyntheticApertureRadar from './pages/Projects/SyntheticApertureRadar'
import ProjectSaker from './pages/Projects/ProjectSaker'
import TelescopeMount from './pages/Projects/TelescopeMount'
import Electromagnetism from './pages/Software/projects/Electromagnetism/Electromagnetism'
import Fluids from './pages/Software/projects/Fluids/Fluids'

export default function App() {
  return (
    <BrowserRouter basename="/">
      <NavSectionProvider>
        <ScrollToTop />
        {/* Rendered once here (not per-page) so it persists across route
            changes instead of remounting, which the navbar's slide/fade
            transition relies on. */}
        <Navbar />
        <Routes>
          {/* One route, not two, for "/" and "/projects" — the old
              standalone Projects page is now just a section of Home (see
              that file), which reads location.pathname on mount to land
              on the right one and keeps the URL synced to whichever is on
              screen as you scroll (window.history.replaceState). That
              replaceState call still goes through react-router's own
              history object (it patches the native history methods, so
              even a "raw" call to them doesn't bypass it) — with "/" and
              "/projects" as separate <Route> entries, switching between
              them re-matched to a different route object on every scroll
              crossing and remounted Home each time, which is exactly the
              stutter this whole mechanism exists to avoid. One route
              matching both via an optional segment keeps the matched
              route identity — and so the mounted Home instance — the same
              regardless of which of the two URLs is currently showing. */}
          <Route path="/:section?" element={<Home />} />
          <Route path="/projects/dukeaero-liquids" element={<DukeAeroLiquids />} />
          <Route path="/projects/dukeaero-solids" element={<DukeAeroSolids />} />
          <Route path="/projects/synthetic-aperture-radar" element={<SyntheticApertureRadar />} />
          <Route path="/projects/project-saker" element={<ProjectSaker />} />
          <Route path="/projects/telescope-iphone-mount" element={<TelescopeMount />} />
          <Route path="/software" element={<Software />} />
          <Route path="/software/projects/electromagnetism" element={<Electromagnetism />} />
          <Route path="/software/projects/fluids" element={<Fluids />} />
          <Route path="/digital" element={<Digital />} />
          <Route path="/under-construction" element={<UnderConstruction />} />
        </Routes>
      </NavSectionProvider>
    </BrowserRouter>
  )
}
