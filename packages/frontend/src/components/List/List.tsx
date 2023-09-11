import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from "@first-sst-app/core/src/trpcRouter";
import { useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './List.css'

interface User {
	id: string
	name?: string
	team?: string
}

export const client = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: 'https://9b9gzemljk.execute-api.eu-west-1.amazonaws.com/trpc',
		}),
	],
});

async function updateList(setter: React.Dispatch<React.SetStateAction<User[]>>) {
	const raw = await client.list.query();
	if (!raw)
		return;
	setter(raw.data);
}

function List() {
	const [userList, setUserList] = useState<User[]>([]);
	const navigate = useNavigate();
	const groupedUsers = userList.reduce((groups, user) => {
		const key = user.team;
		if (key && !groups[key]) {
			groups[key] = [];
		}
		if (key)
			groups[key].push(user);
		return groups;
	}, {} as Record<string, User[]>);

	useLayoutEffect(() => {
		updateList(setUserList);
	}, [])

	return (
		<>
			<div className='banner'>List Users</div>
			<div className="button-container">
				<div className="card">
					<button onClick={() => { navigate('/'); }}>
						Home
					</button>
				</div>
				<div className="card">
					<button onClick={() => { updateList(setUserList); }}>
						Refresh
					</button>
				</div>
			</div>
			<div className='user-container'>
				{Object.entries(groupedUsers).map(([team, members]) => (
					<div key={team} className='team'>
						<h2>{team}</h2>
						{members.map(member => (
							<p key={member.id}>{member.name}</p>
						))}
					</div>
				))}
			</div>
		</>
	)
}

export default List