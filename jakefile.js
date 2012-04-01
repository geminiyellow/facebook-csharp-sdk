var njake 		= require('./Build/njake'),
	exec 		= njake.exec,
	msbuild 	= njake.msbuild;

task('default', ['build'])

msbuild.setDefaults({
	properties: { Configuration: 'Release' },
	processor : 'x86',
	version	  : 'net4.0'
})

namespace('build', function () {
	
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

	task('all', ['build:net40', 'build:net35', 'build:wp71', 'build:sl5'])

})

task('build', ['build:all'])

namespace('clean', function () {
	
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

	task('all', ['clean:net40', 'clean:net35', 'clean:wp71', 'clean:sl5'])

})

task('clean', ['clean:all'])