import React from 'react';
import FlexList from './flexList'
import Pagination from './pagination'
import {observer} from 'mobx-react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

@observer class videosList extends React.Component{
    constructor(props){
        super(props)
        this.state={
            thisPage:'2',
            videos_clip:[
                {id:1,title:'手绘',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/pv1/pv1-1.jpeg',href:'playVideo'},
                {id:2,title:'动漫',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/apple/apple-1.jpeg',href:''},
                {id:3,title:'青空呐喊',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/title1/title1-1.jpeg',href:''},
                {id:4,title:'动漫播放————30年京阿尼的进化之路 feat.Kyoto Animation',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/pv1/pv1-1.jpeg',href:''},
                {id:5,title:'Trump:America First!!!!!!!!!!',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/title1/title1-1.jpeg',href:''},
                {id:6,title:'手绘',abstract:'',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/pv1/pv1-1.jpeg',href:''}
            ]
        }
    }
    render(){
        console.log(this.props.closeTap)
        return (
            <div class="relative scollor">
                <FlexList videos={this.props.store.videoClip.data} chooseVideo={this.props.store.chooseVideo}/>
                <Pagination currentPage={this.props.store.videoClip.currentPage} store={this.props.store} closeTap={this.props.closeTap}/>
            </div>
        )
    }
}
export default videosList