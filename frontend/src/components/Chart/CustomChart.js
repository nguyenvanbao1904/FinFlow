import { Line, Doughnut } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const CustomChart = ({ data, options, type }) => {
  if (!data || !data.labels || !data.datasets) {
    return <div>Loading...</div>;
  }
  if (!options) {
    options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#A0AEC0",
          },
        },
      },
      elements: {
        line: {
          tension: 0.4, // Soften the line
          borderWidth: 2,
        },
        point: {
          radius: 5, // Larger points
          hoverRadius: 7,
        },
      },
    };
  }
  switch (type) {
    case "line":
      return <Line data={data} options={options} />;
    case "doughnut":
      return <Doughnut data={data} options={options} />;
    default:
      return <Line data={data} options={options} />;
  }
};

export default CustomChart;
