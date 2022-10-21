import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";
import { Line } from "react-chartjs-2";
import './performanceChart.scss';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

export function PerformanceChart(): JSX.Element {
    const options = {
    responsive: true,
    plugins: {
            legend: {
                display: false
            },
            data: {
                labels: { display: false }
            },
            title: {
                display: false,
            }
        }
    };

    const labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct"
    ];
    
    const data = {
        labels,
        datasets: [
          {
            label: `${labels[new Date().getMonth()]}`,
            data: labels.map(() => [1, 5, 78, 86, 100]),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)"
          }
        ]
    };
    
    return (
    <div className='chart-section'>
        <h1 className='title'>Activity</h1>
        <h2 className='sub-title'>this month</h2>
        <Line data={data} options={options} />;
        <hr />
    </div>)
}
