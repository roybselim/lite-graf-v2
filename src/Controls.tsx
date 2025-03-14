import useWindowDimensions from './useWindowDimensions';

interface IControlProps {
	unitSize: number;
	setUnitSize: (val: number) => void;
	horizontalShift: number;
	setHorizontalShift: (val: number) => void;
	verticalShift: number;
	setVerticalShift: (val: number) => void;
	setGraphType: (val: string) => void;
	setEquation: (val: string[]) => void;
	graphType: string;
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
		graphType,
		setEquation,
	} = _props;
	const { width, height } = useWindowDimensions();
	const maxDim = Math.max(width, height);
	const minDim = Math.min(width, height);

	return (
		<div className="Controls">
			<div className="controlsContainer">
				<div className="controlContainer">
					<span>Examples&nbsp;</span>
					<select
						onChange={(event) => {
							switch (event.currentTarget.value) {
								case 'none':
									setEquation([]);
									break;
								case 'line':
									setEquation(['x']);
									break;
								case 'quadratic':
									setEquation(['(', 'x', ')', '**', '2']);
									break;
								case 'cubic':
									setEquation(['(', 'x', ')', '**', '3']);
									break;
								case 'exponential':
									setEquation(['Math.E', '**', 'x']);
									break;
								case 'logarithmic':
									setEquation(['Math.log(', 'x', ')']);
									break;
								case 'sine wave':
									setEquation(['Math.sin(', 'x', ')']);
									break;
								case 'cosine wave':
									setEquation(['Math.cos(', 'x', ')']);
									break;
								default:
									break;
							}
							setGraphType('Equation');
						}}
					>
						<option>none</option>
						<option>line</option>
						<option>quadratic</option>
						<option>cubic</option>
						<option>exponential</option>
						<option>logarithmic</option>
						<option>sine wave</option>
						<option>cosine wave</option>
					</select>
				</div>
				<div className="controlContainer">
					<span>Unit size&nbsp;</span>
					<input
						type="range"
						min={25}
						max={minDim}
						value={unitSize}
						onChange={(event) => {
							setUnitSize(parseInt(event.currentTarget.value));
						}}
					/>
					<span>&nbsp;{`${unitSize}`}</span>
				</div>
				<div className="controlContainer">
					<span>Left&nbsp;</span>
					<input
						type="range"
						min={-maxDim}
						max={maxDim}
						value={horizontalShift}
						onChange={(event) => {
							setHorizontalShift(parseInt(event.currentTarget.value));
						}}
					/>
					<span>&nbsp;Right</span>
				</div>
				<div className="controlContainer">
					<span>Down&nbsp;</span>
					<input
						type="range"
						min={-minDim}
						max={minDim}
						value={verticalShift}
						onChange={(event) => {
							setVerticalShift(parseInt(event.currentTarget.value));
						}}
					/>
					<span>&nbsp;Up</span>
				</div>
				<div className="controlContainer">
					<span>Operation&nbsp;</span>
					<select
						onChange={(event) => {
							setGraphType(event.currentTarget.value);
						}}
						value={graphType}
					>
						<option value="Equation">Graph</option>
						<option>Differentiate</option>
						<option>Integrate</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export default Controls;
