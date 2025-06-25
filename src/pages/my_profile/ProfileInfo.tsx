import React from "react";
import { useTranslation } from "react-i18next";
import { IconDots } from "../../components/UI/icons/ic_dots";

type Props = {
	user: any;
	isOwnProfile: boolean;
	iconColor: string;
	friendStatus: string;
	onEdit: () => void;
	onSendRequest: () => void;
	onAccept: () => void;
	onDecline: () => void;
};

const ProfileInfo = ({ user, isOwnProfile, iconColor, friendStatus, onEdit, onSendRequest, onAccept, onDecline }: Props) => {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col gap-4 ml-6">
			<div className="flex items-center gap-4">
				<h2 className="text-xl font-normal">{user?.username}</h2>
				<div className="bg-gray-200 px-4 py-1 rounded-md text-center text-black-600" style={{ background: "var(--hover-color)" }}>
					{isOwnProfile ? (
						<button onClick={onEdit}>Chỉnh sửa hồ sơ</button>
					) : friendStatus === "friends" ? (
						<div>Bạn bè</div>
					) : friendStatus === "sent" ? (
						<div className="text-gray-500">Đã gửi lời mời</div>
					) : friendStatus === "received" ? (
						<>
							<button onClick={onAccept}>Đồng ý</button>
							<button onClick={onDecline}>Từ chối</button>
						</>
					) : (
						<button onClick={onSendRequest}>Kết bạn</button>
					)}
				</div>
				<div className="bg-gray-200 px-4 py-1 rounded-md text-black-600" style={{ background: "var(--hover-color)" }}>Nhắn tin</div>
				<div className="bg-gray-200 px-2 py-1 rounded-md text-black-600" style={{ background: "var(--hover-color)" }}>+</div>
				<div className="px-2 py-1 rounded-md">
					<IconDots color={iconColor} />
				</div>
			</div>
			<div className="flex gap-6 mt-2">
				<span><strong>20</strong> {t('post')}</span>
				<span><strong>5.2K</strong> {t('follower')}</span>
				<span><strong>120</strong> {t('following')}</span>
			</div>
			<p className="mt-2 text-sm">Bio của bạn có thể ở đây ✨</p>
		</div>
	);
};

export default ProfileInfo;