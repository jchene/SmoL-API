import React, { useEffect, useState } from 'react';
import TopBanner from '../subcomponents/banners/TopBanner';
import { client } from '../../main';

async function updatePlans(setter: React.Dispatch<React.SetStateAction<JSX.Element[]>>) {
	const plansObject = await client.listPlans.query();
	if (!plansObject){
		setter([]);
		return;
	}
}

function Plans() {
	const [planList, setPlanList] = useState<JSX.Element[]>([]);
	useEffect(() => {
		updatePlans(setPlanList);
	}, [])
	return (
		<>
			<TopBanner content='Plans' />
			<div className={'text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}>
				{...planList}
				<div className='p-8'>
					<img src="https://jchene-first-sst-app-createb-assetsbucket5f3b285a-ke23l8et3h37.s3.eu-west-1.amazonaws.com/result.jpg" />
				</div>
			</div>
		</>
	)
}

export default Plans