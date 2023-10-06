import { FC } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { xlsxData } from '../libs';
import { Color, IData } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IChartPieProps {
	data: IData[];
}

const chartOptions = {
	scales: {
		y: {
			beginAtZero: false,
		},
	},
};

const ChartPie: FC<IChartPieProps> = ({ data }) => {
	const statues = xlsxData<IData>(data);

	const chartData = {
		labels: [...statues.entries()].map((item) => [`Status: ${item[0]} =  % ${item[1]}`]),
		datasets: [
			{
				label: '',
				data: [...statues.entries()].map((item) => item[1]),
				backgroundColor: [...statues.entries()].map((_, i) => Color[i]),
				borderWidth: 0,
			},
		],
	};

	return (
		<div
			style={{
				width: '250px',
				height: '250px',
			}}
		>
			<Pie data={chartData} options={chartOptions} />
		</div>
	);
};

export default ChartPie;
