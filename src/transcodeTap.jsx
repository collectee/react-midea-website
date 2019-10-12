import React from 'react'

class transcodeTap extends React.Component{
    constructor(props){
        super(props)
        this.state={
            showClass:'showing',

        }
    }
    // componentWillReceiveProps(props){
    //     if(props.show){
    //         this.setState({showClass:'showing'})
    //     }
    // }

    render(){
        return (<div className={"taps transcodeTap "+this.state.showClass}>
            <div class="taps_bg"></div>
            <form>
                <div class="format-div"><label for="v_format">视频格式:<input type="text" class="v_format"  name="v_format"/></label></div>
                <div class="file-div"><label for="v_file">视频文件:<input type="file" class="v_file" name="v_file"/></label></div>
                <div class="cover-div"><label for="v_cover">视频文件:<input type="text" class="v_cover" name="v_cover"/></label></div>
                <div class="click-div"><button type="submit">确定转码</button></div>
            </form>
        </div>)
    }
}

export default transcodeTap