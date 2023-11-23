import PokemonButton from '../subcomponents/buttons/PokemonButton';
import NavButton from '../subcomponents/buttons/NavButton';
import TopBanner from '../subcomponents/banners/TopBanner';
import { useState } from 'react';
import BaseButton from '../subcomponents/buttons/BaseButton';
import Plans from './Plans';
import UploadContainer from './Upload';
import { client } from '../../main';
import spiner from "../../assets/Spinner-1s-200px.gif"

function Floorplan() {
	const [actualElement, setActualElement] = useState(<Plans />)
	return (
		<>
			<TopBanner content='Floorplan' />
			<div className="relative flex justify-center">
				<NavButton content='Home' destination='/' />
				<BaseButton content='Plans' onClick={() => { setActualElement(<Plans />) }} />
				<BaseButton content='Upload' onClick={() => {
					setActualElement(<img src={spiner}/>)
					client.signedUrl.query().then((deskPresignedUrl) => {
						client.signedUrl.query().then((floorplanPresignedUrl) => {
							setActualElement(<UploadContainer floorplanPresignedUrl={floorplanPresignedUrl.url} deskPresignedUrl={deskPresignedUrl.url} />)
						})
					})
				}} />
			</div>
			{actualElement}
			<PokemonButton destination='/pokemon' />
		</>
	)
}

export default Floorplan