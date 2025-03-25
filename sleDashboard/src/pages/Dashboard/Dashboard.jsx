import Navbar from "../../components/NavBar";
import SideMenu from "../../components/MenuBar";
import PowerStations from "../../components/powerstationTiles/PowerStationTiles";
import Analytics from "../Dashboard/Analytics";
import "../../scss/dashboard.scss"

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Navbar />
      <SideMenu />
      <Analytics />
      <PowerStations />
    </div>
  );
};

export default Dashboard;
