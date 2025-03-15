import { useState } from 'react';
import './App.css';
import { HORIZONTAL_SHIFT, UNIT_SIZE, VERTICAL_SHIFT } from './constants';
import Graph from './Graph';
import Controls from './Controls';
import Calculator from './Calculator';

function App() {
	const [unitSize, setUnitSize] = useState(UNIT_SIZE);
	const [horizontalShift, setHorizontalShift] = useState(HORIZONTAL_SHIFT);
	const [verticalShift, setVerticalShift] = useState(VERTICAL_SHIFT);
	const [graphType, setGraphType] = useState('Equation');
	const [equation, setEquation] = useState<string[]>([]);
	const [ans, setAns] = useState('');

	return (
		<div>
			<Graph
				unitSize={unitSize}
				horizontalShift={horizontalShift}
				verticalShift={verticalShift}
				graphType={graphType}
				equation={equation.join('')}
				setHorizontalShift={setHorizontalShift}
				setVerticalShift={setVerticalShift}
			/>
			<Controls
				unitSize={unitSize}
				setUnitSize={setUnitSize}
				verticalShift={verticalShift}
				setVerticalShift={setVerticalShift}
				horizontalShift={horizontalShift}
				setHorizontalShift={setHorizontalShift}
				setGraphType={setGraphType}
				setEquation={setEquation}
				graphType={graphType}
			/>
			<Calculator
				equation={equation}
				setEquation={setEquation}
				ans={ans}
				setAns={setAns}
			/>
		</div>
	);
}

export default App;
