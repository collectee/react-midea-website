import React from 'react';
import {Link} from 'react-router-dom'

class videoRight extends React.Component{
    constructor(props){
        super(props)
        this.state={
        }
    }
    render(){
        let list = this.props.videosList.map((node) => {
            return (
                <li key={node.id}>
                    <div class="flex-item-box">
                        <Link to={'/playVideo/'+node.id}>
                            <div></div>
                            <img src={node.poster}/>
                            <span>{node.title}</span>
                        </Link>
                    </div>
                </li>
            )
        })
        return (
            <div class="video-right">
                <ul>
                    {list}
                </ul>
            </div>
        )
    }
}

export default videoRight