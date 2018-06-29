var gulp = require('gulp'),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    server = require('gulp-webserver'),
    sass = require('gulp-sass'),
    mincss = require('gulp-clean-css'),
    minjs = require('gulp-uglify'),
    minhtml = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    mock = require('./mock/mock'),
    userdata = require('./mock/user/user').userInfo;
gulp.task('sass', function() {
    gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
});
gulp.task('devserver', function() {
    gulp.src('src')
        .pipe(server({
            port: 8060,
            host: 'localhost',
            open: true,
            middleware: function(req, res, next) {
                if (req.url === "/favicon.ico") {
                    return false;
                }
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === '/' ? '/index.html' : pathname;
                if (/\/api\//.test(pathname)) {
                    if (pathname === '/api/login' || pathname === '/api/reglogin') {
                        var arr = [];
                        req.on('data', function(chunk) {
                            arr.push(chunk);
                        });
                        req.on('end', function() {
                            var data = Buffer.concat(arr).toString();
                            data = require('querystring').parse(data);
                            if (pathname === '/api/login') {
                                // 查找
                                var resule = userdata.some(function(v) {
                                    return v.user == data.user && v.pwd == data.pwd;
                                });
                                if (resule) {
                                    res.end('{"res":1,"mes":"登录成功"}');
                                } else {
                                    res.end('{"res":0,"mes":"用户名或密码输入有误"}');
                                }
                            } else {
                                // 添加
                                userdata.push(data);
                                var userObj = {
                                    userInfo: userdata
                                };
                                fs.writeFileSync('./mock/user/user.json', JSON.stringify(userObj));
                                res.end('{"res":1,"mes":"注册成功"}');
                            }
                        });
                        return false;
                    }
                    res.end(JSON.stringify(mock(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
});

gulp.task('change', function() {
    gulp.watch('src/scss/*.scss', ['sass'])
});

gulp.task('dev', ['sass', 'change', 'devserver']);

gulp.task('mincss', function() {
    gulp.src('src/css/*.css')
        .pipe(mincss())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('build/css'))
});
gulp.task('minjs', function() {
    gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(minjs())
        .pipe(gulp.dest('build/js'))
});
gulp.task('minhtml', function() {
    gulp.src('src/**/*.html')
        .pipe(minhtml({
            removeComments: false,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('build'))
});
gulp.task('buildserver', function() {
    gulp.src('build')
        .pipe(server({
            port: 8060,
            host: 'localhost',
            open: true,
            middleware: function(req, res, next) {
                if (req.url === "/favicon.ico") {
                    return false;
                }
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === '/' ? '/index.html' : pathname;
                if (/\/api\//.test(pathname)) {
                    if (pathname === '/api/login' || pathname === '/api/reglogin') {
                        var arr = [];
                        req.on('data', function(chunk) {
                            arr.push(chunk);
                        });
                        req.on('end', function() {
                            var data = Buffer.concat(arr).toString();
                            data = require('querystring').parse(data);
                            if (pathname === '/api/login') {
                                // 查找
                                var resule = userdata.some(function(v) {
                                    return v.user == data.user && v.pwd == data.pwd;
                                });
                                if (resule) {
                                    res.end('{"res":1,"mes":"登录成功"}');
                                } else {
                                    res.end('{"res":0,"mes":"用户名或密码输入有误"}');
                                }
                            } else {
                                // 添加
                                userdata.push(data);
                                var userObj = {
                                    userInfo: userdata
                                };
                                fs.writeFileSync('./mock/user/user.json', JSON.stringify(userObj));
                                res.end('{"res":1,"mes":"注册成功"}');
                            }
                        });
                        return false;
                    }
                    res.end(JSON.stringify(mock(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'build', pathname)));
                }
            }
        }))
});
gulp.task('build', ['mincss', 'minjs', 'minhtml', 'buildserver']);