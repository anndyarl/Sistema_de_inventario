import {
    Line,
    Bar,
    Pie,
    Doughnut,
    Radar,
    PolarArea,
    Bubble,
} from "react-chartjs-2";

type ChartType =
    | "line"
    | "bar"
    | "doughnut"
    | "pie"
    | "radar"
    | "polarArea"
    | "scatter"
    | "bubble";


interface Props {
    data: { periodo: string; total: number }[];
    type?: ChartType;
}

const InventarioIngresosChart: React.FC<Props> = ({
    data,
    type = "line",
}) => {
    const chartData = {
        labels: data.map(d => d.periodo),
        datasets: [
            {
                label: "Ingresos de Inventario",
                data: data.map(d => d.total),
                backgroundColor: [
                    "rgba(13,110,253,0.5)",
                    "rgba(25,135,84,0.5)",
                    "rgba(255,193,7,0.5)",
                    "rgba(220,53,69,0.5)",
                    "rgba(108,117,125,0.5)",
                ],
                borderColor: "#0d6efd",
                borderWidth: 2,
                fill: type === "line",
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
        },
    };

    const charts = {
        line: <Line data={chartData} options={options} />,
        bar: <Bar data={chartData} options={options} />,
        pie: <Pie data={chartData} options={options} />,
        doughnut: <Doughnut data={chartData} options={options} />,
        radar: <Radar data={chartData} options={options} />,
        polarArea: <PolarArea data={chartData} options={options} />,
        bubble: <Bubble data={chartData} options={options} />,
        scatter: <Bubble data={chartData} options={options} />,
    };

    return charts[type];
};

export default InventarioIngresosChart;
