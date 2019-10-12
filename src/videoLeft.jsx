import React from 'react';
import VideoComment from './videoComment'
import axios from 'axios'
// import dashjs from ''

class videoLeft extends React.Component{
    constructor(props){
        super(props)
        this.state={
            id:0,
            commentList:[
                {profile:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',comment:'厉害厉害',time:'2019/7/18 00:34:19'},
                {profile:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',comment:'厉害厉害',time:'2019/7/18 00:35:19'},
                {profile:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',comment:'厉害厉害',time:'2019/7/18 00:36:19'}
            ],
            profile:"https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1568522513&di=8064c2b9b2d6a87db8687ddce5fd582f&src=http://i0.hdslb.com/bfs/archive/13a1b16acf340763b5c2521fe4d8995a0490481c.jpg",
            title:'【ヨルシカ】「所以我放弃了音乐」MV【ナブナ/n-buna × suis】',
            poster:'',
            abstract:'sm34914430 https://youtu.be/KTZ-y85Erus\n' +
            '                            【授权转载】\n' +
            '                            ヨルシカ - だから僕は音楽を辞めた\n' +
            '                            Yorushika - Moonlight\n' +
            '\n' +
            '                            作詞作曲、編曲(Words and Music,Arranged)：n-buna\n' +
            '                            Vocal：suis\n' +
            '\n' +
            '                            Music Video Created by ぽぷりか,まごつき\n' +
            '\n' +
            '                            1st Full Album 「だから僕は音楽を辞めた」\n' +
            '                            2019年4月10日(水)発売、予約受付中\n' +
            '                            http://yorushika.com\n' +
            '                            字幕制作者（日语）：KitanoNani'

        }
    }
    getVideo(id){
        id = parseInt(id)
        if(id === this.state.id){
            return
        }
        this.getVideoInfo(id,(rsObj) => {
            let data = rsObj.data[0]
            console.log(id,data)
            this.setState({
                id:id,
                title:data.title,
                abstract:data.abstract,
                poster:data.poster
            })
            this.getAuthorProfile(data.author).then((res) =>{
                this.setState({id:id,profile:res.data.data[0].profile})
            })
            let obj = document.querySelector('#vd');
            let player = dashjs.MediaPlayer().create()
            player.initialize(obj,data.ossPath,false)
        })
    }
    getVideoInfo(id,cb) {
        id = parseInt(id)
        axios({
            method:'get',
            url:this.props.$server + '/video/getVideoInfo',
            params:{
                id:id
            }
        }).then((res) => {
            cb(res.data)
        })
    }
    getAuthorProfile(name){
        return axios({
                method:'get',
                url:this.props.$server + '/getProfile',
                params:{
                    username:name
                }
            })
    }
    render(){
        this.getVideo(this.props.id)
        return(
            <div class="video-left">
                <div class="videoWrap">
                    <video id='vd' controls poster={this.state.poster}>
                        showSomething
                    </video>
                </div>
                <div class="videoInfo">
                    <div class="authorImg">
                        <img src={this.state.profile}/>
                    </div>
                    <div class="v_info">
                        <h2>{this.state.title}</h2>
                        <article>{this.state.abstract}</article>
                    </div>
                </div>
                <VideoComment commentList={this.state.commentList}/>
            </div>
        )
    }
}
export default videoLeft