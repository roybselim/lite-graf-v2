import { useEffect, useState } from 'react';
import './App.css';
import {
	CALCULATORS,
	HORIZONTAL_SHIFT,
	UNIT_SIZE,
	VERTICAL_SHIFT,
} from './constants';
import Graph from './Graph';
import Controls from './Controls';
import Calculator from './Calculator';
import { randomRGB } from './helpers';

function App() {
	const [unitSize, setUnitSize] = useState(UNIT_SIZE);
	const [horizontalShift, setHorizontalShift] = useState(HORIZONTAL_SHIFT);
	const [verticalShift, setVerticalShift] = useState(VERTICAL_SHIFT);
	const [calculators, setCalculators] = useState(CALCULATORS);
	const [graphTypes, setGraphTypes] = useState<string[]>(
		new Array(CALCULATORS).fill('Equation')
	);
	const [equation, setEquation] = useState<string[][]>(
		new Array(CALCULATORS).fill([])
	);
	const [colors, setColors] = useState<string[]>([
		...new Array(CALCULATORS - 1).fill('').map((item) => randomRGB()),
		'#121212',
	]);

	useEffect(() => {
		if (equation.length > calculators) {
			setGraphTypes(graphTypes.slice(0, -1));
			setEquation(equation.slice(0, -1));
			setColors(colors.slice(0, -1));
		} else if (equation.length < calculators) {
			setGraphTypes([...graphTypes, 'Equation']);
			setEquation([...equation, []]);
			setColors([...colors, randomRGB()]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [calculators]);

	const setSpecificEquation = (ndx: number, eqtn: string[]) => {
		setEquation(
			equation.map((eq, indx) => {
				if (indx !== ndx) return eq;
				else return eqtn;
			})
		);
	};

	const setSpecificGraphType = (ndx: number, type: string) => {
		setGraphTypes(
			graphTypes.map((typ, indx) => {
				if (indx !== ndx) return typ;
				else return type;
			})
		);
	};

	return (
		<div>
			<Graph
				unitSize={unitSize}
				horizontalShift={horizontalShift}
				verticalShift={verticalShift}
				graphTypes={graphTypes}
				equations={equation.map((eq) => eq.join(''))}
				setHorizontalShift={setHorizontalShift}
				setVerticalShift={setVerticalShift}
				colors={colors}
			/>
			<Controls
				colors={colors}
				unitSize={unitSize}
				setUnitSize={setUnitSize}
				calculators={calculators}
				setCalculators={setCalculators}
				setSpecificEquation={setSpecificEquation}
				setSpecificGraphType={setSpecificGraphType}
			/>
			{equation.map((eq, eqnNdx) => (
				<Calculator
					equation={eq}
					graphTypes={graphTypes}
					equationIndex={eqnNdx}
					color={colors[eqnNdx]}
					setSpecificEquation={setSpecificEquation}
					setSpecificGraphType={setSpecificGraphType}
				/>
			))}
		</div>
	);
}

export default App;
