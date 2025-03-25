import "../../scss/analytics.scss"; // Import the SCSS file

import BigChartBox from "../../components/bigChartBox/BigChartBox";
import ChartBox from "../../components/chartBox/ChartBox";
import EventList from "../../components/EventList/EvenList";
import { chartBoxRevenue } from "../../data";
import PieChartBox from "../../components/pieCartBox/PieChartBox";
import ProjectsSummary from "../../components/Projects/Projects";
import Expenditure from "../../components/expenditure/Expenditure";
import Receivables from "../../components/TotalReceivbles/TotalReceivbles";
import WeeklyRevenue from "../../components/Weeklyrevenue/WeeklyRevenue";

const Analytics = () => {
  return (
    <div className="analytics">
      <div className="box box1">
        <ProjectsSummary />
      </div>
      <div className="box box2">
        <WeeklyRevenue />
      </div>
      <div className="box box3">
        <ChartBox {...chartBoxRevenue} />
      </div>
      <div className="box box4">
        <EventList />
      </div>
      <div className="box box5">
        <Receivables />
      </div>
      <div className="box box6">
        <Expenditure />
      </div>
      <div className="box box7">
        <BigChartBox />
      </div>
      <div className="box box8">
        <PieChartBox />
      </div>
    </div>
  );
};

export default Analytics;
