import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart({ data }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "This Year",
      },
    },
  };

  const labels = data.mon
  const pdata = {
    labels,
    datasets: [
      {
        label: "Issued",
        data:data.issue,
        backgroundColor: "#fa7211"
      },
      {
        label: "Returned",
        data:data.returned,
        backgroundColor: "#4dff7c"
      },
    ],
  };

  return (
        <Bar options={options} data={pdata} />
  );
}
