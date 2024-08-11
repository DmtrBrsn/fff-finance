export function numToPrecision(num: number, precision = 2) {
	return Math.round((num + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision)
}

export const numToFixedStr = (num: number, precision?: number) => numToPrecision(num, precision).toLocaleString('ru-RU')
