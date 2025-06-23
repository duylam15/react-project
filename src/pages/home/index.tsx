import React, { useEffect } from 'react';
import StoryList from '../../components/StoryList/StoryList';
import Avatar from '../../components/Avatar';
import { useTranslation } from 'react-i18next';
import { callLogout } from '../../services/auth';
import useUserStore from '../../stores/useUserStore';
import { useLocation, useNavigate } from 'react-router-dom';
import ListPost from '../../components/ListPost';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../../services/user';

export default function Home() {
	const { t } = useTranslation();
	const user = useUserStore((state: any) => state?.user);
	const setUser = useUserStore((state) => state?.setUser);
	const navigate = useNavigate()

	const onCLick = () => {
		callLogout()
		setUser(null);
		localStorage.removeItem("isLogin");
		navigate("/login");
	}

	useEffect(() => {
		const testApis = async () => {
			// Get all users
			const allUsers = await getAllUsers();
			console.log("All users:", allUsers);

			// Get user id 2
			const user2 = await getUser(3);
			console.log("User 2:", user2);

			// Tạo mới user
			// const newUser = await createUser({ username: "test", email: "test@email.com" });
			// console.log("Created user:", newUser.data);

			// // Cập nhật user
			// const updated = await updateUser("2", { username: "newname" });
			// console.log("Updated user 2:", updated.data);

			// // Xóa user
			// const deleted = await deleteUser("4");
			// console.log("Deleted user 2:", deleted);
		};

		testApis();
	}, []);

	const onClick2 = async (e: any) => {
		e.preventDefault(); // chặn reload nếu là submit của form
		const updated = await createUser({
			username: "duyxxxxxxx2lx22am_updated",
			email: "duylamx22xxxxxx_updx22ated@example.com",
			password: "123456132",
			first_name: "Duy",
			last_name: "Lam",
			phone_number: "0982227654321",
			url_avatar: "https://example.com/avatar_new.png",
			url_background: "https://example.com/bg_new.jpg",
			is_active: true,
			is_online: true
		}
		);
		console.log("Updated user 2:", updated);
	};



	return (
		<div className="home flex gap-25 justify-center  ml-30">
			<div className='flex flex-col' >
				<StoryList />
				<ListPost />
			</div>
			<div className='w-80 mt-6'>
				<div className="flex  items-center justify-between gap-20" >
					<Avatar height='h-12' width='w-12' />
					<div className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400" onClick={onCLick}>
						{t('switch')}
					</div>
				</div>
				<div className='flex items-center justify-between mt-7'>
					<div className='font-medium text-gray-500'>{t('suggested_for_you')}</div>
					<div className='font-medium text-[14px] text-black-500'>{t('view_all')}</div>
				</div>

				<div className="cursor-pointer flex flex-col gap-5 mt-4  justify-between w-full">
					<div className="flex  items-center justify-between gap-20">
						<Avatar height='h-12' width='w-12' />
						<div className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400">
							{t('follow')}
						</div>
					</div>
					<div className="flex  items-center justify-between gap-20">
						<Avatar height='h-12' width='w-12' />
						<div className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400">
							{t('follow')}
						</div>
					</div>
				</div>
			</div>
		</div >
	);
}
