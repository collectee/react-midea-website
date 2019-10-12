import axios from 'axios'

class Ajax {
    constructor(){
        this.server = 'http://localhost:8081/';
        this.progress = null
    }
    uploadVideo(data){
        let config = {
            method:'post',
            url:this.server+'/video/uploadVideo',
            //添加请求头
            headers: { "Content-Type": "multipart/form-data" },
            //添加上传进度监听事件
            data:data,
            onUploadProgress: e => {
                var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
                this.progress = completeProgress;
            }
        };
        return axios(config)
    }
    listVideo(data){
        let config = {
            method:'get',
            url:this.server+'/video/listVideo ',
            //添加上传进度监听事件
            param:data
        };
        return axios(config)
    }
}

class V_Clip{
    constructor(){
        this.ajax = new Ajax()
    }
    nextPage(pageNum,cb){
        let currentPage = parseInt(pageNum) + 1;
        this.ajax.listVideo({
            currentPage:currentPage
        }).then(function ({data}) {
            if(!data.data.length){
                data.currentPage = currentPage - 1
            }
            cb(data)
        })
    }
    prePage(pageNum,cb){
        let currentPage = parseInt(pageNum) - 1;
        this.ajax.listVideo({
            currentPage:currentPage>0?currentPage:1
        }).then(function ({data}) {
            if(!data.data.length){
                data.currentPage = currentPage + 1
            }
            cb(data)
        })
    }
}

export default V_Clip