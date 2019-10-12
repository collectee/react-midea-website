import React from 'react'
import axios from 'axios'

class loginTap extends React.Component{
    constructor(props){
        super(props)
        this.inputUsername = this.inputUsername.bind(this)
        this.inputPassword = this.inputPassword.bind(this)
        this.uploadData = this.uploadData.bind(this)
        this.state={
            showClass:'showing',
            username:'',
            password:''
        }
    }
    uploadData(e){
        e.preventDefault();
        axios({
            method:'post',
            url:this.props.$server + '/login',
            data:{
                username:this.state.username,
                password:this.state.password
            }
        }).then(res => {
            console.log(res.data.msg)
        })
    }
    inputUsername(e){
        this.setState({
            username:e.target.value
        })
    }
    inputPassword(e){
        this.setState({
            password:e.target.value
        })
    }
    render(){
        return (<div className={"taps loginTap "+this.state.showClass}>
            <div class="taps_bg"></div>
            <form>
                <div class="username-div"><label for="v_username">用户名:<input type="text" class="v_username" onChange={this.inputUsername} name="v_username"/></label></div>
                <div class="password-div"><label for="v_password">密码:&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" class="v_password" onChange={this.inputPassword} name="v_password"/></label></div>
                <div class="click-div"><button type="submit" onClick={this.uploadData}>登陆</button></div>
            </form>
        </div>)
    }
}

export default loginTap