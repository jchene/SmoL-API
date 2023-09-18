import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonButton from '../subcomponents/buttons/PokemonButton';

function inputContainer(displayMode: boolean): JSX.Element {
	if (displayMode) {
		return (
			<><input type='text' placeholder='team'></input>
				<input type='text' placeholder='name'></input></>
		)
	}
	return ( <><input type='text' placeholder='id'></input></> )
}

function Get() {
	const [switchDisplayTo, setDisplayTo] = useState<boolean>(false);
	const navigate = useNavigate();
	return (
		<>
			<div className="h-[5vh] text-[white] text-center bg-[#7932bd] border text-[large] font-medium mt-[5px] mx-2.5 px-0 py-2.5 rounded-[10px] border-solid border-[black]">
				Get Users by {switchDisplayTo ? 'Team' : 'Id'}
			</div>
			<div className="relative flex justify-between">
				<div className="p-8">
					<button onClick={() => { navigate('/'); }}>
						Home
					</button>
				</div>
				<div className="p-8">
					<button onClick={() => { setDisplayTo(!switchDisplayTo) }}>
						Get by {switchDisplayTo ? 'id' : 'team'}
					</button>
				</div>
			</div>
			<div className="h-[5vh] text-[black] border text-center mx-2.5 rounded-lg border-solid border-[#7932bd]">
				{inputContainer(switchDisplayTo)}
				<div className="p-8">
					<button className="bg-[#7932bd] text-[white]" onClick={() => { }}>
						Get
					</button>
				</div>
			</div>
			<PokemonButton destination='/pokemon' />
		</>
	)
}

export default Get