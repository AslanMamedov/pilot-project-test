import { FC } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { xlsxData } from '../libs';
import { Color, IData } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface IChartBarProps {
	data: IData[];
}

const ChartBar: FC<IChartBarProps> = ({ data }) => {
	const statues = xlsxData<IData>(data);
	const chartData = {
		labels: [...statues.entries()].map((item) => [`Status: ${item[0]} =  % ${item[1]}`]),
		datasets: [
			{
				label: 'Statuses',
				data: [...statues.entries()].map((item) => item[1]),
				backgroundColor: [...statues.entries()].map((_, i) => Color[i]),
				borderWidth: 1,
			},
		],
	};

	const chartOptions = {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	return (
		<div
			style={{
				overflow: 'hidden',
				width: '98vw',
				height: '250px',
			}}
		>
			<Bar data={chartData} options={chartOptions} />
		</div>
	);
};

export default ChartBar;
