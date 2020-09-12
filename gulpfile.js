'use strict';

const buildFolder = "build";
const sourceFolder = "source";

// Пути к папкам и файлам проэкта
const path = {
  	build: { // Папка готового проэкта
		html: `${buildFolder}/`,  // html-файлы
		css: `${buildFolder}/css/`, // css-файлы
		js: `${buildFolder}/js/`, // js-файлы
		img: `${buildFolder}/img/`, // изображения
    fonts: `${buildFolder}/fonts`, // шрифты
    libs: `${buildFolder}/libs`, // сторонние библиотеки
    php: `${buildFolder}/`, // php-файлы
    server: `${buildFolder}/server`, // серверные файлы
  	},
	source: { // Папка с исходниками
		html: [`${sourceFolder}/*.html`, `!${sourceFolder}/_*.html`], // html-файлы, кроме файлов с нижним подчеркиванием в начале
		css: `${sourceFolder}/scss/style.scss`, // основной scss-файл
		js: `${sourceFolder}/js/**/*.js`, // все js-файлы
		img: `${sourceFolder}/img/**/*.{jpg,png,gif,ico,webp,svg}`, // изображения
		svg: `${sourceFolder}/img/sprite/*.svg`, // все векторные иконки (для спрайта)
		fonts: `${sourceFolder}/fonts/*.ttf`, // шрифты только ttf-формата
    webFonts: `${sourceFolder}/fonts/*.{woff,woff2}`, // веб-шрифты
    libs: `${sourceFolder}/libs/**/*.{css,scss,js}`, // файлы сторонних библиотек
    php: `${sourceFolder}/*.php`, // php-файлы
    server: `${sourceFolder}/server/**/*`, // все серверные файлы
	},
	watch: { // За изменением каких файлов следим
		html: `${sourceFolder}/**/*.html`, // за всеми html-файлами
		css: `${sourceFolder}/scss/**/*.scss`, // за всеми scss-файлами
		js: `${sourceFolder}/js/**/*.js`, // за всеми js-файлами
		img: `${sourceFolder}/img/**/*.{jpg,png,gif,ico,webp,svg}`, // за конкретными форматами в папке изображений
    svg: `${sourceFolder}/img/sprite/*.svg`,
    libs: `${sourceFolder}/libs/**/*.{css,js}`, // за файлами сторонних библиотек
    // fonts: `${sourceFolder}/fonts/*.ttf`
    php: `${sourceFolder}/*.php`, // php-файлы
    server: `${sourceFolder}/server/*`, // серверные файлы
	}
}

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const posthtmlWebp = require('posthtml-webp');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const babel = require("gulp-babel");
const flatten = require('gulp-flatten');

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

// Запускаем сервер
function refreshPage() {
	browserSync.init({
		server: {
			baseDir: `${buildFolder}`
		},
		port: 3000,
		notify: false
	})
}

function html() {
	// Берем файлы-html из папки исходников
	return gulp.src(path.source.html)
	.pipe(posthtml([
		// заменяем тэг <include> на содержимое файла указанного в src-атрибуте
		include(),
		// обарачиваем все <img> в <picture> и добавляем туда .webp версию изображения
		// posthtmlWebp({
		// 	replaceExtension: true// заменяем расширение на .webp, а не на .jpg.webp
		// })
	]))
	// кладем в папку сборки
	.pipe(gulp.dest(path.build.html))
	// обновляем страницу
	.pipe(browserSync.stream());
}

function css() {
	// Берем файлы scss из папки исходников
	return gulp.src(path.source.css)
	// конвертируем scss в css
	.pipe(scss({
			outputStyle: 'expanded'//несжатый файл
	}))
	// группируем все медиазапросы вместе
	.pipe(groupMedia())
	// расставляем вендорные префиксы (Список браузеров в package.json "browserslist")
	.pipe(autoprefixer({
			cascade: true
	}))
	// кладем в папку сборки
	.pipe(gulp.dest(path.build.css))
	// минимизируем css
	.pipe(cleanCss())
	// меняем название
	.pipe(rename({
			extname: '.min.css'
	}))
	// кладем в папку сборки
	.pipe(gulp.dest(path.build.css))
	// обновляем страницу
	.pipe(browserSync.stream());
}

function js() {
	// Берем файлы из папки исходников
	return gulp.src(path.source.js)
	// конвертируем в ES5
	.pipe(babel())
	// кладем в папку сборки
	.pipe(gulp.dest(path.build.js))
	// сжимаем js файл
	.pipe(uglify())
	// меняем название
	.pipe(rename({
		extname: '.min.js'
	}))
	// кладем в папку сборки
	.pipe(gulp.dest(path.build.js))
	// обновляем страницу
	.pipe(browserSync.stream());
}

