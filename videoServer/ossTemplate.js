const express = require('express');
const fs = require('fs')
// const path =require('path')
const formIdAble = require('formidable')
const ossControl = require('./ossControl.js')
const ffmpegControl = require('./ffmpegControl.js')
const QueryStr = require('./databaseControl.js')

// const app = express();
const router = express.Router();

router.use(express.static(__dirname + 'public'))   //视频图片存储

router.get(/listVideo$/,function (req,res) {
    let params = req.query
    let query = new QueryStr();
    let selectStr = {
        tableName: 'videos_info',
        fields: ['id','title','author','abstract','poster'],
        data: params.data && Object.keys(params.data) ? params.data : '',
        currentPage: Number(params.currentPage)||1,
        pageSize: Number(params.pageSize)||10
    }
    query.select(selectStr,function (result) {
        query.count('videos_info', '', '', function (rec) {
            let row = rec[0]['COUNT(*)']
            res.send({
                msg:'查询成功',
                currentPage:selectStr.currentPage,
                pageSize:selectStr.pageSize,
                total:row,
                success:true,
                data:result
            })
        })
    },function () {
        res.send({msg:'查询失败',success:false})
    })
})

router.get('/search',function(req,res){
    let params = req.query;
    let query = new QueryStr();
    let selectStr = {
        tableName: 'videos_info',
        fields: ['id','title','author','abstract','poster'],
        data: params.title ? {title:params.title} : '',
        LIKE:true,
        currentPage: Number(params.currentPage)||1,
        pageSize: Number(params.pageSize)||10
    }
    query.select(selectStr,function (result) {
        query.count('videos_info', selectStr.data, true, function (rec) {
            let row = rec[0]['COUNT(*)']
            res.send({
                msg:'查询成功',
                currentPage:selectStr.currentPage,
                pageSize:selectStr.pageSize,
                total:row,
                success:true,
                data:result
            })
        })
    },function () {
        res.send({msg:'查询失败',success:false})
    })
})

router.get('/getVideoInfo',function(req,res){
    let params = req.query;
    let query = new QueryStr();
    let selectStr = {
        tableName: 'videos_info',
        fields: ['id','title','author','size','ossPath','abstract','time','count','poster'],
        data: {id:params.id},
        currentPage: 1,
        pageSize: 1
    }
    query.select(selectStr,function (result) {
        res.send({
            msg:'查询成功',
            success:true,
            data:result
        })
    },function () {
        res.send({msg:'查询失败',success:false})
    })
})

router.get('/getVideo',function (req,res) {
    if(!req.query.name){
        res.send({msg:'请填写视频名，不可与已存在视频名冲突'})
    }
    res.setHeader('Access-Control-Allow-Origin','*');
    let i = 0;
    (function(req,res){
        let url = ossControl.getObjectUrl(req.query.name)
        if(url){
            res.send({'url':url})
            res.end()
        }else{
            if(i++<5) {
                arguments.callee(req, res)
            }else {
                res.send({url:null,msg:'视频已被删除'})
                res.end()
            }
        }
    })(req,res)
})

router.all(/uploadVideo/,function (req,res) {
    let form = new formIdAble.IncomingForm();
    let query = new QueryStr()
    let insertObj = {
        tableName: 'videos_info',
        fields: ['title', 'author', 'ossPath', 'size', 'abstract', 'count', 'tag', 'poster'],
        data: [
            ['','','','','','0','','']
        ]
    }
    form.uploadDir = QueryStr.ip === '47.112.6.146'?'/var/www/server/videoServer/dist':'dist';
    form.keepExtensions = true;
    form.parse(req,function (err,fields,files) {
        if(err){
            console.log(err)
            return false
        }
        console.log(files.file.path)
        if(!files.file.name.match(/\.mp4$|\.flv$/)){
            res.send({'msg':'请更改为mp4或flv格式上传'})
        }
        insertObj.data[0][0] = fields.title
        insertObj.data[0][1] = req.session['uid'] || 'guest'
        insertObj.data[0][3] = files.file.size
        insertObj.data[0][4]= fields.abstract
        let m4sName = files.file.path.replace(/\.mp4$|\.flv$/,'.m4s')
        fs.rename(files.file.path,m4sName,function (err) {
            if(err)console.log(err)
            let name = files.file.name.replace(/\.[\w\W]+$/g,'')
            let ffmpObj = new ffmpegControl()
            insertObj.data[0][2] = 'https://z-video.oss-cn-shenzhen.aliyuncs.com/'+name+'/'+name
            insertObj.data[0][7] = 'https://z-video.oss-cn-shenzhen.aliyuncs.com/'+name+'/'+name+'-1.jpeg';
            ffmpObj.getImage(m4sName,name);
            res.send({'msg':'服务器已接收文件,因服务器转换视频流较久,一般超过三分钟的视频都要等待较长时间'});
            ffmpObj.reduce(m4sName,name,(result) => {
                query.insert(insertObj,() => {console.log('上传成功')})
            })
        })
    })
})

module.exports = router
