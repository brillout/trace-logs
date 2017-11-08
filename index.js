module.exports = trackLogs;

function trackLogs(opts) {
    ['log', 'warn'].forEach(function(method) {
        const originalFn = console[method];
        console[method] = function() {
            const returnedValue = originalFn.apply(console, arguments);
            const trace = '^^^ Log comes from: '+get_log_origin(new Error().stack, opts);
            originalFn.call(console, trace);
            return returnedValue;
        };
    });
}

function get_log_origin(stackTrace, {onlyLastCallSite}={}) {
    let lines = stackTrace.split('\n');
    lines = lines.slice(2);
    if( onlyLastCallSite ) {
        const lastCallSite = lines[1].trim();
        return lastCallSite;
    }
    return '\n'+lines.join('\n');
}
