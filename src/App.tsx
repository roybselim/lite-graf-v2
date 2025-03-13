import { useEffect, useState } from 'react';
import './App.css';
import { HORIZONTAL_SHIFT, UNIT_SIZE, VERTICAL_SHIFT } from './constants';
import Graph from './Graph';
import Controls from './Controls';

function App() {
	const [unitSize, setUnitSize] = useState(UNIT_SIZE);
	const [horizontalShift, setHorizontalShift] = useState(HORIZONTAL_SHIFT);
	const [verticalShift, setVerticalShift] = useState(VERTICAL_SHIFT);
	const [graphType, setGraphType] = useState('Equation');

	return (
		<div>
			<Graph
				unitSize={unitSize}
				horizontalShift={horizontalShift}
				verticalShift={verticalShift}
				graphType={graphType}
			/>
			<Controls
				unitSize={unitSize}
				setUnitSize={setUnitSize}
				verticalShift={verticalShift}
				setVerticalShift={setVerticalShift}
				horizontalShift={horizontalShift}
				setHorizontalShift={setHorizontalShift}
				setGraphType={setGraphType}
			/>
		</div>
	);
}

export default App;
