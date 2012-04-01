(function () {
	
	var spawn = require('child_process').spawn,
		path  = require('path');

	var extend = function (obj) {
		var args = Array.prototype.slice.call(arguments);
		if(args.length == 0) return {};
		args.slice(1).forEach(function (source) {
			for(var prop in source)
				obj[prop] = source[prop];
		});
		return obj;
	};

	exports.exec = function (cmd, opts, callback) {
		var command = spawn(cmd, opts || [], { customFds: [0, 1, 2] });
        command.on('exit', function (code) { if(callback) callback(code); });
	};

	exports.msbuild = (function () {
		
		var defaults = {
			processor: 'x86',
			version: 'net2.0'
		};

		var task = function (opts, callback) {
			var opt = extend({}, defaults, opts),
				args = [];

			if(!opt.file) fail('file required');

			if(!opt._exe) {
				if(!opt.processor) fail('processor required');
				if(!opt.version) fail('version required');
				opt._exe = exports.getDotNetVersionPath(opt.version, opt.processor) + 'MSBuild.exe';
			}

			args.push(opt.file);

			if(opt.targets)
				opts.targets.forEach(function (target) { args.push('/t:' + target);	});
			if(opt.properties) {
				for(var key in opt.properties)
					args.push('/p:' + key + '=' + opt.properties[key])
			}

			args.push.apply(args, opt._parameters || []);

			exports.exec(opt._exe, args, function (code) {
				if(code !== 0) fail('msbuild failed')
				callback ? callback(code) : complete();
			});
		};

		task.setDefaults = function (opts) {
			extend(defaults, opts);
			return defaults;
		};

		return task;

	})();

	exports.getWinDir = function () {
        var winDir = process.env.WINDIR;
        return path.normalize((winDir.substr(-1) === '/' || winDir.substr(-1) === '\\') ? winDir : (winDir + '/')); // append / if absent
    };

    exports.dotNetVersionMapper = {
		'processor': {
			'x86': 'Framework',
			'x64': 'Framework64'
		},
		'version': {
			'net1.0': '1.0.3705',
			'net1.1': '1.1.4322',
			'net2.0': '2.0.50727',
			'net3.5': '3.5',
			'net4.0': '4.0.30319'
		}	
	};

	exports.getDotNetVersionPath = function (version, processor) {

        // http://msdn.microsoft.com/en-us/library/dd414023.aspx
        // http://docs.nuget.org/docs/creating-packages/creating-and-publishing-a-package#Grouping_Assemblies_by_Framework_Version

        // make it processor instead of bit, just incase MS releases FrameworkARM ;)
        
		var actualProcessor = exports.dotNetVersionMapper['processor'][processor];
		var actualVersion = exports.dotNetVersionMapper['version'][version];
		if(typeof actualProcessor === 'undefined' || typeof actualVersion === 'undefined') {
			fail('specified .NET framework is not supported : ' + version + '(' + processor + ')');
			return;
		}
		
		var netFrameworkPath= exports.getWinDir() + 
									'Microsoft.Net\\' +
									exports.dotNetVersionMapper['processor'][processor] + '\\v' +
									exports.dotNetVersionMapper['version'][version] + '\\';
		return netFrameworkPath;
    };

})();