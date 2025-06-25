import { Outlet } from 'react-router-dom';
import "./LayoutDefault.scss"
import SideBar from '../../components/UI/SideBar';

export default function LayoutDefault() {
	return (
		<div className='layout-app'>
			<div className='sidebar'>
				<SideBar />
			</div>
			<div className='main-content'>
				<Outlet />
			</div>
		</div>
	);
}
