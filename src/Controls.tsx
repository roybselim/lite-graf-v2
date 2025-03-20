import { useRef, useState } from 'react';
import useWindowDimensions from './useWindowDimensions';
import useStore from './store';

const Controls = () => {
	// const queryParams = new URLSearchParams(window.location.search);
	// const equationRaw = queryParams.get('equation');
	const { width, height } = useWindowDimensions();
	const basicControls = width <= 635;
	const fullControls = width >= 1100;
	const minDim = Math.min(width, height);
	const [calculator, setCalculator] = useState(0);
	const [showMoreControls, setShowMoreControls] = useState(false);
	const {
		addCalculator,
		removeCalculator,
		editCalculator,
		calculators,
		unitSize,
		setUnitSize,
		tutorial,
		setTutorial,
		setScale,
		setVerticalShift,
		setHorizontalShift,
	} = useStore((state) => state);
	const unitSizeRef = useRef<HTMLInputElement | null>(null);
	const scaleRef = useRef<HTMLInputElement | null>(null);

	return (
		<div className="Controls">
			<div className="controlsContainer">
				{!basicControls && (
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
				)}
				{fullControls && (
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
								if (tutorial === 0) {
									setTutorial(tutorial + 1);
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
						{tutorial === 0 && (
							<div className="tutorial tutorialOne">
								<div style={{ position: 'relative' }}>
									Select an example function to start.
								</div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<button onClick={() => setTutorial(4)}>Dismiss</button>
									<button onClick={() => setTutorial(tutorial + 1)}>
										Next
									</button>
								</div>
							</div>
						)}
					</div>
				)}
				<div className="controlContainer">
					<span>{basicControls ? 'Size' : 'Unit size'}:&nbsp;</span>
					{!basicControls && (
						<input
							type="range"
							min={25}
							max={minDim}
							value={unitSize}
							onChange={(event) => {
								if (unitSizeRef.current) {
									unitSizeRef.current.value = '';
								}
								setUnitSize(parseInt(event.currentTarget.value));
							}}
						/>
					)}
					<input
						ref={unitSizeRef}
						placeholder={unitSize.toString()}
						type="text"
						style={{ width: 30 }}
						onChange={(event) => {
							const { value } = event.currentTarget;
							const parsed = parseInt(value);
							if (value === '' || parsed < 20) {
								setUnitSize(50);
							} else if (!isNaN(parsed)) setUnitSize(parsed);
						}}
					/>
				</div>
				<div className="controlContainer">
					<span>Scale:&nbsp;</span>
					<input
						ref={scaleRef}
						placeholder="1"
						type="text"
						style={{ width: 30 }}
						onChange={(event) => {
							const { value } = event.currentTarget;
							if (value === '') {
								setScale(1);
							}
							const parsed = parseFloat(value);
							if (!isNaN(parsed)) setScale(parsed);
						}}
					/>
				</div>
				{fullControls && (
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
								if (tutorial === 2) {
									setTutorial(4);
								}
							}}
						>
							<option value="Equation">Graph</option>
							<option>Differentiate</option>
							<option>Integrate</option>
						</select>
						{tutorial === 2 && (
							<div className="tutorial tutorialThree">
								<div style={{ position: 'relative' }}>
									Use the operation dropdown or the calculator's calculus
									buttons to perform calculus operations.
								</div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<button onClick={() => setTutorial(4)}>Finish</button>
								</div>
							</div>
						)}
					</div>
				)}
				<div className="controlContainer ellipsis">
					<span
						className="ellipsis"
						onClick={() => setShowMoreControls(!showMoreControls)}
					>
						...
					</span>
					<div
						className="moreControls"
						style={{ display: showMoreControls ? 'flex' : 'none' }}
					>
						<span
							onClick={() => {
								setVerticalShift(0);
								setHorizontalShift(0);
							}}
						>
							center the graph
						</span>
						<span
							onClick={() => {
								setScale(1);
								setUnitSize(50);
								if (unitSizeRef.current) {
									unitSizeRef.current.value = '';
								}
								if (scaleRef.current) {
									scaleRef.current.value = '';
								}
							}}
						>
							reset size and scale
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Controls;
