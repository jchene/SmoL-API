import React from 'react';

interface bannerContent {
	content: string
}
const TopBanner: React.FC<bannerContent> = ({ content }) => {
	return (
		<>
			<div className="flex h-[5vh] text-[white] text-center bg-[#7932bd] border text-[large] font-medium mt-[5px] mx-2.5 rounded-[10px] border-solid border-[black] justify-center items-center">
				{content}
			</div>
		</>
	)
}

export default TopBanner