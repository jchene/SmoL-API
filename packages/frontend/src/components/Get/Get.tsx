import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Get.css'

function inputContainer(displayMode: boolean): JSX.Element  {
	if (displayMode){
		return (
			<>
				<input type='text' placeholder='team'></input>
				<input type='text' placeholder='name'></input>
			</>
		)
	}
	return (
		<>
			<input type='text' placeholder='id'></input>
		</>
	)
}

function Get() {
	const [switchDisplayTo, setDisplayTo] = useState<boolean>(false);
	const navigate = useNavigate();

	return (
		<>
			<div className='banner'>
				Get Users by {switchDisplayTo ? 'Team' : 'Id'}
			</div>
			<div className="button-container">
				<div className="card">
					<button onClick={() => { navigate('/'); }}>
						Home
					</button>
				</div>
				<div className="card">
					<button onClick={() => { setDisplayTo(!switchDisplayTo) }}>
						Get by {switchDisplayTo ? 'id' : 'team'}
					</button>
				</div>
			</div>
			<div className='input-container'>
				{inputContainer(switchDisplayTo)}
				<input type='submit' value='Get' className='input-submit'></input>
			</div>
		</>
	)
}

export default Get