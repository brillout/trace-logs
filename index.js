module.exports = traceLogs;

function traceLogs({onlyLastCallSite}={}) {
    /*
    ["log", "debug", "warn", "info"]
    .forEach(function(fnName) {
        add_tracer(console, fnName, false);
    });
    */
    add_tracer(process.stdout, 'write', true);
    add_tracer(process.stderr, 'write', true);

    return;

    function add_tracer(obj, fnName, preprendNewLine) {
      const fn_original = obj[fnName];
      obj[fnName] = function() {
        const argumentsCropped = Array.from(arguments).map(arg => {
          if( arg && arg.constructor===String ) {
            return arg.slice(0, 1000);
          }
        });
        const returnedValue = fn_original.apply(obj, argumentsCropped);
        const trace = (
          (preprendNewLine?'\n':'')+
          '^^^ Log comes from: '+
          get_log_origin(new Error().stack)
        );
        fn_original.call(obj, trace);
        return returnedValue;
      };
    }

    function get_log_origin(stackTrace) {
        let lines = stackTrace.split('\n');
        lines = lines.slice(2);
        if( onlyLastCallSite ) {
            const lastCallSite = lines[1].trim();
            return lastCallSite;
        }
        return '\n'+lines.join('\n');
  }
}
