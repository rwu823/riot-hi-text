const gu = require('gulp')
const webpack = require('webpack')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const bs = require('browser-sync')
const del  = require('del')

const webpackConf = {
    entry: {
        'riot.hi-text': './index.js'
    },
    output: {
        path: 'dist',
        filename: './[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }
        ]
    }
}

const min = function (done){
    return  gu.src('dist/riot-hi-text.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gu.dest('dist'))
}

const build = function (done){
    del.sync('dist')

    webpack(webpackConf, function(err, stats) {
        console.log(stats.toString({
                colors: true
            }))

        gu.src('dist/*.js')
            .pipe(uglify())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gu.dest('dist'))
            .on('end', done)
    })
}

const dev = function (){
    webpackConf.watch = true
    webpack(webpackConf, function(err, stats) {
        console.log(stats.toString({
            colors: true
        }))
    })

    bs.create()
        .init({
            files: ['test/index.html', 'dist/riot.hi-text.js'],
            server: {
                baseDir: './',
                //directory: true
            }
        })
}


gu
    .task('dev', dev)
    .task('build', build)