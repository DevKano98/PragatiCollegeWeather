import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Navbar } from '@/components/Navbar'
import { MobileNav } from '@/components/MobileNav'
import { Footer } from '@/components/Footer'
import { HomeSkeleton } from '@/components/LoadingSkeleton'
import { WeatherProvider } from '@/context/WeatherContext'

// Route pages are lazy-loaded; each is code-split out of the initial bundle.
const Home = lazy(() => import('@/pages/Home'))
const MapView = lazy(() => import('@/pages/MapView'))
const Favorites = lazy(() => import('@/pages/Favorites'))
const Settings = lazy(() => import('@/pages/Settings'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Animated wrapper for page transitions.
function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="container py-6"
    >
      {children}
    </motion.main>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Suspense
        // Keyed fallback so the skeleton also transitions cleanly.
        fallback={
          <div className="container py-6">
            <HomeSkeleton />
          </div>
        }
      >
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Page>
                <Home />
              </Page>
            }
          />
          <Route
            path="/map"
            element={
              <Page>
                <MapView />
              </Page>
            }
          />
          <Route
            path="/favorites"
            element={
              <Page>
                <Favorites />
              </Page>
            }
          />
          <Route
            path="/settings"
            element={
              <Page>
                <Settings />
              </Page>
            }
          />
          <Route
            path="*"
            element={
              <Page>
                <NotFound />
              </Page>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <WeatherProvider>
      <TooltipProvider delayDuration={200}>
        {/* pb-20 keeps content clear of the mobile bottom tab bar. */}
        <div className="flex min-h-dvh flex-col pb-20 md:pb-0">
          <Navbar />
          <div className="flex-1">
            <AnimatedRoutes />
          </div>
          <Footer />
          <MobileNav />
        </div>
      </TooltipProvider>
    </WeatherProvider>
  )
}
