import winston from 'winston';
import path from 'path';

// Define the log file paths
const logDir = path.join(process.cwd(), 'logs'); // Ensure that the logs directory exists
const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

// Create a custom format function for pretty-printing
const prettyJson = winston.format.printf((info) => {
    return JSON.stringify(info, null, 2); // 2 spaces indentation
});

// Create a logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        prettyJson // Custom pretty JSON formatting
    ),
    transports: [
        new winston.transports.File({ filename: errorLogPath, level: 'error' }),
        new winston.transports.File({ filename: combinedLogPath })
    ]
});

// Log to the console as well in development mode
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(), // Makes console logs colorful
            prettyJson // Pretty-print JSON for the console as well
        )
    }));
}

export default logger;
