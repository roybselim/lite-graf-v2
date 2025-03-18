import { create } from 'zustand';
import { parseEquation, randomRGB } from './helpers';
import { HORIZONTAL_SHIFT, UNIT_SIZE, VERTICAL_SHIFT } from './constants';

export interface ICalculator {
	id: number;
	equation: string[];
	graphType: string;
	color: string;
	parsedEquation: string;
	useDegrees: boolean;
}

export interface IStore {
	calculators: ICalculator[];
	addCalculator: () => void;
	removeCalculator: (id: number) => void;
	editCalculator: (id: number, newObj: Partial<ICalculator>) => void;
	unitSize: number;
	horizontalShift: number;
	verticalShift: number;
	setUnitSize: (val: number) => void;
	setHorizontalShift: (val: number) => void;
	setVerticalShift: (val: number) => void;
	tutorial: number;
	setTutorial: (val: number) => void;
}

const useStore = create<IStore>((set) => ({
	calculators: [
		{
			id: 0,
			equation: [],
			graphType: 'Equation',
			color: '#212121',
			parsedEquation: '',
			useDegrees: false,
		},
	],
	addCalculator: () =>
		set((state: IStore) => ({
			calculators: [
				...state.calculators,
				{
					id: !state.calculators.length
						? 0
						: (state.calculators[state.calculators.length - 1]?.id || 0) + 1,
					equation: [],
					graphType: 'Equation',
					color: randomRGB(),
					parsedEquation: '',
					useDegrees: false,
				},
			],
		})),
	removeCalculator: (id: number) =>
		set((state: IStore) => ({
			calculators: state.calculators.filter((calc) => calc.id !== id),
		})),
	editCalculator: (id: number, newEq: any) => {
		let withParsed = newEq;
		if (newEq.equation) {
			withParsed = {
				...newEq,
				parsedEquation: parseEquation(newEq.equation.join('')),
			};
		}
		return set((state: any) => ({
			calculators: state.calculators.map((calc: any) =>
				calc.id !== id ? calc : { ...calc, ...withParsed }
			),
		}));
	},
	unitSize: UNIT_SIZE,
	setUnitSize: (val: number) => set(() => ({ unitSize: val })),
	horizontalShift: HORIZONTAL_SHIFT,
	setHorizontalShift: (val: number) => set(() => ({ horizontalShift: val })),
	verticalShift: VERTICAL_SHIFT,
	setVerticalShift: (val: number) => set(() => ({ verticalShift: val })),
	tutorial: 0,
	setTutorial: (val: number) => set(() => ({ tutorial: val })),
}));

export default useStore;
