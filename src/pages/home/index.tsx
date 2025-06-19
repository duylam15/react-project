import React, { useEffect } from 'react';
import StoryList from '../../components/StoryList/StoryList';
import Avatar from '../../components/Avatar';
import { useTranslation } from 'react-i18next';
import { callLogout, getPost, getUser } from '../../services/auth';
import useUserStore from '../../stores/useUserStore';
import { useLocation, useNavigate } from 'react-router-dom';

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
	const onCLick2 = () => {
		getPost()
	}
	console.log("user ngoài", user)

	useEffect(() => {
		getPost()
		getUser()
	}, [])

	return (
		<div className="home flex gap-25 justify-center  ml-30">
			<StoryList />
			<div className='w-80 mt-6'>
				<div className="flex  items-center justify-between gap-20">
					<Avatar height='h-12' width='w-12' />
					<div className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400" onClick={onCLick}>
						{t('switch')}adada
					</div>
				</div>
				<div className='flex items-center justify-between mt-7'>
					<div className='font-medium text-gray-500'>{t('suggested_for_you')}</div>
					<div className='font-medium text-[14px] text-black-500'>{t('view_all')}</div>
				</div>

				<div className="cursor-pointer flex flex-col gap-5 mt-4  justify-between w-full">
					<div className="flex  items-center justify-between gap-20">
						<Avatar height='h-12' width='w-12' />
						<div onClick={onCLick2} className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400">
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
		</div>
	);
}
