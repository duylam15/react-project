import React from 'react'
import { useTranslation } from 'react-i18next';
import useUserStore from '../../stores/useUserStore';

export default function Avatar({ width, height, isFriend }: { width: string, height: string, isFriend?: boolean }) {
	const { t } = useTranslation();
	const user = useUserStore((state: any) => state?.user);
	return (
		<div className='flex  items-center justify-center gap-3'>
			<img src="/public/images/uifaces-popular-image (11).jpg" className={`${width} ${height} rounded-full`} />
			<div className="font-medium text-[15px] flex flex-col gap-0">
				{!isFriend ? `${user?.username}` : <p>username</p>}
				<p className='text-[14px] font-light'>{t('suggested_for_you')}</p>
			</div>
		</div >
	)
}
