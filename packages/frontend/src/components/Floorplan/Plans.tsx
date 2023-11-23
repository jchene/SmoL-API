import React, { useEffect, useState } from 'react';
import TopBanner from '../subcomponents/banners/TopBanner';
import BaseButton from '../subcomponents/buttons/BaseButton';
import axios, { AxiosResponse } from 'axios';

interface PositionProps {
	x: number;
	y: number;
	direction: string;
}

interface CircleProps {
	cx: number;
	cy: number;
	content: string
	onMouseDown: (event: React.MouseEvent<SVGCircleElement>) => void;
	onRightClick: (event: React.MouseEvent<SVGCircleElement>) => void;
}

interface ClickableCirclesProps {
	img: string
	positions: [{ x: number, y: number, direction: string }]
	align: boolean
}

const Circle: React.FC<CircleProps> = ({ cx, cy, content, onMouseDown, onRightClick }) => {
	return (
		<>
			<text x={cx} y={cy + 5} textAnchor="middle" fill="black">{content}</text>
			<circle cx={cx} cy={cy} r={15} fill={`rgba(255, 0, 0, 0.5)`}
				onMouseDown={onMouseDown}
				onContextMenu={onRightClick}
			/>
		</>
	)
};

const ClickableCirclesWithImage: React.FC<ClickableCirclesProps> = ({
	img,
	positions,
	align
}) => {
	const [circlePositions, setCirclePositions] = useState<PositionProps[]>(positions)
	const [draggedCircleIndex, setDraggedCircleIndex] = useState<number | null>(null);
	const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
	const [lastMouseDownPosition, setLastMouseDownPosition] = useState<{ x: number; y: number } | null>(null);
	const alignMaxDistance = 50;
	const groupMinDistance = 120;

	useEffect(() => {
		const basePoints = [...circlePositions];
		const alignedPoints = basePoints.sort((a, b) => {
			if (a.y === b.y)
				return a.x - b.x;
			return a.y - b.y;
		});
		setCirclePositions(alignedPoints);
	}, []);

	useEffect(() => {
		alignPoints();
	}, [align]);

	useEffect(() => {
		console.log("Last mouse down position:", lastMouseDownPosition)
	}, [lastMouseDownPosition]);

	useEffect(() => {
		console.log("Dragged circle index:", draggedCircleIndex)
	}, [draggedCircleIndex]);

	useEffect(() => {
		console.log("Drag offset:", dragOffset)
	}, [dragOffset]);

	useEffect(() => {
		console.log("Circle positions:", circlePositions)
	}, [circlePositions]);

	const alignPoints = () => {
		const sortedPoints = [...circlePositions];
		const alignedPoints = [sortedPoints[0]];
		for (let i = 1; i < sortedPoints.length; i++) {
			const currentPoint = sortedPoints[i];
			for (let j = 0; j < alignedPoints.length; j++) {
				const upPoint = alignedPoints[j];
				if (Math.abs(currentPoint.y - upPoint.y) < alignMaxDistance
					&& Math.abs(currentPoint.x - upPoint.x) < groupMinDistance) {
					currentPoint.y = upPoint.y;
					break;
				}
			}
			for (let j = 0; j < alignedPoints.length; j++) {
				const leftPoint = alignedPoints[j];
				if (Math.abs(currentPoint.x - leftPoint.x) < alignMaxDistance
					&& Math.abs(currentPoint.y - leftPoint.y) < groupMinDistance) {
					currentPoint.x = leftPoint.x;
					break;
				}
			}
			alignedPoints.push(currentPoint);
		}
		setCirclePositions(alignedPoints);
	};

	const handleClick = (event: React.MouseEvent<SVGElement>) => {
		const svgElement = event.currentTarget as SVGSVGElement;
		const point = svgElement.createSVGPoint();
		point.x = event.clientX;
		point.y = event.clientY;
		const svgPoint = point.matrixTransform(svgElement.getScreenCTM()!.inverse());
		const isOverExistingCircle = circlePositions.some(
			(position) => isMouseOverCircle(position.x, position.y, svgPoint.x, svgPoint.y, 15)
		);
		if (isOverExistingCircle) {
			const distanceSinceLastMouseDown = Math.sqrt(
				(lastMouseDownPosition!.x - point.x) ** 2 + (lastMouseDownPosition!.y - point.y) ** 2
			);
			console.log('distanceSinceLastMouseDown', distanceSinceLastMouseDown);
			if (distanceSinceLastMouseDown < 5)
				console.log('clicked on existing circle');
			setLastMouseDownPosition(null);
			return;
		}
		const newPosition: PositionProps = {
			x: svgPoint.x,
			y: svgPoint.y,
			direction: 'left',
		};
		setCirclePositions([...circlePositions, newPosition]);
	}

	const isMouseOverCircle = (x: number, y: number, mouseX: number, mouseY: number, radius: number) => {
		const distance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
		return distance <= radius;
	};

	const handleCircleMouseDown = (index: number, event: React.MouseEvent<SVGCircleElement>) => {
		setDraggedCircleIndex(index);
		const svgElement = event.currentTarget.ownerSVGElement;
		if (svgElement) {
			const point = svgElement.createSVGPoint();
			point.x = event.clientX;
			point.y = event.clientY;
			setLastMouseDownPosition({
				x: point.x,
				y: point.y,
			});
			const svgPoint = point.matrixTransform(svgElement.getScreenCTM()!.inverse());
			setDragOffset({
				x: circlePositions[index].x - svgPoint.x,
				y: circlePositions[index].y - svgPoint.y,
			});
		}
	};

	const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
		if (draggedCircleIndex !== null && dragOffset !== null) {
			const svgElement = event.currentTarget;
			const point = svgElement.createSVGPoint();
			point.x = event.clientX;
			point.y = event.clientY;
			const svgPoint = point.matrixTransform(svgElement.getScreenCTM()!.inverse());
			const updatedCirclePositions = [...circlePositions];
			updatedCirclePositions[draggedCircleIndex] = {
				x: svgPoint.x + dragOffset.x,
				y: svgPoint.y + dragOffset.y,
				direction: 'left',
			};
			setCirclePositions(updatedCirclePositions);
		}
	};

	const handleMouseUp = () => {
		setDraggedCircleIndex(null);
		setDragOffset(null);
	};

	const handleCircleContextMenu = (event: React.MouseEvent<SVGCircleElement>) => {
		event.preventDefault();
		const clickedCircleIndex = circlePositions.findIndex((position, index) => {
			const svgElement = event.currentTarget.ownerSVGElement;
			if (svgElement) {
				const point = svgElement.createSVGPoint();
				point.x = event.clientX;
				point.y = event.clientY;
				const svgPoint = point.matrixTransform(svgElement.getScreenCTM()!.inverse());
				return isMouseOverCircle(position.x, position.y, svgPoint.x, svgPoint.y, 15) && index !== draggedCircleIndex;
			}
			return false;
		});
		if (clickedCircleIndex !== -1) {
			const updatedCirclePositions = [...circlePositions];
			updatedCirclePositions.splice(clickedCircleIndex, 1);
			setCirclePositions(updatedCirclePositions);
		}
	};

	return (
		<div style={{ position: 'relative' }}>
			<img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
			<svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
				onClick={(event) => handleClick(event)}
				onMouseMove={(event) => handleMouseMove(event)}
				onMouseUp={() => handleMouseUp()}
			>
				{circlePositions.map((position, index) => (
					<Circle
						key={index}
						cx={position.x}
						cy={position.y}
						content={String(index)}
						onMouseDown={(event) => handleCircleMouseDown(index, event)}
						onRightClick={(event) => handleCircleContextMenu(event)}
					/>
				))}
			</svg>
		</div>
	);
};

function Plans() {
	const [plan, setPlan] = useState<JSX.Element>(<></>);
	const [response, setResponse] = useState<AxiosResponse<any, any> | undefined>(undefined);
	const [align, setAlign] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		if (response === undefined) return;
		console.log("Setting points")
		setLoading(false);
		setPlan(<ClickableCirclesWithImage
			img={response.data.url}
			positions={response.data.positions}
			align={align}
		/>)
		setAlign(false);
	}, [response, align]);
	return (
		<>
			<TopBanner content='Plans' />
			<div className='relative flex justify-center'>
				{!loading ? <BaseButton content='Python' onClick={() => {
					setLoading(true);
					axios.get("https://setdkhlhgj.execute-api.eu-west-1.amazonaws.com/python").then((response) => {
						setResponse(response)
					})
				}} />
					: <BaseButton loading={true} />
				}
				<BaseButton content='Align Points' onClick={() => setAlign(true)} />
			</div>
			<div className='relative flex justify-center'>
				{plan}
			</div>
		</>
	)
}

export default Plans