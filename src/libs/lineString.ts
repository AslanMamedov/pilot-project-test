export const lineString = (str: string) =>
	str
		.replace(/LINESTRING|\(|\)/g, '')
		.split(',')
		.flatMap((coord) => coord.split(' ').map(Number));
