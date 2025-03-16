export const sanitize = (val: string) => {
	return val
		.replace(/Math.E/g, 'e')
		.replace(/Math./g, '')
		.replace(/\*\*/g, '^')
		.replace(/PI/g, 'π')
		.replace(/sqrt/g, '√');
};

export const getEquation = (equation: string[]) => {
	return sanitize(equation.join(''));
};

export function randomRGB() {
	var o = Math.round,
		r = Math.random,
		s = 255;
	return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
}

export const parseEquation = (equation: string) =>
	equation
		.replace(
			/(?<=(sin|cos|tan|log))(\d+.{0,1}\d{0,22}|Math.E|Math.PI)/g,
			(l: any) => `(${l})`
		)
		.replace(/(?<=(\d|x))x/g, '*x')
		.replace(/(?<=(\d|Math.E|x))Math/g, '*Math');
