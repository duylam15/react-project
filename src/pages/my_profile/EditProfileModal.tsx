import { Modal } from "antd";

type Props = {
	isOpen: boolean;
	username: string;
	onClose: () => void;
	onChangeUsername: (val: string) => void;
	onSave: () => void;
};

const EditProfileModal = ({ isOpen, username, onClose, onChangeUsername, onSave }: Props) => {
	return (
		<Modal
			title="Chỉnh sửa hồ sơ"
			open={isOpen}
			onCancel={onClose}
			onOk={onSave}
			okText="Lưu"
			cancelText="Hủy"
		>
			<div className="flex flex-col gap-4">
				<label>
					Tên người dùng:
					<input
						type="text"
						value={username}
						onChange={(e) => onChangeUsername(e.target.value)}
						className="w-full p-2 border rounded"
					/>
				</label>
			</div>
		</Modal>
	);
};

export default EditProfileModal;
