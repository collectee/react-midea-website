import React from 'react';
import {observer} from 'mobx-react'
import VideoLeft from './videoLeft'
import VideoRight from './videoRgiht'
import videosList from "./videosList";

@observer
class showVideo extends React.Component{
    constructor(props){
        super(props)
        this.state={
            id:0,
            videosList:[
                {id:3,title:'手绘',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/apple/apple-1.jpeg',href:''},
                {id:4,title:'动漫宅',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/pv1/pv1-1.jpeg',href:''},
                {id:5,title:'Joeman',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/paper1/paper1-1.jpeg',href:''},
                {id:6,title:'斯巴拉西',poster:'https://z-video.oss-cn-shenzhen.aliyuncs.com/apple/apple-1.jpeg',href:''}
            ]
        }
    }
    otherList(id){
        // console.log(this.state.id,id)
        id = parseInt(id)
        if(id === this.state.id){
            return
        }
        let list = this.props.store.videoClip.data,
            oList = list.filter(node => node.id !== id);
        this.setState({id:id,videosList:oList})
    }
    render(){
        this.otherList(this.props.match.params.id)
        return(
            <div class="relative scollor">
                <VideoLeft id={this.props.match.params.id} $server={this.props.store.$server} store={this.props.store}/>
                <VideoRight videosList={this.state.videosList}/>
            </div>
        )
    }
}
export default showVideo