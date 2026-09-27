import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Profile from './player/pages/Profile.jsx'
import Notfound from './player/pages/404.jsx'
import Login from './player/pages/Login.jsx'
import Signup from './player/pages/Signup.jsx'
import GameDetails from './player/pages/GameDetails.jsx'
import Home from './player/pages/Home.jsx'
import Tournament_join from './player/pages/Tournament_join.jsx'
import Tournaments from './player/pages/Tournaments.jsx'
import Leaderboard from './player/pages/Leaderboard.jsx'
import Blog from './player/pages/Blog.jsx'
import Notification from './player/pages/Notification.jsx'
import SendPov from './player/pages/SendPov.jsx'
import Verification from './player/pages/Verification.jsx'
import OrgNotFound from './player/pages/OrgNotFound.jsx'
import Loading from './player/compo/Loading.jsx'
import './player/css/App.css'

// Multi-tenant Context
import { TenantProvider, useTenant } from './context/TenantContext.jsx'

// Organizer imports
import Organizer from './organizer/pages/Organizer.jsx'
import Addtour from './organizer/compo/Add_tour.jsx'
import OrganizerHome from './organizer/pages/Home.jsx'
import OrganizerSignup from './organizer/compo/Singup.jsx'
import OrganizerLogin from './organizer/pages/login.jsx'
import OrganizerTournaments from './organizer/pages/Tournaments.jsx'
import Participants from './organizer/pages/Participants.jsx'
import Analytics from './organizer/pages/Analytics.jsx'
import Wallet from './organizer/pages/Wallet.jsx'
import Transactions from './organizer/pages/Transactions.jsx'
import Reviews from './organizer/pages/Reviews.jsx'
import OrganizerSettings from './organizer/pages/Settings.jsx'
import Integrations from './organizer/pages/Integrations.jsx'
import Overview from './organizer/pages/Overview.jsx'
import Pov from './organizer/pages/Pov.jsx'
import SmoothScroll from './player/compo/SmoothScroll.jsx'
import ScrollToTop from './player/compo/ScrollToTop.jsx'

// Master Admin Imports
import { AdminAuthProvider } from './admin/context/AdminAuthContext.jsx'
import AdminLogin from './admin/pages/AdminLogin.jsx'
import AdminDashboard from './admin/pages/AdminDashboard.jsx'
import AdminOrganizers from './admin/pages/AdminOrganizers.jsx'
import AdminTournaments from './admin/pages/AdminTournaments.jsx'
import AdminPlayers from './admin/pages/AdminPlayers.jsx'
import AdminLeaderboard from './admin/pages/AdminLeaderboard.jsx'
import AdminAnnouncements from './admin/pages/AdminAnnouncements.jsx'
import AdminSettings from './admin/pages/AdminSettings.jsx'

function MainAppRoutes() {
  const { isTenant, tenantSlug, tenantNotFound, loading } = useTenant();

  if (loading) {
    return <Loading />;
  }

  if (isTenant && tenantNotFound) {
    return <OrgNotFound slug={tenantSlug} />;
  }

  return (
    <Routes>
      {/* Dynamic Root Route:
          - If accessed on an organization subdomain (e.g. slayeresport.mydomain.com or ?org=slayeresport),
            renders the Player Home Page branded for that organization!
          - If accessed on main platform domain (mydomain.com or localhost without subdomain),
            renders the Organizer Landing Page showcasing why organizers should join and create their website!
      */}
      <Route path="/" element={isTenant ? <Home /> : <OrganizerHome />} />

      {/* Direct Player Home Route (accessible anytime) */}
      <Route path="/player" element={<Home />} />
      <Route path="/player/home" element={<Home />} />

      {/* Player Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/signup/player/:id" element={<GameDetails />} />
      <Route path="/verification/:id" element={<Verification />} />
      <Route path="/signup/verification" element={<Verification />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/join/:id" element={<Tournament_join />} />
      <Route path="/tournaments" element={<Tournaments />} />
      <Route path="/leaderboard/:id" element={<Leaderboard />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="/sendpov/:tourId/:teamId" element={<SendPov />} />

      {/* Direct path preview routes for testing organization sites (e.g. /o/slayeresport) */}
      <Route path="/o/:tenantSlugParam" element={<Home />} />
      <Route path="/o/:tenantSlugParam/tournaments" element={<Tournaments />} />
      <Route path="/o/:tenantSlugParam/leaderboard" element={<Leaderboard />} />

      {/* Organizer Portal Routes */}
      <Route path="/organizer" element={<OrganizerHome />} />
      <Route path="/organizer/home" element={<OrganizerHome />} />
      <Route path="/organizers" element={<OrganizerHome />} />
      <Route path="/organizer/pricing" element={<OrganizerHome />} />
      <Route path="/organizer/login" element={<OrganizerLogin />} />
      <Route path="/organizer/signup" element={<OrganizerSignup />} />
      <Route path="/organizer/dashboard" element={<Organizer />} />
      <Route path="/organizer/addtournament" element={<Addtour />} />
      <Route path="/organizer/edit/:id" element={<Addtour />} />
      <Route path="/organizer/tournaments" element={<OrganizerTournaments />} />
      <Route path="/organizer/view/:id" element={<Participants />} />
      <Route path="/organizer/participants" element={<Participants />} />
      <Route path="/organizer/analytics" element={<Analytics />} />
      <Route path="/organizer/wallet" element={<Wallet />} />
      <Route path="/organizer/transactions" element={<Transactions />} />
      <Route path="/organizer/reviews" element={<Reviews />} />
      <Route path="/organizer/settings" element={<OrganizerSettings />} />
      <Route path="/organizer/integrations" element={<Integrations />} />
      <Route path="/organizer/overview" element={<Overview />} />
      <Route path="/organizer/pov/:tourId/:teamId" element={<Pov />} />
      <Route path="/organizer/pov/:tourId" element={<Pov />} />
      <Route path="/organizer/pov" element={<Pov />} />

      {/* Master Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/organizers" element={<AdminOrganizers />} />
      <Route path="/admin/tournaments" element={<AdminTournaments />} />
      <Route path="/admin/players" element={<AdminPlayers />} />
      <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
      <Route path="/admin/announcements" element={<AdminAnnouncements />} />
      <Route path="/admin/settings" element={<AdminSettings />} />

      {/* 404 Route */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AdminAuthProvider>
          <SmoothScroll>
            <ScrollToTop />
            <MainAppRoutes />
          </SmoothScroll>
        </AdminAuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}

export default App;
