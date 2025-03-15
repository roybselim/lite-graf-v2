import { useState } from 'react';
import useWindowDimensions from './useWindowDimensions';

interface IControlProps {
	colors: string[];
	unitSize: number;
	setUnitSize: (val: number) => void;
	calculators: number;
	setCalculators: (val: number) => void;
	setSpecificEquation: (index: number, eqtn: string[]) => void;
	setSpecificGraphType: (index: number, type: string) => void;
}

const Controls = (_props: IControlProps) => {
	const {
		colors,
		unitSize,
		setUnitSize,
		calculators,
		setCalculators,
		setSpecificEquation,
		setSpecificGraphType,
	} = _props;
	const { width, height } = useWindowDimensions();
	const minDim = Math.min(width, height);
	const [calculator, setCalculator] = useState(0);

	return (
		<div className="Controls">
			<div className="controlsContainer">
				<div className="controlContainer">
					<span>&nbsp;{`${calculators}`}</span>
					<span>&nbsp;calculator(s)&nbsp;</span>
					<button
						style={{ marginRight: 10 }}
						onClick={() => {
							setCalculators(calculators + 1);
						}}
					>
						+
					</button>
					<button
						style={{ padding: '1px 8px' }}
						onClick={() => {
							if (calculators > 0) setCalculators(calculators - 1);
						}}
					>
						-
					</button>
				</div>
				<div className="controlContainer">
					<span>Examples:&nbsp;</span>
					<select
						onChange={(event) => {
							switch (event.currentTarget.value) {
								case 'no graph':
									setSpecificEquation(calculator, []);
									break;
								case 'graph a linear function':
									setSpecificEquation(calculator, ['x']);
									break;
								case 'graph a quadratic function':
									setSpecificEquation(calculator, ['(', 'x', ')', '**', '2']);
									break;
								case 'graph a cubic function':
									setSpecificEquation(calculator, ['(', 'x', ')', '**', '3']);
									break;
								case 'graph an exponential function':
									setSpecificEquation(calculator, ['Math.E', '**', 'x']);
									break;
								case 'graph a logarithmic function':
									setSpecificEquation(calculator, ['Math.log(', 'x', ')']);
									break;
								case 'graph a sine wave function':
									setSpecificEquation(calculator, ['Math.sin(', 'x', ')']);
									break;
								case 'graph a cosine wave function':
									setSpecificEquation(calculator, ['Math.cos(', 'x', ')']);
									break;
								default:
									break;
							}
						}}
					>
						<option>no graph</option>
						<option>graph a linear function</option>
						<option>graph a quadratic function</option>
						<option>graph a cubic function</option>
						<option>graph an exponential function</option>
						<option>graph a logarithmic function</option>
						<option>graph a sine wave function</option>
						<option>graph a cosine wave function</option>
					</select>
					<select
						style={{ marginLeft: 5 }}
						onChange={(event) => {
							setCalculator(parseInt(event.currentTarget.value));
						}}
					>
						{new Array(calculators).fill('').map((_item, ndx) => (
							<option
								value={ndx}
								style={{ backgroundColor: 'red' }}
							>{`on calculator ${ndx + 1}`}</option>
						))}
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
					<span>Operation:&nbsp;</span>
					<select
						onChange={(event) => {
							switch (event.currentTarget.value) {
								case 'Equation':
									setSpecificGraphType(calculator, 'Equation');
									break;
								case 'Differentiate':
									setSpecificGraphType(calculator, 'Differentiate');
									break;
								case 'Integrate':
									setSpecificGraphType(calculator, 'Integrate');
									break;
								default:
									break;
							}
						}}
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
