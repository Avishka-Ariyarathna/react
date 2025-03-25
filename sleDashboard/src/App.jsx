import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PowerPlantGallery from "./components/PowerPlantDetails/PowerPlantDetails";
import Header from "./components/NavBar"; // or wherever it's located
import AddPlants from "./components/AddPlants/AddPlant"; // Import your AddPlants component
import PlantsTable from "./components/PlantTable/PlantTable"; // Import your PlantsTable component
import DeduruOya from "./components/DeduruOya/DeduruOya";
import Kumbalgamuwa from "./components/Kumbalgamuwa/Kumbalgamuwa";
import Biomed from "./components/Biomed/Biomed";
import MEMP from "./components/MeterManufacturing/MeterManufacturing";
import Aluminum from "./components/Aluminum/AluminumRecycling";
import Solor from "./components/Solor/SolorDepartment";
import AluminumLabour from "./components/Aluminum/AluminumLabourTable";
import Event from "./components/EventReminder/EventScheduler";
import EventList from "./components/EventList/EvenList";
import DailyImg from "./components/Dimage";
import KDailyImg from "./components/KImage";
import BDailyImg from "./components/BImages";
import MDailyImg from "./components/MImages";
import ADailyImg from "./components/AImages";
import SDailyImg from "./components/SImage";
import Manpower from "./components/ManPower/ManPower";
import ProjectsSummary from "./components/Projects/Projects";

// Lazy-loaded components
const Login = lazy(() => import("./pages/Login/Login"));
const SignUp = lazy(() => import("./pages/Register/Register"));
const Home = lazy(() => import("./pages/Dashboard/Dashboard"));
const EmployeeTable = lazy(() => import("./components/Employee/EmployeeTable"));
const LandingPage = lazy(() => import("./pages/Landing/Landing"));

const ProtectedRoute = ({ element }) => {
  const authToken = sessionStorage.getItem("authToken");
  return authToken ? element : <Navigate to="/login" />;
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router basename="/sle-frontend">
      {/* Only show the Header/NavBar after login */}
      {user && <Header />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Landing Page without Navbar */}
          <Route path="/" element={<LandingPage />} />

          {/* Login Route */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />
            }
          />

          {/* SignUp Route */}
          <Route
            path="/signup"
            element={<ProtectedRoute element={<SignUp />} />}
          />

          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Home />} />}
          />
          {/* Employee Table Route */}
          <Route
            path="/employees"
            element={<ProtectedRoute element={<EmployeeTable />} />}
          />

          <Route
            path="/daily"
            element={<ProtectedRoute element={<DailyImg />} />}
          />
          <Route
            path="/adaily"
            element={<ProtectedRoute element={<ADailyImg />} />}
          />
          <Route
            path="/Bdaily"
            element={<ProtectedRoute element={<BDailyImg />} />}
          />
          <Route
            path="/Mdaily"
            element={<ProtectedRoute element={<MDailyImg />} />}
          />
          <Route
            path="/Kdaily"
            element={<ProtectedRoute element={<KDailyImg />} />}
          />
          <Route
            path="/Sdaily"
            element={<ProtectedRoute element={<SDailyImg />} />}
          />
          <Route
            path="/manpower"
            element={<ProtectedRoute element={<Manpower />} />}
          />
          <Route
            path="/powerstationdetail"
            element={<ProtectedRoute element={<PowerPlantGallery />} />}
          />
          <Route
            path="/powerstationdetail/:id"
            element={<ProtectedRoute element={<PowerPlantGallery />} />}
          />

          {/* Add Plants Route */}
          <Route
            path="/addplants"
            element={<ProtectedRoute element={<AddPlants />} />}
          />

          <Route
            path="/plants"
            element={<ProtectedRoute element={<PlantsTable />} />}
          />

          <Route
            path="/deduruoya"
            element={<ProtectedRoute element={<DeduruOya />} />}
          />
          <Route
            path="/kumbalgamuwa"
            element={<ProtectedRoute element={<Kumbalgamuwa />} />}
          />
          <Route
            path="/biomed"
            element={<ProtectedRoute element={<Biomed />} />}
          />
          <Route path="/memp" element={<ProtectedRoute element={<MEMP />} />} />
          <Route
            path="/aluminum"
            element={<ProtectedRoute element={<Aluminum />} />}
          />

          <Route
            path="/alumilabour"
            element={<ProtectedRoute element={<AluminumLabour />} />}
          />
          <Route
            path="/solor"
            element={<ProtectedRoute element={<Solor />} />}
          />

          <Route
            path="/event"
            element={<ProtectedRoute element={<Event />} />}
          />
          <Route
            path="/eventList"
            element={<ProtectedRoute element={<EventList />} />}
          />

          <Route
            path="/projectsummary"
            element={<ProtectedRoute element={<ProjectsSummary />} />}
          />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        theme="colored"
      />
    </Router>
  );
};

export default App;
