import winston from 'winston';
import { VERCEL_ENV } from '$lib/config';

const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const logger = winston.createLogger({
	level: VERCEL_ENV === 'development' ? 'debug' : 'info',
	format: winston.format.combine(
		enumerateErrorFormat(),
		VERCEL_ENV === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
		winston.format.splat(),
		winston.format.printf(({ level, message }) => `${level}: ${message}`)
	),
	transports: [
		new winston.transports.Console({
			stderrLevels: ['error'],
		}),
	],
});

export default logger;