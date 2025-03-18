import { useEffect, useRef, useState } from 'react';
import './App.css';
import { getEquation, parseEquation, sanitize } from './helpers';
import useStore, { ICalculator } from './store';

interface ICalculatorProps {
	calculator: ICalculator;
}

const Calculator = (_props: ICalculatorProps) => {
	const [pressed, setPressed] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [ans, setAns] = useState('');
	const ref = useRef<any>(null);
	const [caret, setCaret] = useState(0);
	const [prevEq, setPrevEq] = useState('');
	const [inverse, setInverse] = useState(false);
	const [answerMode, setAnswerMode] = useState(false);
	const { calculator } = _props;

	const { removeCalculator, editCalculator, tutorial, setTutorial } = useStore(
		(state) => state
	);
	const { equation = [], color, graphType, useDegrees, id } = calculator;

	// Monitor changes to position state and update DOM
	useEffect(() => {
		if (ref.current) {
			ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
		}
	}, [position]);

	// Update the current position if mouse is down
	const onMouseMove = (event: any) => {
		if (pressed) {
			setPosition({
				x: position.x + event.movementX,
				y: position.y + event.movementY,
			});
		}
	};

	const concat = (val: string): void => {
		if (equation.length < 19) {
			if (tutorial === 1) {
				setTutorial(tutorial + 1);
			}
			setCaret(caret + 1);
			setAnswerMode(false);
			setPrevEq('');
			if (caret < equation.length) {
				const newEq = [...equation];
				newEq.splice(caret, 0, val);
				editCalculator(id, { equation: newEq });
			} else {
				editCalculator(id, { equation: [...equation, val] });
			}
		}
	};

	const equals = () => {
		setAnswerMode(true);
		setPrevEq(getEquation(equation));
		try {
			const ans = eval(parseEquation(equation.join('')))
				.toString()
				.split('');
			editCalculator(id, { equation: ans });
			setCaret(0);
			setAns(ans.join(''));
		} catch (_e) {
			editCalculator(id, { equation: 'Syntax Error'.split('') });
		}
	};

	const del = () => {
		const newEq = [...equation];
		newEq.splice(caret - 1, 1);
		setCaret(caret - 1);
		editCalculator(id, { equation: newEq });
	};

	return (
		<div
			className="calculator"
			ref={ref}
			onMouseMove={onMouseMove}
			onMouseDown={() => setPressed(true)}
			onMouseUp={() => setPressed(false)}
			style={{ bottom: 0, right: 0 + id * 270 }}
		>
			<div className="keypad">
				<div
					className="calculatorContainer"
					style={{
						backgroundColor: color,
					}}
				>
					<div
						onClick={() => {
							removeCalculator(id);
						}}
						className="removeCalc"
					>
						<span style={{}}>X</span>
					</div>
					<span style={{ color: '#dddddd' }}>
						<i>seliminds</i>
					</span>
					<div className="displayContainer">
						{tutorial === 1 && id === 0 && (
							<div className="tutorial tutorialTwo">
								<div style={{ position: 'relative' }}>
									Enter your equation here, use the black `
									<i>
										<span className="smallButton">&nbsp;x&nbsp;</span>
									</i>
									` button for variables. Try `2x + 5`
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
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span style={{ fontSize: '10px' }}>&nbsp;{prevEq}</span>
							<span style={{ fontSize: '8px' }}>
								{useDegrees ? 'DEG' : 'RAD'}
							</span>
						</div>
						<div
							style={{
								display: 'flex',
								width: '100%',
								overflow: 'hidden',
								justifyContent: answerMode ? 'flex-end' : 'flex-start',
								alignItems: 'flex-end',
								height: '30px',
							}}
						>
							{equation.map((eq, ndx) => (
								<span
									key={`${eq}-${ndx}`}
									className={caret === ndx && !answerMode ? 'blink' : ''}
									style={{
										fontSize: `${
											sanitize(equation.join('')).length < 13 ? 25 : 15
										}px`,
										fontStyle: /Math.E|x|Math.PI/.test(eq)
											? 'italic'
											: 'normal',
									}}
								>
									{sanitize(eq)}
								</span>
							))}
							{!answerMode && caret === equation.length && (
								<span className="blink">_</span>
							)}
						</div>
					</div>
				</div>
				<div className="row">
					{[
						{ Equation: 'ƒ(x)' },
						{ Differentiate: 'ƒ`(x)' },
						{ Integrate: '∫ƒ(x)dx' },
					].map((val: any) => {
						const type = Object.keys(val)[0];
						return (
							<button
								key={type}
								className="operation"
								style={{
									backgroundColor: graphType === type ? 'black' : 'white',
									color: graphType === type ? 'white' : 'black',
								}}
								onClick={() => {
									if (tutorial === 2) {
										setTutorial(4);
									}
									editCalculator(id, { graphType: type });
								}}
							>
								{val[type]}
							</button>
						);
					})}
					<button
						style={{
							backgroundColor: inverse ? 'black' : 'white',
							color: inverse ? 'white' : 'black',
						}}
						className="operation"
						onClick={() => setInverse(!inverse)}
					>
						1/x
					</button>
					<button
						style={{
							fontSize: '8px',
						}}
						className="operation"
						onClick={() => {
							editCalculator(id, { useDegrees: !useDegrees });
						}}
					>
						<span style={{ color: useDegrees ? 'green' : 'red' }}>DEG</span>|
						<span style={{ color: !useDegrees ? 'green' : 'red' }}>RAD</span>
					</button>
				</div>
				<div className="row">
					<button
						className="smallButton"
						onClick={() => {
							concat('(');
						}}
					>{`(`}</button>
					<button
						className="smallButton"
						onClick={() => concat(inverse ? '1/(Math.PI)' : 'Math.PI')}
					>
						{inverse && <div className="inverseSign">1</div>}
						<div style={{ fontSize: inverse ? 10 : 15, fontStyle: 'italic' }}>
							π
						</div>
					</button>
					<button
						className="smallButton"
						onClick={() => concat(inverse ? '1/(Math.E)' : 'Math.E')}
					>
						{inverse && <div className="inverseSign">1</div>}
						<div style={{ fontSize: inverse ? 10 : 15, fontStyle: 'italic' }}>
							e
						</div>
					</button>
					<button
						className="smallButton"
						onClick={() => concat(inverse ? '1/(x)' : 'x')}
					>
						{inverse && <div className="inverseSign">1</div>}
						<div style={{ fontSize: inverse ? 10 : 15, fontStyle: 'italic' }}>
							x
						</div>
					</button>
					<button className="smallButton" onClick={() => concat('Math.sqrt(')}>
						√
					</button>
					<button
						className="smallButton"
						onClick={() => {
							concat(')');
						}}
					>{`)`}</button>
				</div>
				<div className="row">
					{['sin', 'cos', 'tan', 'log'].map((i) => (
						<button
							className="smallButton inverse"
							key={`${i}`}
							onClick={() => {
								concat(inverse ? `1/(Math.${i}` : `Math.${i}`);
							}}
						>
							{inverse && <div className="inverseSign">1</div>}
							<div style={{ fontSize: inverse ? 10 : 15 }}>{i}</div>
						</button>
					))}
					<button
						className="smallButton"
						onClick={() => {
							setCaret(caret === 0 ? 0 : caret - 1);
						}}
					>{`<`}</button>
					<button
						className="smallButton"
						onClick={() => {
							setCaret(caret < equation.length ? caret + 1 : equation.length);
						}}
					>{`>`}</button>
				</div>
				<div className="row">
					{['7', '8', '9'].map((i) => (
						<button
							className="button"
							key={`button${i}`}
							onClick={() => {
								concat(i);
							}}
						>
							{i}
						</button>
					))}
					<button className="button bigButton" onClick={del}>
						DEL
					</button>
					<button
						className="button bigButton"
						onClick={() => {
							editCalculator(id, { equation: [''] });
							setCaret(0);
							setPrevEq('');
						}}
					>
						AC
					</button>
				</div>
				<div className="row">
					{['4', '5', '6'].map((i) => (
						<button
							className="button"
							key={`button${i}`}
							onClick={() => {
								concat(i);
							}}
						>
							{i}
						</button>
					))}
					<button className="button" onClick={() => concat('*')}>
						x
					</button>
					<button className="button" onClick={() => concat('/')}>
						÷
					</button>
				</div>
				<div className="row">
					{['1', '2', '3', '+', '-'].map((i) => (
						<button
							className="button"
							key={`button${i}`}
							onClick={() => {
								concat(i);
							}}
						>
							{i}
						</button>
					))}
				</div>
				<div className="row">
					{['0', '.'].map((i) => (
						<button
							className="button"
							key={`button${i}`}
							onClick={() => {
								concat(i);
							}}
						>
							{i}
						</button>
					))}
					<button className="button bigButton" onClick={() => concat('**')}>
						EXP
					</button>
					<button
						className="button bigButton"
						onClick={() => {
							del();
							concat(ans.toString());
						}}
						value="Ans"
					>
						Ans
					</button>
					<button className="button" onClick={equals}>
						=
					</button>
				</div>
			</div>
		</div>
	);
};

export default Calculator;
