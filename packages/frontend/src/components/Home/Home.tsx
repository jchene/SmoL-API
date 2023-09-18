import PokemonButton from '../subcomponents/buttons/PokemonButton';
import NavButton from '../subcomponents/buttons/NavButton';
import TopBanner from '../subcomponents/banners/TopBanner';

function Home() {
	return (
		<>
			<TopBanner content='tRPC API'/>
			<div className="relative flex justify-between">
				<NavButton content='List users' destination='/list'/>
				<NavButton content='Create users' destination='/'/>
				<NavButton content='Get users' destination='/get'/>
				<NavButton content='Delete users' destination='/'/>
			</div>
			<TopBanner content='Floorplan'/>
			<div className="relative flex justify-center">
				<NavButton content='Floorplan' destination='/floorplan'/>
			</div>
			<PokemonButton destination='/pokemon'/>
		</>
	)
}

export default Home