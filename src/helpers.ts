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
