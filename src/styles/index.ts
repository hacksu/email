
import sass from 'sass';
import path from 'path';
import React from 'react';


enum StylesheetType {
    react = "react",
    stylesheet = "stylesheet",
    raw = "raw",
}

let RawStyle = function(content: string) {
    return React.createElement('style', null, content)
}

export function Stylesheet(source: string, format: StylesheetType = StylesheetType.react): any {
    if (source.indexOf('<style>') == 0) {
        if (format == StylesheetType.react) {
            return RawStyle.bind(null, source.split(/<\/?style>/g).join(''));
        }
    } else if (source.split(/\.scss/g).filter(o => o.length > 0).length > 1) {
        let sources: any[] = source.split(/\.scss/g)
        .filter(o => o.length > 0)
        .map((source_: string) => {
            return ImportSass(source_ + '.scss', format)
        });
        let result = "";
        for (let x of sources) {
            result += x;
        }
        return Stylesheet(result, format);
    }
    return ImportSass(source, format);
}

export function Stylesheets(sources: string[], format: StylesheetType = StylesheetType.react): any {
    return Stylesheet(sources.join(''), format);
}

const isJSXorTSX = /\.(j|t)sx(?!.)/;
export function ImportSass(str: string, format: StylesheetType): string|any {
    const stack = StackTrace(); // get stack trace of this function call
    const filteredStack = stack.filter((o: any) => o && o.fileName && isJSXorTSX.test(o.fileName)); // only return jsx and tsx files, as those will interact with sass
    const callerName = filteredStack[0].fileName; // get the first instance, aka the one who called 'importSass'
    let pth = path.resolve(path.dirname(callerName), str) // determine sass file location with the caller in context, thus allowing relative imports
    let result = sass.renderSync({ file: pth })
    // @ts-ignore
    result.stylesheet = '<style>' + result.css.toString('utf8') + '</style>';
    if (format == 'stylesheet') {
        // @ts-ignore
        return result.stylesheet
    } else if (format == 'react') {
        let cb = RawStyle.bind(null, result.css.toString('utf8'));
        // @ts-ignore
        cb.stylesheet = result.stylesheet;
        // @ts-ignore
        cb.toString = function() { return this.stylesheet; };
        return cb;
    } else {
        return result;
    }
}

export function ImportSassAsync(str: string, format='react'): Promise<string|any> {
    const stack = StackTrace(); // get stack trace of this function call
    const filteredStack = stack.filter((o: any) => o && o.fileName && isJSXorTSX.test(o.fileName)); // only return jsx and tsx files, as those will interact with sass
    const callerName = filteredStack[0].fileName; // get the first instance, aka the one who called 'importSass'
    let pth = path.resolve(path.dirname(callerName), str) // determine sass file location with the caller in context, thus allowing relative imports
    return new Promise(function(resolve, reject) {
        sass.render({
            file: pth,
        }, function(err, result) {
            if (err) {
                return reject(err)
            }
            // @ts-ignore
            result.stylesheet = '<style>' + result.css.toString('utf8') + '</style>';
            if (format == 'stylesheet') {
                // @ts-ignore
                resolve(result.stylesheet)
            } else if (format == 'react') {
                resolve(function() {
                    return React.createElement('style', null, result.css.toString('utf8'))
                })
            } else {
                resolve(result)
            }
        })
    })
}


function StackTrace() {
    const _prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) {
        return stack
    }
    let stack = new Error().stack;
    Error.prepareStackTrace = _prepareStackTrace;
    // @ts-ignore
    stack.shift();
    // @ts-ignore
    return stack.map(o => {
        // Methods: https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_globals_d_.nodejs.callsite.html
        const fileName = o.getFileName();
        
        return {
            fileName
        }
    })
}