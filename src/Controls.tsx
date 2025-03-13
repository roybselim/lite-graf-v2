import useWindowDimensions from './useWindowDimensions';

interface IControlProps {
	unitSize: number;
	setUnitSize: (val: number) => void;
	horizontalShift: number;
	setHorizontalShift: (val: number) => void;
	verticalShift: number;
	setVerticalShift: (val: number) => void;
	setGraphType: (val: string) => void;
}

const Controls = (_props: IControlProps) => {
	const {
		unitSize,
		setUnitSize,
		horizontalShift,
		setHorizontalShift,
		verticalShift,
		setVerticalShift,
		setGraphType,
	} = _props;
	const { width, height } = useWindowDimensions();
	const maxDim = Math.max(width, height);
	const minDim = Math.min(width, height);

	return (
		<div className="Controls">
			<input
				type="range"
				min={0}
				max={minDim}
				value={unitSize}
				onChange={(event) => {
					setUnitSize(parseInt(event.currentTarget.value));
				}}
			/>
			<input
				type="range"
				min={-maxDim}
				max={maxDim}
				value={horizontalShift}
				onChange={(event) => {
					setHorizontalShift(parseInt(event.currentTarget.value));
				}}
			/>
			<input
				type="range"
				min={-minDim}
				max={minDim}
				value={verticalShift}
				onChange={(event) => {
					setVerticalShift(parseInt(event.currentTarget.value));
				}}
			/>
			<select
				onChange={(event) => {
					setGraphType(event.currentTarget.value);
				}}
			>
				<option>Equation</option>
				<option>Differential</option>
				<option>Integral</option>
			</select>
		</div>
	);
};

export default Controls;
