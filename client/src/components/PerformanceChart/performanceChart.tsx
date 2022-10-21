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
            legend: { display: false },
            data: {
                labels: { display: false }
            },
            title: { display: false }
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
        },
        elements: {
          point: { radius: 0 }
        }
    };

    const labels = new Array(30).fill("");
    
    const data = {
        labels,
        datasets: [
          {
            backgroundColor: "rgb(235, 88, 88)",
            borderColor: "rgb(235, 88, 88)",
            data: [122, 52, 82, 12, 42, 62, 12, 42, 72, 32, 2, 42, 12, 2, 142, 22, 62, 142, 128, 65, 21, 92, 72, 32, 92, 32, 72, 62, 122, 21],
            tension: 0.3
          }
        ],
    };
    
    return (
    <div className='chart-section'>
        <h1 className='title'>Activity</h1>
        <h2 className='sub-title'>this month</h2>
        <Line data={data} options={options} />;
        <hr />
    </div>)
}
