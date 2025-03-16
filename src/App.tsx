import './App.css';
import Graph from './Graph';
import Controls from './Controls';
import Calculator from './Calculator';
import useStore from './store';

function App() {
	const { calculators } = useStore((state) => state);

	return (
		<div>
			<Graph />
			<Controls />
			{calculators.map((calculator, ndx) => (
				<Calculator calculator={calculator} key={`calculator${ndx}`} />
			))}
		</div>
	);
}

export default App;
