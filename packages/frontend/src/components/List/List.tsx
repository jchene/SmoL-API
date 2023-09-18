import { useState, useLayoutEffect } from 'react';
import { dbUser } from '../../typedefs/types';
import { client } from '../../main';
import spiner from "../../assets/Spinner-1s-200px.gif"
import PokemonButton from '../subcomponents/buttons/PokemonButton';
import TopBanner from '../subcomponents/banners/TopBanner';
import NavButton from '../subcomponents/buttons/NavButton';

async function updateList(setter: React.Dispatch<React.SetStateAction<dbUser[]>>) {
	const raw = await client.list.query();
	if (!raw)
		return;
	setter(raw.data);
}

function List() {
	const [userList, setUserList] = useState<dbUser[]>([]);
	const groupedUsers = userList.reduce((groups, user) => {
		const key = user.team;
		if (key && !groups[key]) {
			groups[key] = [];
		}
		if (key)
			groups[key].push(user);
		return groups;
	}, {} as Record<string, dbUser[]>);

	useLayoutEffect(() => {
		updateList(setUserList);
	}, [])

	return (
		<>
			<TopBanner content='List Users' />
			<div className="relative flex justify-between">
				<NavButton content='Back' destination='/' />
				<div className="p-8">
					<button onClick={() => {
						setUserList([]);
						updateList(setUserList);
					}}>
						Refresh
					</button>
				</div>
			</div>
			{!userList.length ?
				<div className="flex items-center justify-center">
					<img src={spiner}/>
				</div>
				:
				<div className="bg-[white] text-[black]">
					{Object.entries(groupedUsers).map(([team, members]) => (
						<div key={team} className="border mb-2.5 mx-2.5 rounded-lg border-solid border-[#7932bd]">
							<h2 className="text-[white] bg-[#7932bd] m-0 pl-2.5 rounded-t-md border-b border-solid border-[#7932bd]">
								{team}
							</h2>
							{members.map(member => (
								<p key={member.id} className="pl-2.5">
									{member.name}
								</p>
							))}
						</div>
					))}
				</div>
			}
			<PokemonButton destination='/pokemon'/>
		</>
	)
}

export default List