function newJs() {
  // Берем файлы из папки исходников
	return gulp.src(path.source.js)
  .pipe(webpackStream(webpackConfig), webpack)
	// кладем в папку сборки
  .pipe(gulp.dest(path.build.js))
  // сжимаем js файл
	.pipe(uglify())
	// меняем название
	.pipe(rename({
		extname: '.min.js'
	}))
	// кладем в папку сборки
	.pipe(gulp.dest(path.build.js))
	// обновляем страницу
	.pipe(browserSync.stream());
}

function images() {
	// Берем файлы из папки исходников
	return gulp.src(path.source.img)
	// конвертирем в webp
	.pipe(webp({
		quality: 75
	}))
	// кладем в папку сборки
	.pipe(gulp.dest(path.build.img))
	// берем файлы из папки исходников
	.pipe(gulp.src(path.source.img))
	// Оптимизация изображений
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({quality: 75, progressive: true}),
		imagemin.optipng({optimizationLevel: 3}), // от 0 до 7
		imagemin.svgo({
			plugins: [
				{removeViewBox: true},
        {cleanupIDs: false},
        {cleanupListOfValues: {
          floatPrecision: 2,
          leadingZero: true,
          defaultPx: true,
          convertToPx: true
        }}
			]
		})
	]))
	// кладем в папку сборки
	.pipe(gulp.dest(path.build.img))
	// обновляем страницу
	.pipe(browserSync.stream());
}

function createSprite() {
	// Берем файлы из папки исходников
	return gulp.src(path.source.svg)
	// Оптимизация изображений
	.pipe(imagemin([
		imagemin.svgo({
			plugins: [
				{removeViewBox: true},
        {cleanupIDs: false},
        {removeUselessStrokeAndFill: true}
			]
		})
	]))
	// конвертирем в webp
	.pipe(svgSprite({
		mode: {
			// css: { // Activate the «css» mode
			//   render: {
			// 	css: true // Activate CSS output (with default options)
			//   }
			// },
			stack: {
				sprite: '../sprite.svg', // расположение и имя спрайта
				// example: true
			}
    }
	}))
	// кладем в папку сборки
	.pipe(gulp.dest(path.build.img))
	// обновляем страницу
	.pipe(browserSync.stream());
}

function copyFonts() {
	// Берем файлы-шрифтов
	return gulp.src(path.source.webFonts)
	// кладем в папку сборки
	.pipe(gulp.dest(path.build.fonts))
	// обновляем страницу
	.pipe(browserSync.stream());
}

function copyLibs() {
	// Берем файлы-библиотек
  return gulp.src(path.source.libs)
  // Убираем лишнюю структуру папок
  // .pipe(flatten())
	// кладем в папку сборки
  .pipe(gulp.dest(path.build.libs))
  // обновляем страницу
  .pipe(browserSync.stream());
	// Берем файлы-js
  // return gulp.src(path.source.libsJS)
  // // Убираем лишнюю структуру папок
  // // .pipe(flatten())
	// // кладем в папку сборки
	// .pipe(gulp.dest(path.build.js))
}

function copyPhp() {
	// Берем файлы-библиотек
  return gulp.src(path.source.php)
	// кладем в папку сборки
  .pipe(gulp.dest(path.build.php))
  // обновляем страницу
  .pipe(browserSync.stream());
}

function copyServer() {
	// Берем серверные файлы
  return gulp.src(path.source.server)
	// кладем в папку сборки
  .pipe(gulp.dest(path.build.server))
  // обновляем страницу
  .pipe(browserSync.stream());
}

// Очистка папки сборки
function clean() {
	return del(`${buildFolder}/**`);
}

// Конвертация .ttf в .woff и .woff2 (Запускать единоразово отдельно перед первым запуском npm start)
gulp.task('font', () => {
	gulp.src([path.source.fonts])
	.pipe(ttf2woff())
	.pipe(gulp.dest(`${sourceFolder}/fonts/`));
	return gulp.src(path.source.fonts)
	.pipe(ttf2woff2())
	.pipe(gulp.dest(`${sourceFolder}/fonts/`));
})

// Отслеживаем изменения в файлах
function watchFiles() {
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.css, css);
	gulp.watch(path.watch.js, newJs);
	gulp.watch(path.watch.img, images);
  gulp.watch(path.watch.svg, createSprite);
  gulp.watch(path.watch.libs, copyLibs);
  gulp.watch(path.watch.php, copyPhp);
  gulp.watch(path.watch.server, copyServer);
}

// Объединяем таски
const build = gulp.series(clean, createSprite, gulp.parallel(html, css, newJs, images, copyFonts, copyLibs, copyPhp, copyServer));
const watch = gulp.parallel(watchFiles, refreshPage);

exports.copyFonts = copyFonts;
exports.clean = clean;
exports.createSprite = createSprite;
exports.copyLibs = copyLibs;
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = gulp.series(build, watch);
exports.newJs = newJs;
exports.copyPhp = copyPhp;
exports.copyPhp = copyServer;
