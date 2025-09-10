import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  BarElement,
} from "chart.js";
import { createChartOptions } from "../../configs/chartConfigs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement
);

const CustomChart = ({ data, type = "line" }) => {
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return <div>Không đủ dữ liệu để vẽ biểu đồ.</div>;
  }

  // ✅ Auto-detect dual y-axis from yAxisID
  const hasDualAxis =
    type === "mixed" &&
    data.datasets.some(
      (ds) => ds.yAxisID === "y-left" || ds.yAxisID === "y-right"
    );

  const options = createChartOptions(hasDualAxis ? "mixed-dual" : type);

  const chartData =
    type === "mixed"
      ? {
          ...data,
          datasets: data.datasets.map((ds) => ({
            ...ds,
            type: ds.type || "bar",
          })),
        }
      : data;

  const ChartComponent =
    {
      doughnut: Doughnut,
      bar: Bar,
      mixed: Bar,
      line: Line,
    }[type] || Line;

  return <ChartComponent data={chartData} options={options} />;
};

export default CustomChart;
