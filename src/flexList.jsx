import React ,{Component}from 'react';
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'
@observer class flexList extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        let list = this.props.videos.map((node) => {
            return (
                <div class="flex-item-box" key={node.id}>
                    <Link to={'/playVideo/'+node.id} onClick={(e) => {this.props.chooseVideo(node.id)}}>
                        <div></div>
                        <img src={node.poster}/>
                        <span><h6>{node.title}</h6><article>{node.abstract}</article></span>
                    </Link>
                </div>
            )
        })
        return (
            <div class="flex-box">
                {list}
            </div>
        )
    }
}

export default flexList