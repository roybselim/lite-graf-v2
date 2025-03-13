import './App.css';
import useWindowDimensions from './useWindowDimensions';

interface IGraphProps {
	unitSize: number;
	horizontalShift: number;
	verticalShift: number;
	graphType: string;
}

function Graph(_props: IGraphProps) {
	const { unitSize, horizontalShift, verticalShift, graphType } = _props;

	const { width, height } = useWindowDimensions();
	const verticalCenter = (width + horizontalShift) / 2;
	const horizontalCenter = (height - verticalShift) / 2;
	let integrand = 0;

	const getValueAtPoint = (eq: string, point: number): number => {
		const exactPoint = eval(eq.replace(/x/g, (point / unitSize).toString()));
		switch (graphType) {
			case 'Equation':
				return exactPoint;
			case 'Differential':
				const pointPlusOne = eval(
					eq.replace(/x/g, ((point + 1) / unitSize).toString())
				);
				return (pointPlusOne - exactPoint) / ((point + 1 - point) / unitSize);
			case 'Integral':
				integrand += exactPoint;
				return integrand / unitSize;
			default:
				return 0;
		}
	};

	const generateGridsCoordinatesPoints = () => {
		let contents: any = [];
		const remainder_x = verticalCenter % unitSize;
		for (let i = 0; i < width; i++) {
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
							left: `${i}px`,
							top: `${horizontalCenter}px`,
						}}
					>
						{-Math.round((verticalCenter - i) / unitSize).toFixed(0)}
					</div>
				);
			}
			const pointAtValue =
				getValueAtPoint('Math.sin(x)', i - verticalCenter) * unitSize +
				(horizontalCenter + verticalShift);
			if (pointAtValue >= 0) {
				contents.push(
					<div
						key={`${Math.random() * Date.now()}`}
						className="equationValue"
						style={{
							left: `${i}px`,
							bottom: `${pointAtValue}px`,
						}}
					/>
				);
			}
		}
		const remainder_y = horizontalCenter % unitSize;
		for (let j = 0; j < height; j++) {
			if (Math.abs(j - remainder_y) % unitSize < 1) {
				contents.push(
					<div
						key={`${Math.random() * Date.now()}`}
						className="absBlack horizontalGrid"
						style={{
							top: `${j - 1}px`,
						}}
					/>
				);
				contents.push(
					<div
						key={`${Math.random() * Date.now()}`}
						className="coordinate"
						style={{
							left: `${verticalCenter}px`,
							top: `${j}px`,
						}}
					>
						{Math.round((horizontalCenter - j) / unitSize).toFixed(0)}
					</div>
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
