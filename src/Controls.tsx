import { useState } from 'react';
import useWindowDimensions from './useWindowDimensions';
import useStore from './store';

interface IControlProps {}

const Controls = (_props: IControlProps) => {
	const { width, height } = useWindowDimensions();
	const minDim = Math.min(width, height);
	const [calculator, setCalculator] = useState(0);
	const {
		addCalculator,
		removeCalculator,
		editCalculator,
		calculators,
		unitSize,
		setUnitSize,
	} = useStore((state) => state);

	return (
		<div className="Controls">
			<div className="controlsContainer">
				<div className="controlContainer">
					<span>&nbsp;{`${calculators.length}`}</span>
					<span>&nbsp;calculator(s)&nbsp;</span>
					<button
						style={{ marginRight: 10 }}
						onClick={() => {
							addCalculator();
						}}
					>
						+
					</button>
					<button
						style={{ padding: '1px 8px' }}
						onClick={() => {
							if (calculators.length)
								removeCalculator(calculators[calculators.length - 1].id);
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
									editCalculator(calculator, { equation: [] });
									break;
								case 'graph a linear function':
									editCalculator(calculator, { equation: ['x'] });
									break;
								case 'graph a quadratic function':
									editCalculator(calculator, { equation: ['x', '**', '2'] });
									break;
								case 'graph a cubic function':
									editCalculator(calculator, { equation: ['x', '**', '3'] });
									break;
								case 'graph an exponential function':
									editCalculator(calculator, {
										equation: ['Math.E', '**', 'x'],
									});
									break;
								case 'graph a logarithmic function':
									editCalculator(calculator, { equation: ['Math.log', 'x'] });
									break;
								case 'graph a sine wave function':
									editCalculator(calculator, { equation: ['Math.sin', 'x'] });
									break;
								case 'graph a cosine wave function':
									editCalculator(calculator, { equation: ['Math.cos', 'x'] });
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
						{calculators.map((calc, ndx: number) => (
							<option
								key={`${ndx}-${calc.id}`}
								value={calc.id}
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
									editCalculator(calculator, { graphType: 'Equation' });
									break;
								case 'Differentiate':
									editCalculator(calculator, { graphType: 'Differentiate' });
									break;
								case 'Integrate':
									editCalculator(calculator, { graphType: 'Integrate' });
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
