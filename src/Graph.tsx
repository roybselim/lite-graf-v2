import './App.css';
import useWindowDimensions from './useWindowDimensions';

interface IGraphProps {
	unitSize: number;
	horizontalShift: number;
	verticalShift: number;
	graphType: string;
	equation: any;
}

function Graph(_props: IGraphProps) {
	const { unitSize, horizontalShift, verticalShift, graphType, equation } =
		_props;

	const { width, height } = useWindowDimensions();
	const verticalCenter = (width + horizontalShift) / 2;
	const horizontalCenter = (height - verticalShift) / 2;
	let integrand = 0;

	const getValueAtPoint = (point: number): number => {
		try {
			const exactPoint = eval(
				equation.replace(/x/g, (point / unitSize).toString())
			);
			switch (graphType) {
				case 'Equation':
					return exactPoint;
				case 'Differentiate':
					const pointPlusOne = eval(
						equation.replace(/x/g, ((point + 1) / unitSize).toString())
					);
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
		</div>
	);
}

export default Graph;
