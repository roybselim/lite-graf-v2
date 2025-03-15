import { useState } from 'react';
import './App.css';
import useWindowDimensions from './useWindowDimensions';

interface IGraphProps {
	unitSize: number;
	horizontalShift: number;
	verticalShift: number;
	graphTypes: string[];
	equations: string[];
	setVerticalShift: (val: number) => void;
	setHorizontalShift: (val: number) => void;
	colors: string[];
}

function Graph(_props: IGraphProps) {
	const {
		unitSize,
		horizontalShift,
		verticalShift,
		graphTypes,
		setVerticalShift,
		setHorizontalShift,
		equations,
		colors,
	} = _props;

	const [showPointsTooltip, setShowPointsTooltip] = useState(true);
	const [tooltipX, setTooltipX] = useState(0);
	const [tooltipY, setTooltipY] = useState(0);
	const [valueY, setValueY] = useState('');
	const [valueX, setValueX] = useState('');
	const [pressed, setPressed] = useState(false);

	const { width, height } = useWindowDimensions();
	const verticalCenter = (width + horizontalShift) / 2;
	const horizontalCenter = (height - verticalShift) / 2;
	let integrand = 0;

	const onMouseMove = (event: any) => {
		if (pressed) {
			setVerticalShift(verticalShift - event.movementY * 3);
			setHorizontalShift(horizontalShift + event.movementX * 3);
		}
	};

	const getEquation = (equation: any, point: number) => {
		return eval(
			equation
				.replace(/(?<=(\d|x))x/g, '*x')
				.replace(/(?<=(\d|Math.E|x))Math/g, '*Math')
				.replace(/x/g, `(${(point / unitSize).toString()})`)
		);
	};

	const getValueAtPoint = (
		equation: any,
		ndx: number,
		point: number
	): number => {
		try {
			const exactPoint = getEquation(equation, point);
			switch (graphTypes[ndx]) {
				case 'Equation':
					return exactPoint;
				case 'Differentiate':
					const pointPlusOne = getEquation(equation, point + 1);
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
			equations.forEach((eq, _ndx) => {
				const valueAtPoint =
					getValueAtPoint(eq, _ndx, i - verticalCenter) * unitSize +
					(horizontalCenter + verticalShift);
				const valueAtPrevPoint =
					getValueAtPoint(eq, _ndx, i + 1 - verticalCenter) * unitSize +
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
								height: `${length + 2}px`,
								left: `${i}px`,
								bottom: `${valueAtPoint}px`,
								backgroundColor: colors[_ndx],
							}}
						/>
					);
				}
			});
		}
		return contents;
	};

	return (
		<div
			className="App"
			style={{ width, height }}
			onMouseMove={onMouseMove}
			onMouseDown={() => setPressed(true)}
			onMouseUp={() => setPressed(false)}
		>
			{generateGridsCoordinatesPoints()}
			<div
				className="tooltip"
				style={{
					display: showPointsTooltip ? 'flex' : 'none',
					top: tooltipY - 180,
					left: tooltipX - 50,
				}}
			>
				<span>{`x: ${valueX} y: ${valueY}`}</span>
			</div>
		</div>
	);
}

export default Graph;
