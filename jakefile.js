var njake 		= require('./Build/njake'),
	exec 		= njake.exec,
	msbuild 	= njake.msbuild
	xunit		= njake.xunit;

task('default', ['build'])

msbuild.setDefaults({
	properties: { Configuration: 'Release' },
	processor : 'x86',
	version	  : 'net4.0'
})

xunit.setDefaults({
	_exe: 'Tools/xunit-1.8/xunit.console.clr4.x86'
})

namespace('build', function () {

	desc('Build .NET 4.5 binaries')
	task('net45', function () {
		msbuild({
			file: 'Source/Facebook-Net45.sln',
			targets: ['Build']
		})
	}, { async: true })
	
	desc('Build .NET 4.0 binaries')
	task('net40', function () {
		msbuild({
			file: 'Source/Facebook-Net40.sln',
			targets: ['Build']
		})
	}, { async: true })

	desc('Build .NET 3.5 binaries')
	task('net35', function () {
		msbuild({
			file: 'Source/Facebook-Net35.sln',
			targets: ['Build']
		})
	}, { async: true })

	desc('Build WinRT(Metro) binaries')
	task('winrt', function () {
		msbuild({
			file: 'Source/Facebook-WinRT.sln',
			targets: ['Build']
		})
	}, { async: true })

	desc('Build Windows Phone 7.1 binaries')
	task('wp71', function () {
		msbuild({
			file: 'Source/Facebook-WP7.sln',
			targets: ['Build']
		})
	}, { async: true })

	desc('Build Silverlight 5 binaries')
	task('sl5', function () {
		msbuild({
			file: 'Source/Facebook-SL5.sln',
			targets: ['Build']
		})
	}, { async: true })

	task('all', ['build:net45', 'build:net40', 'build:net35', 'build:wp71', 'build:sl5', 'build:winrt'])

})

task('build', ['build:all'])

namespace('clean', function () {

	task('net45', function () {
		msbuild({
			file: 'Source/Facebook-Net40.sln',
			targets: ['Clean']
		})
	}, { async: true })
	
	task('net40', function () {
		msbuild({
			file: 'Source/Facebook-Net40.sln',
			targets: ['Clean']
		})
	}, { async: true })

	task('net35', function () {
		msbuild({
			file: 'Source/Facebook-Net35.sln',
			targets: ['Clean']
		})
	}, { async: true })

	task('winrt', function () {
		msbuild({
			file: 'Source/Facebook-WinRT.sln',
			targets: ['Clean']
		})
	}, { async: true })

	task('wp71', function () {
		msbuild({
			file: 'Source/Facebook-WP7.sln',
			targets: ['Clean']
		})
	}, { async: true })

	task('sl5', function () {
		msbuild({
			file: 'Source/Facebook-SL5.sln',
			targets: ['Clean']
		})
	}, { async: true })

	task('all', ['clean:net45', 'clean:net40', 'clean:net35', 'clean:wp71', 'clean:sl5', 'clean:winrt'])

})

task('clean', ['clean:all'])

namespace('tests', function () {
	
	task('net40', function () {
		xunit({
			assembly: 'Bin/Tests/Release/Facebook.Tests.dll'
		})
	})

	task('all', ['tests:net40'])

})

desc('Run tests')
task('test', ['tests:all'])