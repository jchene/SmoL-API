import { useState } from 'react';
import TopBanner from '../subcomponents/banners/TopBanner';
import BaseButton from '../subcomponents/buttons/BaseButton';
import axios from 'axios';

interface CircleProps {
	cx: number;
	cy: number;
	onClick: () => void;
	content: string
}

const Circle: React.FC<CircleProps> = ({ cx, cy, onClick, content }) => {
	return (
		<>
			<text x={cx} y={cy+5} text-anchor="middle" fill="black">{content}</text>
			<circle cx={cx} cy={cy} r={15} fill={`rgba(255, 0, 0, 0.5)`} onClick={onClick}/>
		</>
	)
};

interface ClickableCirclesProps {
	img: string
	positions: [[number, number]]
}

const ClickableCirclesWithImage: React.FC<ClickableCirclesProps> = ({ img, positions }) => {
	const circlePositions = positions
	const handleCircleClick = (index: number) => {
		alert(`Clicked Circle ${index + 1}`);
	};
	return (
		<div style={{ position: 'relative' }}>
			<img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
			<svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
				{circlePositions.map((position, index) => (
					<Circle
						key={index}
						cx={position[0]}
						cy={position[1]}
						onClick={() => handleCircleClick(index)}
						content={String(index)}
					/>
				))}
			</svg>
		</div>
	);
};

function Plans() {
	const [plan, setPlan] = useState<JSX.Element>(<></>);
	return (
		<>
			<TopBanner content='Plans' />
			<div className='relative flex justify-center'>
				<BaseButton content='python' onClick={() => {
					axios.get("https://setdkhlhgj.execute-api.eu-west-1.amazonaws.com/python").then((response) => {
						setPlan(<ClickableCirclesWithImage img={response.data.url} positions={response.data.positions}/>)
					})
				}} />
			</div>
			<div className='relative flex justify-center'>
				{plan}
			</div>
		</>
	)
}

export default Plans