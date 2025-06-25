type Props = {
	user: any;
	isOwnProfile: boolean;
	onUpload: (file: File) => void;
};

const AvatarSection = ({ user, isOwnProfile, onUpload }: Props) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) onUpload(file);
	};

	return (
		<div
			className="w-[168px] h-[168px] rounded-full overflow-hidden border-2 p-1.5 border-pink-500 cursor-pointer"
			onClick={() => isOwnProfile && document.getElementById("avatarInput")?.click()}
		>
			<img
				src={user?.avatar_url}
				alt="Avatar"
				className="object-cover rounded-[99px]"
			/>
			<input
				type="file"
				id="avatarInput"
				accept="image/*"
				style={{ display: "none" }}
				onChange={handleChange}
			/>
		</div>
	);
};

export default AvatarSection;