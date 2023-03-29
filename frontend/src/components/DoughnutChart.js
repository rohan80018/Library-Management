import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dough (props) {
    const data = {
        labels: ['Issued', "Returned"],
        datasets: [
          {
            label: "",
            data: [props.issue, props.return],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 2,
          },
        ],
      };
  return <Doughnut data={data} />;
}
