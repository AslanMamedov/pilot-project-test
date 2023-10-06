import { InputNumber, Modal, Select } from 'antd';
import { FC, useEffect } from 'react';
import { Button, Form } from 'antd';
import { FieldType, IData } from '../types';

interface CModalProps {
	isModalOpen: boolean;
	selectedData: IData | null;
	onOkHandle: () => void;
	onCancelHandle: () => void;
	statusList?: number[];
	onEditHandler: (selected: IData, newData: FieldType) => void;
	onAddNewHandler: (newData: FieldType) => void;
}

const CModal: FC<CModalProps> = ({
	isModalOpen,
	statusList,
	selectedData,
	onOkHandle,
	onCancelHandle,
	onAddNewHandler,
	onEditHandler,
}) => {
	const [form] = Form.useForm<FieldType>();

	const onFinish = ({ len, status }: FieldType) => {
		onOkHandle();
		if (selectedData) {
			onEditHandler(selectedData, { len, status });
		} else {
			onAddNewHandler({ len, status });
			form.resetFields();
		}
	};

	useEffect(() => {
		if (!selectedData || !isModalOpen) {
			form.resetFields();
			return;
		}
		form.setFieldValue('status', selectedData.status);
		form.setFieldValue('len', selectedData.len);
	}, [selectedData, isModalOpen]);

	return (
		<Modal title="Basic Modal" open={isModalOpen} footer={[]} onCancel={onCancelHandle}>
			<Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
				<Form.Item<FieldType> name="len" rules={[{ required: true, message: 'Fill in the field' }]}>
					<InputNumber
						min={1}
						max={999_999_999_999}
						maxLength={12}
						style={{
							width: '100%',
						}}
						placeholder="Fill in the field"
					/>
				</Form.Item>
				<Form.Item<FieldType> name="status" rules={[{ required: true, message: 'Select status' }]}>
					<Select placeholder="Select status">
						{!!statusList?.length &&
							statusList?.map((statusCode, index) => (
								<Select.Option value={statusCode} key={index}>
									{statusCode}
								</Select.Option>
							))}
					</Select>
				</Form.Item>

				<Form.Item wrapperCol={{ flex: 'auto', offset: 14 }}>
					<Button
						style={{
							marginRight: '12px',
						}}
						type="default"
						htmlType="button"
						onClick={() => {
							onCancelHandle();
							form.resetFields();
						}}
					>
						Cancel
					</Button>
					<Button
						style={
							{
								// marginLeft: '16px',
							}
						}
						type="primary"
						htmlType="submit"
					>
						{selectedData ? 'Change' : 'Add'}
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CModal;
