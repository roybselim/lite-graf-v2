import { useState } from 'react';
import './App.css';
import useWindowDimensions from './useWindowDimensions';

interface IGraphProps {
	unitSize: number;
	horizontalShift: number;
	verticalShift: number;
	graphType: string;
	equation: string;
}

function Graph(_props: IGraphProps) {
	const { unitSize, horizontalShift, verticalShift, graphType, equation } =
		_props;

	const [showPointsTooltip, setShowPointsTooltip] = useState(true);
	const [tooltipX, setTooltipX] = useState(0);
	const [tooltipY, setTooltipY] = useState(0);
	const [valueY, setValueY] = useState('');
	const [valueX, setValueX] = useState('');

	const { width, height } = useWindowDimensions();
	const verticalCenter = (width + horizontalShift) / 2;
	const horizontalCenter = (height - verticalShift) / 2;
	let integrand = 0;

	const getEquation = (point: number) => {
		return eval(
			equation
				.replace(/(?<=(\d|x))x/g, '*x')
				.replace(/(?<=(\d|Math.E|x))Math/g, '*Math')
				.replace(/x/g, `(${(point / unitSize).toString()})`)
		);
	};

	const getValueAtPoint = (point: number): number => {
		try {
			const exactPoint = getEquation(point);
			switch (graphType) {
				case 'Equation':
					return exactPoint;
				case 'Differentiate':
					const pointPlusOne = getEquation(point + 1);
					return (pointPlusOne - exactPoint) / ((point + 1 - point) / unitSize);
				case 'Integrate':
					integrand += exactPoint;
					return integrand / (unitSize * 2);
				default:
					return 0;
			}
		} catch (_e) {
			return 0;
		}
	};

	const showPoints = (event: any, y: string, x: string) => {
		setTooltipX(event.screenX);
		setTooltipY(event.screenY);
		setValueY(y);
		setValueX(x);
	};

	const generateGridsCoordinatesPoints = () => {
		let contents: any = [];
		const remainder_x = verticalCenter % unitSize;
		const remainder_y = horizontalCenter % unitSize;
		const biggerValue = Math.max(width, height);
		for (let i = 0; i < biggerValue; i++) {
			if (Math.abs(i - remainder_x) % unitSize < 1) {
				contents.push(
					<div
						key={`${Math.random() * Date.now()}`}
						className="absBlack verticalGrid"
						style={{
							left: `${i}px`,
						}}
					/>
				);
				contents.push(
					<div
						key={`${Math.random() * Date.now()}`}
						className="coordinate"
						style={{
							left: `${i + 3}px`,
							top: `${horizontalCenter}px`,
						}}
					>
						{-Math.round((verticalCenter - i) / unitSize).toFixed(0)}
					</div>
				);
			}
			if (Math.abs(i - remainder_y) % unitSize < 1 && i < height) {
				contents.push(
					<div
						key={`${Math.random() * Date.now()}`}
						className="absBlack horizontalGrid"
						style={{
							top: `${i - 1}px`,
						}}
					/>
				);
				contents.push(
					<div
						key={`${Math.random() * Date.now()}`}
						className="coordinate"
						style={{
							left: `${verticalCenter + 3}px`,
							top: `${i}px`,
						}}
					>
						{Math.round((horizontalCenter - i) / unitSize).toFixed(0)}
					</div>
				);
			}
			const valueAtPoint =
				getValueAtPoint(i - verticalCenter) * unitSize +
				(horizontalCenter + verticalShift);
			const valueAtPrevPoint =
				getValueAtPoint(i + 1 - verticalCenter) * unitSize +
				(horizontalCenter + verticalShift);
			const length = Math.abs(valueAtPoint - valueAtPrevPoint);
			if (valueAtPoint >= 0) {
				contents.push(
					<div
						onMouseOver={(event) => {
							setShowPointsTooltip(true);
							showPoints(
								event,
								(
									valueAtPoint / unitSize -
									(horizontalCenter + verticalShift) / unitSize
								).toFixed(2),
								((i - verticalCenter) / unitSize).toFixed(2)
							);
						}}
						onMouseOut={() => {
							setShowPointsTooltip(false);
						}}
						key={`${Math.random() * Date.now()}`}
						className="equationValue"
						style={{
							cursor: 'pointer',
							height: `${length + 2}px`,
							left: `${i}px`,
							bottom: `${valueAtPoint}px`,
							backgroundColor: {
								Equation: 'green',
								Differentiate: 'blue',
								Integrate: 'red',
							}[graphType],
						}}
					/>
				);
			}
		}
		return contents;
	};

	return (
		<div className="App" style={{ width, height }}>
			{generateGridsCoordinatesPoints()}
			<div
				style={{
					display: showPointsTooltip ? 'flex' : 'none',
					position: 'absolute',
					top: tooltipY - 180,
					left: tooltipX - 50,
					backgroundColor: '#b1b1b1',
					padding: '5px',
					borderRadius: '5px',
					fontSize: '12px',
					boxShadow:
						'0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
				}}
			>
				<span>{`x: ${valueX} y: ${valueY}`}</span>
			</div>
		</div>
	);
}

export default Graph;
