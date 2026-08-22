const levels = {
    info: "INFO",
    warn: "WARN",
    error: "ERROR",
    debug: "DEBUG",
};

const formatMessage = (level, message) => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
};

export const logger = {
    info: (message) => console.log(formatMessage(levels.info, message)),
    warn: (message) => console.warn(formatMessage(levels.warn, message)),
    error: (message, error) => {
        console.error(formatMessage(levels.error, message));
        if (error) console.error(error);
    },
    debug: (message) => {
        if (process.env.NODE_ENV !== "production") {
            console.log(formatMessage(levels.debug, message));
        }
    },
};
