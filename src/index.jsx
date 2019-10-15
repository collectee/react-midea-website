import React,{Component} from 'react'
import ReactDOM from 'react-dom';
import '../static/css/temp1.scss'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import App from './App'
import {observable, computed, action, reaction} from 'mobx';
import axios from 'axios';
// import App from '../redux/container/showListContain'

// import { createStore } from 'redux'
// import { Provider } from 'react-redux'
// import reduces from '../redux/reduces'

// let store = createStore(reduces)

class MobxStore {
    @observable $server = 'http://47.112.6.146:8081'
    @observable search = ''
    @observable videoClip = {
        currentPage:1,
        data:[
            {id:1,title:'手绘',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/pv1/pv1-1.jpeg',href:'playVideo'},
            {id:2,title:'动漫',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/apple/apple-1.jpeg',href:''},
            {id:3,title:'青空呐喊',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/title1/title1-1.jpeg',href:''},
            {id:4,title:'动漫播放————30年京阿尼的进化之路 feat.Kyoto Animation',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/pv1/pv1-1.jpeg',href:''},
            {id:5,title:'Trump:America First!!!!!!!!!!',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/title1/title1-1.jpeg',href:''},
            {id:6,title:'手绘',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/pv1/pv1-1.jpeg',href:''}
        ]
    };
    @observable showVideo = {};
    @observable otherList = [];
    @computed get nextPage () {
        let page = this.videoClip.currentPage,
            pagesize = this.videoClip.pageSize,
            total = this.videoClip.total
        if(total/pagesize > this.videoClip.currentPage && total !== page*pagesize ){
            page = parseInt(page) + 1;
        }
        return page
    }
    @computed get prePage () {
        let page = this.videoClip.currentPage
        return page>0?(parseInt(page) - 1):1;
    }
    // @computed get otherList () {
    //     let data = this.videoClip.data,
    //         show = this.showVideo
    //     console.log(data.map(node => {
    //         return node.id !== show.id
    //     }),show.id)
    //     return data.filter(node => {
    //         return node.id !== show.id
    //     })
    // }
    constructor(){      //It seems like a create hook function in Vue
        this.setServer()
        this.getList(1)
        this.chooseVideo = this.chooseVideo.bind(this)
    }
    @action setServer(){
        this.$server = window.location.host !== '47.112.6.146'?'http://47.112.6.146:8081':'http://localhost:8081'
    }
    @action getList(currentPage){
        if(this.search){
            axios({
                method:'get',
                url:this.$server + '/video/search',
                params:{
                    title:this.search,
                    currentPage:currentPage
                }
            }).then((res) => {
                if(res.status === 200) this.videoClip = res.data
            })
        }else{
            axios({
                method:'get',
                url:this.$server + '/video/listVideo',
                params:{
                    currentPage:currentPage
                }
            }).then((res) => {
                if(res.status === 200) this.videoClip = res.data
            })
        }
    }
    @action chooseVideo(id){
        let show = this.videoClip.data.find(node => node.id === id)
        this.otherList = this.videoClip.data.filter(node => node.id !== id)
        this.showVideo = show
        console.log(show,id,this.videoClip)
    }
    @action changeSearch(title){
        this.search = title
    }
}
let mobxer = new MobxStore();
ReactDOM.render((
    //{/*<Provider store={store}>*/}
        <Router>
            <Route path="/" component={props=> <App store={mobxer}/>}>
            </Route>
        </Router>
    // {/*<App/>*/}
    // </Provider>
), document.getElementById('root'))
