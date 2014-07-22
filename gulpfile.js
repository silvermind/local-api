var gulp = require('gulp'),
    watch = require('gulp-watch'),
    spawn = require('child_process').spawn,
    node;

gulp.task('server',function(){
    if(node){
        node.kill();
    }
    node = spawn('node', ['app/app.js'], {stdio: 'inherit'});
    node.on('close', function(code){
        if(code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});
gulp.task('default',function(){
    watch({glob:['app/**/*.js','fake-api/**/*.js','fake-oauth/**/*.js','fake-connect/**/*.js']}, function(){
        gulp.run('server');
    });
});