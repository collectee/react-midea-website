import React from 'react';

class showVideo extends React.Component{
    constructor(props){
        super(props)
        this.state={}
    }
    render(){
        let list = this.props.commentList.map((node) => {
            return (
                <div class="commentTap" key={node.time}>
                    <div class="u_img"><img src={node.profile}/></div>
                    <div class="u_cm">
                        <div class="u_time">
                            <time >{node.time}</time>
                        </div>
                        <article>{node.comment}</article>
                        <div class="control_box">
                            <button>回复</button>
                        </div>
                    </div>
                </div>
            )
        })
        return(
            <div class="videoComment">
                <div class="labelComment">评论区</div>
                {list}
            </div>

        )
    }
}
export default showVideo