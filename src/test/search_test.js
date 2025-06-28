import http from 'k6/http';
import { check } from 'k6';

export const options = {
	vus: 500,      
	duration: '60s'  
};

export default function () {
	const res = http.get('http://localhost:8000/api/users/search/?q=user200');
	check(res, {
		'status is 200': (r) => r.status === 200,
	});
}
