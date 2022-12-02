const logger = function(filename){
    
    const fname = require('path').basename(filename);
    
    const { format, createLogger, transports} = require("winston");

    const { combine, timestamp, label, printf } = format;

    const CATEGORY = "nuit-info-api";

    //Using the printf format.
    const customFormat = printf(({ level, message, label, timestamp, stack }) => {
        return `${timestamp} [filename][${fname}] [${label}] ${level}: ${message} ${(stack)?stack:''}`;   
    });

    const colors = {
        error: 'red',
        warn: 'yellow',
        info: 'cyan',
        debug: 'green'
    };
    const logger = createLogger({
    level: "debug",
    transports: [
        new transports.Console({format:combine(label({ label: CATEGORY }),format.colorize({colors:colors,message:true,level:true}),timestamp({format: "MMM-DD-YYYY HH:mm:ss"}), customFormat)}),
            
    ],
    });

    return logger;
};



module.exports = logger;