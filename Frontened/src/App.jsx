import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==========================================
// PAGES
// ==========================================

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Roommates from "./pages/Roommates";
import RoommateDetails from "./pages/RoommateDetails";
import Connections from "./pages/Connections";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Notifications from "./pages/Notifications";

// ==========================================
// COMPONENTS
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ======================================
            PUBLIC ROUTES
        ====================================== */}

        {/* Landing */}
        <Route
          path="/"
          element={<Landing />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />


        {/* ======================================
            PROTECTED ROUTES
        ====================================== */}

        <Route element={<ProtectedRoute />}>

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* Roommates */}

          <Route
            path="/roommates"
            element={<Roommates />}
          />

          <Route
            path="/roommates/:id"
            element={<RoommateDetails />}
          />


          {/* Connections */}

          <Route
            path="/connections"
            element={<Connections />}
          />


          {/* Notifications */}

          <Route
            path="/notifications"
            element={<Notifications />}
          />


          {/* Profile */}

          <Route
            path="/profile"
            element={<Profile />}
          />


          {/* Edit Profile */}

          <Route
            path="/profile/edit"
            element={<EditProfile />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;