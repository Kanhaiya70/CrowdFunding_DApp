import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { Sidebar, Navbar, PageAnimation } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile, Payment, Withdraw } from './pages';

const App = () => {
	const location = useLocation();

	return (
		<div className="relative sm: -8 p-4 bg-[#13131a] min-h-screen flex flex-row">
			<div className='sm:flex hidden mr-10 relative'>
				<Sidebar />
			</div>

			<div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
				<Navbar />

				<AnimatePresence mode='wait'>
					<Routes location={location} key={location.pathname}>
						<Route path='/' element={
							<PageAnimation>
								<Home />
							</PageAnimation>
						} />
						<Route path='/profile' element={
							<PageAnimation>
								<Profile />
							</PageAnimation>
						} />
						<Route path='/create-campaign' element={
							<PageAnimation>
								<CreateCampaign />
							</PageAnimation>
						} />
						<Route path='/campaign-details/:id' element={
							<PageAnimation>
								<CampaignDetails />
							</PageAnimation>
						} />
						<Route path='/payment' element={
							<PageAnimation>
								<Payment />
							</PageAnimation>
						} />
						<Route path='/withdraw' element={
							<PageAnimation>
								<Withdraw />
							</PageAnimation>
						} />
					</Routes>
				</AnimatePresence>
			</div>
		</div>
	)
}

export default App