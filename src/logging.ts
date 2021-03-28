import path from 'path';
import fs from 'fs';

export interface LoggingOptions 
{
    logToFile?: boolean;
    logFilesFolder: string;
    logLevel: 'errors'|'warnings'|'all';
}

var options: LoggingOptions = {
    logToFile: true,
    logFilesFolder: path.join(__dirname, './../logs'),
    logLevel: 'all'
};

export function initialize(logOptions: LoggingOptions)
{
    options = logOptions;
    if (!fs.existsSync(options.logFilesFolder))
        fs.mkdirSync(options.logFilesFolder);
}

export function clearLogs()
{
    return fs.rmdir(options.logFilesFolder, {recursive: true}, ()=>{});
}

function appendToLogFile(message: string): void
{
    let d = new Date();
    let date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    let time = `${(d.getHours() < 10) ? '0' : ''}${d.getHours()}:${(d.getMinutes() < 10) ? '0' : ''}${d.getMinutes()}`

    let log_file = path.join(options.logFilesFolder, date+'.log');
    let content = `${time} ${message}\n`;

    fs.appendFile(log_file, content, err => {
        if (err) console.error(`[!] A fatal error occured when updating log: ${err}`)
    });
}

export function log(message: string): void
{
    if (options.logLevel === 'all') {
        console.log("[*] "+message);
        appendToLogFile("[*] "+message);
    }
}

export function warn(message: string)
{
    if (['all','warnings'].includes(options.logLevel)) {
        console.warn("[!] "+message);
        appendToLogFile("[!] "+message);
    }
}

export function error(message: string)
{
    console.error("[!] "+message);
    appendToLogFile("[!] "+message);
}

export function modelError(modelname: string, funcname: string, error: any)
{
    const message = `[!] Model error in ${modelname}:${funcname}(): ${error}`;
    console.error(message);
    appendToLogFile(message);
}