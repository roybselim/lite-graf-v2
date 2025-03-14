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
