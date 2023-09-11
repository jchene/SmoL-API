import './Home.css'
import { useNavigate } from 'react-router-dom'

function Home() {
	const navigate = useNavigate()
	return (
		<>
			<div className='title-container'>
				<h1>tRPC API</h1>
			</div>
			<div className="button-container">
				<div className="card">
					<button onClick={() => { navigate('/list'); }}>
						List users
					</button>
				</div>
				<div className="card">
					<button onClick={() => { navigate('/'); }}>
						Create user
					</button>
				</div>
				<div className="card">
					<button onClick={() => { navigate('/get'); }}>
						Get users
					</button>
				</div>
				<div className="card">
					<button onClick={() => { navigate('/'); }}>
						Delete users
					</button>
				</div>
			</div>
		</>
	)
}

export default Home