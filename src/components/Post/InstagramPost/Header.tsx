// Header.tsx
import React, { useState, useEffect } from "react";
import { IconDots } from "../../UI/icons/ic_dots";
import { timeAgo } from "../../../utils/date";
import { User } from "../../../types/user";

type Props = {
	user?: User;
	time: string;
	theme: string;
	onEdit: () => void;
	onDelete: () => void;
};

const Header = ({ user, time, theme, onEdit, onDelete }: Props) => {
	const [showMenu, setShowMenu] = useState(false);

	const handleToggleMenu = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowMenu(prev => !prev);
	};

	useEffect(() => {
		if (!showMenu) return;
		const handleClick = () => setShowMenu(false);
		window.addEventListener("click", handleClick);
		return () => window.removeEventListener("click", handleClick);
	}, [showMenu]);

	const iconColor = theme === "dark" ? "white" : "black";

	return (
		<div className="flex items-center justify-between pt-3 pb-3 relative">
			<div className="flex items-center gap-3">
				<img src="/images/uifaces-popular-image (11).jpg" alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-pink-500" />
				<span className="font-semibold text-gray-800" style={{ color: "var(--text-color)" }}>{user?.username}</span>
				<span className="text-[14px] text-gray-400" style={{ color: "var(--white-to-gray)" }}>{timeAgo(time)}</span>
			</div>
			<div onClick={handleToggleMenu} className="text-gray-600 "><IconDots color={iconColor} /></div>
			{showMenu && (
				<div className="absolute right-0 z-10 top-15 bg-white border rounded shadow flex flex-col ">
					<button className="hover:bg-gray-100 p-0 m-0" onClick={onEdit}>Sửa</button>
					<button className="text-red-500 hover:bg-gray-100 p-0 m-0" onClick={onDelete}>Xóa</button>
				</div>
			)}
		</div>
	);
};

export default Header;
