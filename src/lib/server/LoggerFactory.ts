import winston from 'winston';
import path from 'path';
import { browser } from '$app/environment';
import { VERCEL_ENV } from '$env/static/private';

// Define custom log levels (optional)
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

// Define colors for each level (optional)
const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'blue',
};

// Add colors to winston
winston.addColors(colors);

// Interface for logger context
export interface LoggerContext {
	component: string;
	[key: string]: any; // Additional context properties
}

/**
 * Creates a Winston logger configured for SvelteKit
 * @param context The context information to be included with all logs
 * @returns A configured Winston logger instance
 */
export const createLogger = (context: LoggerContext) => {
	// Don't create a logger in the browser
	// Return a mock logger that does nothing when used in the browser
	if (browser) {
		return {
			error: () => {},
			warn: () => {},
			info: () => {},
			http: () => {},
			debug: () => {},
		} as winston.Logger;
	}

	// Determine log level from environment
	const level = VERCEL_ENV === 'production' ? 'info' : 'debug';

	// Define transports array
	const transports: winston.transport[] = [
		// Console transport for all environments
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize({ all: true }),
				winston.format.printf(
					(info) => `${info.timestamp} ${info.level}: [${info.context.component}] ${info.message}`
				)
			),
		}),
	];

	// Add file transports only in production on Vercel
	if (VERCEL_ENV === 'production') {
		// Use /tmp directory for logs on Vercel
		const logDir = '/tmp/logs';

		// Add file transports
		transports.push(
			new winston.transports.File({
				filename: path.join(logDir, 'error.log'),
				level: 'error'
			}),
			new winston.transports.File({
				filename: path.join(logDir, 'combined.log')
			})
		);
	}

	// Create and return the Winston logger
	return winston.createLogger({
		levels,
		level,
		format: winston.format.combine(
			winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
			winston.format.errors({ stack: true }),
			winston.format.splat(),
			winston.format.json()
		),
		defaultMeta: {
			service: 'sveltekit-app',
			context
		},
		transports,
	});
};

// Example usage:
// const logger = createLogger({ component: 'AuthService' });
// logger.info('User logged in', { userId: '123' });