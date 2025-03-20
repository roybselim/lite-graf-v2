import { useState } from 'react';
import './App.css';
import useWindowDimensions from './useWindowDimensions';
import useStore from './store';

interface IGraphProps {}

function Graph(_props: IGraphProps) {
	const [valueY, setValueY] = useState('');
	const [valueX, setValueX] = useState('');
	const [tooltipY, setTooltipY] = useState(0);
	const [tooltipX, setTooltipX] = useState(0);
	const [pressed, setPressed] = useState(false);
	const [showPointsTooltip, setShowPointsTooltip] = useState(true);

	const {
		scale,
		angular,
		unitSize,
		calculators,
		verticalShift,
		horizontalShift,
		setVerticalShift,
		setHorizontalShift,
	} = useStore((state) => state);
	let integrand = 0;
	const useAngular = angular ? Math.PI : 1;
	const { width, height } = useWindowDimensions();
	const verticalCenter = (width + horizontalShift) / 2;
	const horizontalCenter = (height - verticalShift) / 2;
	const decimalPoints = (scale || 1).toString().split('.')[1] || [];

	const onMouseMove = (event: any) => {
		if (pressed) {
			setVerticalShift(verticalShift - event.movementY * 3);
			setHorizontalShift(horizontalShift + event.movementX * 3);
		}
	};

	const getEquation = (equation: any, point: number, useDegrees: boolean) => {
		const preEquation = useDegrees
			? equation.replace(
					/(?<=(sin\(|cos\(|tan\(|sin|cos|tan).*)x/g,
					`(${((point / unitSize) * (Math.PI / 180)).toString()})`
			  )
			: equation;
		return eval(
			preEquation.replace(/x/g, `(${(point / unitSize).toString()})`)
		);
	};

	const getValueAtPoint = (
		equation: string,
		point: number,
		type: string,
		useDegrees: boolean
	): number => {
		try {
			const exactPoint = getEquation(equation, point, useDegrees);
			switch (type) {
				case 'Equation':
					return exactPoint;
				case 'Differentiate':
					const pointPlusOne = getEquation(equation, point + 1, useDegrees);
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
		setValueX(`${x}${useAngular > 1 ? 'π' : ''}`);
	};

	const generateGridsCoordinatesPoints = () => {
		let contents: any = [];
		const remainder_x = (verticalCenter / useAngular) % unitSize;
		const remainder_y = horizontalCenter % unitSize;
		const biggerValue = Math.max(width, height);
		for (let i = 0; i < biggerValue; i++) {
			if (
				Math.abs(i / useAngular - remainder_x) % unitSize < 1 / useAngular &&
				i < width
			) {
				contents.push(
					<div
						key={`${i}-verticalGrid-${useAngular ? 'angular' : ''}`}
						className="absBlack verticalGrid"
						style={{
							left: `${i}px`,
						}}
					/>
				);
				contents.push(
					<div
						key={`${i}-verticalCoordinate-${useAngular ? 'angular' : ''}`}
						className="coordinate"
						style={{
							left: `${i + 3}px`,
							top: `${horizontalCenter}px`,
							fontSize: 8 * Math.E ** (0.005 * unitSize),
						}}
					>
						{`${-(
							((verticalCenter - i) / useAngular / unitSize) *
							scale
						).toFixed(decimalPoints.length)}${useAngular > 1 ? 'π' : ''}`}
					</div>
				);
			}
			if (Math.abs(i - remainder_y) % unitSize < 1 && i < height) {
				contents.push(
					<div
						key={`${i}-horizontal`}
						className="absBlack horizontalGrid"
						style={{
							top: `${i - 1}px`,
						}}
					/>
				);
				contents.push(
					<div
						key={`${i}-horizontalCoordinate`}
						className="coordinate"
						style={{
							left: `${verticalCenter + 3}px`,
							top: `${i}px`,
							fontSize: 8 * Math.E ** (0.005 * unitSize),
						}}
					>
						{
							+(((horizontalCenter - i) / unitSize) * scale).toFixed(
								decimalPoints.length
							)
						}
					</div>
				);
			}
			calculators.forEach((calc) => {
				const { parsedEquation, graphType, useDegrees } = calc;
				const shifts = horizontalCenter + verticalShift;
				const scaledUnitSize = unitSize / scale;
				const valueAtPoint =
					getValueAtPoint(
						parsedEquation,
						(i - verticalCenter) * scale,
						graphType,
						useDegrees
					) *
						scaledUnitSize +
					shifts;
				const valueAtPrevPoint =
					getValueAtPoint(
						parsedEquation,
						(i + 1 - verticalCenter) * scale,
						graphType,
						useDegrees
					) *
						scaledUnitSize +
					shifts;
				const length = Math.abs(valueAtPoint - valueAtPrevPoint);
				if (valueAtPoint >= 0) {
					contents.push(
						<div
							onMouseOver={(event) => {
								setShowPointsTooltip(true);
								showPoints(
									event,
									(valueAtPoint - shifts).toFixed(2),
									((i - verticalCenter) / useAngular / scaledUnitSize).toFixed(
										2
									)
								);
							}}
							onMouseOut={() => {
								setShowPointsTooltip(false);
							}}
							key={`${calc.equation}-${i}-${useDegrees ? 'deg' : 'rad'}`}
							className="equationValue"
							style={{
								height: `${length + 2}px`,
								left: `${i}px`,
								bottom: `${valueAtPoint}px`,
								backgroundColor: calc.color,
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
