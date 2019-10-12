const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const ossControl = require('./ossControl.js')
ffmpeg.setFfmpegPath(ffmpegPath)

// let ffmpeg_cmplxFilter = [
//     'split=2[s0][s1]',
//     {filter:'scale',options:{w:480,h:-2},inputs:'s0',outputs:'480s'},
//     {filter:'scale',options:{w:360,h:-2},inputs:'s1',outputs:'360s'},
//     "-map '[480s]' -c:v:0 libx264 -crf 25 -preset veryslow",
//     "-map '[360s]' -c:v:1 libx264 -crf 27 -preset veryslow",
//     "-map a -c:a:0 libfdk_aac -ar:a:0 22050",
//     "-map a -c:a:1 libfdk_aac -ar:a:1 44100"
// ]

class Ffmepg {
    constructor(ffmpeg_option,ffmpeg_img_option){
        this.ffmpeg_option = ffmpeg_option || [
            "-g 150",
            "-sc_threshold 0",
            "-b_strategy 0",
            "-min_seg_duration 50000",
            "-use_timeline 0",
            "-use_template 1",
            "-single_file 1",
            // "-window_size 5",
            '-f dash'
        ]
        this.ffmepg_img_option = ffmpeg_img_option ||[
            "-r 1",
            "-ss 00:01:00",
            "-t 1",
            // "-vframes 10",
            "-q:v 2",
            "-f image2",
        ]
    }
    replaceToM4s (path,ossName,next) {
        fs.rename(path+'/'+ossName+'-stream0.mp4',path+'/'+ossName+'-stream0.m4s',err => {if(err)console.log(err)})
        fs.rename(path+'/'+ossName+'-stream1.mp4',path+'/'+ossName+'-stream1.m4s',err => {if(err)console.log(err)})
        fs.readFile(path+'/'+ossName,function (err,fd) {
            if(err)console.log(err)
            let str = fd.toString().replace(/\.mp4/g,'.m4s')
            fs.writeFile(path+'/'+ossName,str,function (err) {
                if(err)console.log(err)
                if(next && typeof next === 'function'){
                    next()
                }
            })
        })
    }
    uploadReady(oldPath,ossName,callback){
        fs.unlink(oldPath,function (err) {
            if(err){
                console.log(err)
            }
            let pm3 = new Promise(function (resolve) {
                ossControl.uploadObject(ossName,result => resolve(result),'dist')
            })
            Promise.all([pm3]).then(function (result) {
                if(callback && typeof callback === 'function'){
                    callback(result)
                }
            })
        })
    }
    reduce(oldPath,ossName,callback){
        ffmpeg(oldPath)
        // .complexFilter(ffmpeg_cmplxFilter)
            .size('1280x720')
            .aspect('16:9')
            .applyAutopadding(true,'black')
            .outputOptions(this.ffmpeg_option)
            .output('dist/'+ossName)
            .on('end',() => {
                this.uploadReady(oldPath,ossName,callback)
                // this.replaceToM4s('dist',ossName,() =>{
                //     this.uploadReady(oldPath,ossName,callback)
                // })
            })
            .run()
    }
    getImage(oldPath,ossName){
        ffmpeg(oldPath)
            .outputOptions(this.ffmepg_img_option)
            .output('dist/'+ossName+'-%d.jpeg')
            .on('end',function() {
                console.log('完成')
            })
            .run()
    }
}

module.exports = Ffmepg
