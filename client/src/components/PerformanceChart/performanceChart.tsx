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
        },
        scales: {
            y: {
                ticks: { display: false },
                grid: { display: false }
            },
            x: {
                ticks: { display: false },
                grid: { display: false }
            }
        }
    };

    const labels = new Array(30).fill("");
    
    const data = {
        labels,
        datasets: [
          {
            label: `${labels[new Date().getMonth()]}`,
            data: [122, 52, 82, 12, 42, 62, 12, 42, 72, 32, 2, 42, 12, 2, 142, 22, 62, 142, 128, 65, 21, 92, 72, 32, 92, 32, 72, 62, 122, 21],
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
