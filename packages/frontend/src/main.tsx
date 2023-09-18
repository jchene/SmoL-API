import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from "@first-sst-app/core/src/trpcRouter";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import React from 'react'
import Get from './components/Get/Get';
import Home from './components/Home/Home';
import List from './components/List/List';
import Pokemon from './components/Pokemon/Pokemon';
import Floorplan from './components/Floorplan/Floorplan';
import './index.css'

export const client = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: 'https://djrn4etstc.execute-api.eu-west-1.amazonaws.com/trpc',
		}),
	],
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/list" element={<List />} />
				<Route path="/get" element={<Get />} />
				<Route path="/pokemon" element={<Pokemon />} />
				<Route path="/floorplan" element={<Floorplan />} />
			</Routes>
		</Router>
	</React.StrictMode>,
)