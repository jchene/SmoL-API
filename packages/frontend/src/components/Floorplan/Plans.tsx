import { useState } from 'react';
import TopBanner from '../subcomponents/banners/TopBanner';
import BaseButton from '../subcomponents/buttons/BaseButton';
import axios from 'axios';

function test(data: string) {
	return (
		<div className='p-8' >
			<img src={data} />
		</div >
	)
}

function Plans() {
	const [plan, setPlan] = useState<JSX.Element>(test(""));
	return (
		<>
			<TopBanner content='Plans' />
			<div className='relative flex justify-center'>
				<BaseButton content='python' onClick={() => {
					axios.get("https://setdkhlhgj.execute-api.eu-west-1.amazonaws.com/python").then((response) => {
						setPlan(test(response.data))
					})
				}} />
				{plan}
			</div>
		</>
	)
}

export default Plans