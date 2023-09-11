import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from "@first-sst-app/core/src/trpcRouter";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import React from 'react'
import Home from './components/Home/Home';
import List from './components/List/List';
import Get from './components/Get/Get';
import './index.css'

export const client = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: 'https://9b9gzemljk.execute-api.eu-west-1.amazonaws.com/trpc',
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
			</Routes>
		</Router>
	</React.StrictMode>,
)