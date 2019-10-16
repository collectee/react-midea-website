import React from 'react'
import axios from 'axios'

class uploadTap extends React.Component{
    constructor(props){
        super(props)
        this.timer = null
        this.debouce = 0
        this.inputTitle = this.inputTitle.bind(this)
        this.inputAbstract = this.inputAbstract.bind(this)
        this.uploadData = this.uploadData.bind(this)
        this.state={
            showClass:'showing',
            title:'',
            file:{},
            abstract:'',
            author:'guest'
        }
    }
    // componentWillReceiveProps(props){
    //     if(props.show){
    //         this.setState({showClass:'showing'})
    //     }
    // }
    uploadData(e){
        e.preventDefault()
        let forms = new FormData()
        forms.append('file',document.querySelector('.v_file').files[0])
        forms.append('title',this.state.title)
        forms.append('abstract',this.state.abstract)
        this.timer = setTimeout(() => {
            this.debouce = 9999
            axios({
                method:'post',
                url:this.props.$server + '/video/uploadVideo',
                data:forms
            }).then((res) => {
                alert(res.data.msg)
            })
        },this.debouce)
    }
    inputTitle(e){
        this.setState({
            title:e.target.value
        })
    }
    inputAbstract(e){
        this.setState({
            abstract:e.target.value
        })
    }
    render(){
        return (<div className={"taps uploadTap "+this.state.showClass}>
            <div class="taps_bg"></div>
            <form>
                <div class="title-div"><label for="v_title">视频标题:<input type="text" class="v_title" name="v_title" onChange={this.inputTitle} value={this.state.title}/></label></div>
                <div class="file-div"><label for="v_file">视频文件:<input type="file" class="v_file" name="v_file" /></label></div>
                <div class="cover-div"><label for="v_cover">视频文件:<input type="text" class="v_cover" name="v_cover"/></label></div>
                <div class="text-div"><label >视频描述:</label><textarea class="v_text" onChange={this.inputAbstract} value={this.state.abstract}></textarea></div>
                <div class="click-div"><button type="submit" onClick={this.uploadData}>确定上传</button></div>
            </form>
        </div>)
    }
}

export default uploadTap