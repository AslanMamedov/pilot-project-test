import { IData } from '../types';

export const xlsxData = <T extends IData>(data: T[]): Map<number, number> => {
	return data.reduce((acc: Map<number, number>, item: T, _, arr: T[]): Map<number, number> => {
		acc.set(item.status, Number(((arr.filter((i) => i.status === item.status).length / arr.length) * 100).toFixed(0)));
		return acc;
	}, new Map());
};
