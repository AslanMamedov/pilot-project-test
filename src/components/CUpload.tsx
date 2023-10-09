import { Button } from 'antd';
import { ChangeEventHandler, useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import { ColumnDefinition, ReactTabulator, ReactTabulatorOptions, reactFormatter } from 'react-tabulator';
import { DeleteOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import ChartBar from './ChartBar';
import ChartPie from './ChartPie';
import { FieldType, IData } from '../types';
import CModal from './CModal';
import CMap from './CMap';

const options: ReactTabulatorOptions = {
	height: 620,
	movableRows: true,
	movableColumns: true,
	progressiveLoad: 'scroll',
	progressiveLoadDelay: 200,
	progressiveLoadScrollMargin: 30,
	paginationSize: 10,
	pagination: true,
	paginationInitialPage: 1,
};

const CUpload: React.FC = () => {
	const [isShowFirstAnaliz, setIsShowFirstAnaliz] = useState<boolean>(false);
	const [isShowSecondAnaliz, setIsShowSecondAnaliz] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [data, setData] = useState<IData[]>();
	const [selectedData, setSelectedData] = useState<IData | null>(null);
	const [statusList, setStatusList] = useState<number[]>();
	const [wkt, setWkt] = useState('');

	const onFileHandler: ChangeEventHandler<HTMLInputElement> = async (e) => {
		const file: File | null = e.target.files ? e.target.files[0] : null;
		if (file) {
			const wb = XLSX.read(await file.arrayBuffer());
			const ws = wb.Sheets[wb.SheetNames[0]];
			const data = XLSX.utils.sheet_to_json(ws) as IData[];
			const listStatus = data.reduce((acc: number[], item: IData) => {
				acc.push(item.status);
				return [...new Set(acc)];
			}, []);
			setStatusList(listStatus);
			setData(data);
		}
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const LocationCell = (props: any) => {
		const rowData = props.cell._cell.row.data as IData;
		return <Button size="small" onClick={() => setWkt(rowData.wkt)} type="primary" icon={<EnvironmentOutlined />} />;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const EditCell = (props: any) => {
		const rowData = props.cell._cell.row.data as IData;

		return (
			<Button
				onClick={() => {
					setSelectedData(rowData);
					setIsModalOpen(true);
				}}
				size="small"
				type="primary"
				icon={<EditOutlined />}
			/>
		);
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const DeleteCell = (props: any) => {
		const rowData = props.cell._cell.row.data as IData;
		const onDeleteHandler = () => {
			const newData = data?.filter((item) => item.id !== rowData.id);
			setData(newData);
		};

		return <Button size="small" onClick={onDeleteHandler} type="primary" icon={<DeleteOutlined />} />;
	};

	const columns: ColumnDefinition[] = [
		{
			title: 'id',
			field: 'id',
			width: 100,
			headerFilterLiveFilter: true,
			headerFilter: 'input',
			headerFilterPlaceholder: 'Search....',
		},
		{
			title: 'len',
			field: 'len',
			width: 200,
			headerFilterLiveFilter: true,
			headerFilter: 'input',
			headerFilterPlaceholder: 'Search....',
		},
		{
			title: 'wkt',
			field: 'wkt',
			headerFilterLiveFilter: true,
			headerFilter: 'input',
			headerFilterPlaceholder: 'Search....',
		},
		{
			title: 'status',
			field: 'status',
			width: 100,
			headerFilterLiveFilter: true,
			headerFilter: 'input',
			headerFilterPlaceholder: 'Search....',
		},
		{
			title: '',
			width: 50,
			frozen: true,
			headerSort: false,
			formatter: reactFormatter(<LocationCell />),
		},
		{
			title: '',
			width: 50,
			frozen: true,
			headerSort: false,
			formatter: reactFormatter(<DeleteCell />),
		},
		{
			title: '',
			width: 50,
			frozen: true,
			headerSort: false,
			formatter: reactFormatter(<EditCell />),
		},
	];

	const onShowModalHandler = useCallback(() => {
		setIsModalOpen(true);
		setSelectedData(null);
	}, []);

	const onOkHandle = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	const onCancelHandle = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	const onAddNewHandler = useCallback(({ len, status }: FieldType) => {
		setData((presState) =>
			presState
				? [...presState, { id: presState.length + 1, len: len / 100, status, wkt: presState[presState.length - 1].wkt }]
				: []
		);
	}, []);

	const onEditHandler = useCallback(
		(selected: IData, { len, status }: FieldType) => {
			if (!data) {
				return;
			}
		
			setData((prevState) =>
				prevState?.map((item) => (item.id === selected.id ? { ...item, len, status: status } : item))
			);
		},
		[data]
	);

	return (
		<>
			<div
				style={{
					display: 'flex',
					gap: '10px',
					marginBottom: '10px',
				}}
			>
				<Button
					style={{
						position: 'relative',
					}}
					type="primary"
					htmlType="button"
				>
					Load Excel File
					<input
						onChange={onFileHandler}
						style={{
							position: 'absolute',
							left: 0,
							border: '1px solid red',
							top: 0,
							width: '100%',
							height: '100%',
							opacity: 0,
						}}
						type="file"
					/>
				</Button>
				{!!data?.length && (
					<Button onClick={onShowModalHandler} htmlType="button">
						Add New Data
					</Button>
				)}
			</div>
			<div>
				<CModal
					onEditHandler={onEditHandler}
					onAddNewHandler={onAddNewHandler}
					statusList={statusList}
					isModalOpen={isModalOpen}
					selectedData={selectedData}
					onCancelHandle={onCancelHandle}
					onOkHandle={onOkHandle}
				/>
				<div
					style={{
						width: '100%',
						display: 'flex',
					}}
				>
					<div
						style={{
							width: `${wkt.length !== 0 ? 50 : 100}%`,
						}}
					>
						{!!data?.length && <ReactTabulator options={options} data={data} columns={columns} />}
					</div>

					{wkt.length !== 0 && (
						<div
							style={{
								width: '50%',
							}}
						>
							<CMap wkt={wkt} />
						</div>
					)}
				</div>

				{!!data?.length && (
					<div
						style={{
							marginTop: '10px',
							display: 'flex',
							gap: '10px',
						}}
					>
						<Button
							onClick={() => {
								setIsShowFirstAnaliz(true);
								setIsShowSecondAnaliz(false);
							}}
							htmlType="button"
						>
							Analiz 1
						</Button>
						<Button
							onClick={() => {
								setIsShowFirstAnaliz(false);
								setIsShowSecondAnaliz(true);
							}}
							htmlType="button"
						>
							Analiz 2
						</Button>
					</div>
				)}

				{isShowSecondAnaliz && <ChartBar data={data ? data : []} />}
				{isShowFirstAnaliz && <ChartPie data={data ? data : []} />}
			</div>
		</>
	);
};

export default CUpload;
