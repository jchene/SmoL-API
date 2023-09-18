import React from 'react';
import { useNavigate } from 'react-router-dom';
import pika from "../../../assets/pika_small.png"

interface buttonDestination {
	destination: string
}
const PokemonButton: React.FC<buttonDestination> = ({ destination })=> {
	const navigate = useNavigate()
	return (
		<>
			<div className="relative">
				<img src={pika} className="fixed right-0 bottom-0" onClick={() => { navigate(destination); }} />
			</div>
		</>
	)
}

export default PokemonButton