import React, { Component} from "react";
import {Link} from "react-router-dom";
import axios from 'axios';
import TodoList from './todoList'
import LoginTap from './loginTap'
import Transcode from './transcodeTap'
import UploadTap from './uploadTap'

class Header extends Component{
    constructor(props){
        super(props)
        this.showTap = this.showTap.bind(this)
        this.search = this.search.bind(this)
        this.clickSearch = this.clickSearch.bind(this)
        this.showOutsideMenu = this.showOutsideMenu.bind(this)
        this.state = {
            outside_manu_class:'outside-menu hidding',
            outside_manu_child:[
                {name:'上传',className:'fa-upload',href:'#',clickType:()=>{console.log('1');this.showTap('upload')}},
                {name:'转码',className:'fa-film',href:'#',clickType:()=>{console.log('1');this.showTap('transcode')}},
                {name:'登陆',className:'fa-chevron-right',href:'#',clickType:()=>{console.log('1');this.showTap('login')}},
                {name:'登出',className:'fa-chevron-right',href:'#'}
            ],
            showType:'',
            title:''
        };
    }
    showOutsideMenu(){
        let type = this.state.outside_manu_class.match(/showing/)?'hidding':'showing'
        this.setState({
            outside_manu_class:'outside-menu '+type,
            showType:''
        })
    }
    showTap(type){
        console.log(2)
        this.setState({
            showType:type
        })
    }
    search(e){
        this.setState({
            title:e.target.value
        })
    }
    clickSearch(){
        this.props.store.changeSearch(this.state.title)
        this.props.store.getList(1)
    }
    render(){
        console.log(3,this.state.showType)
        let showTap = '',
            headerClass = this.state.showType?'expand':''
        if(this.state.showType === 'upload'){
            showTap = <UploadTap show={true} $server={this.props.store.$server}/>
        }
        if(this.state.showType === 'transcode'){
            showTap = <Transcode show={true} $server={this.props.store.$server}/>
        }
        if(this.state.showType === 'login'){
            showTap = <LoginTap show={true} $server={this.props.store.$server}/>
        }
        return (<div>
        <div className={"header-div "+headerClass} >
            <div class="blur"></div>
            <header class="header-expand relative ">
                <div class="left-icon"><Link to={'/'}><div class="header-icon"></div><span>React Movie Website</span></Link></div>
                <div class="right-bars"><i class="fa fa-bars" onClick={this.showOutsideMenu}></i></div>
                <div class="search-bar"><div class="inputDiv"><input onChange={this.search}/><i class="fa fa-search" onClick={this.clickSearch}></i></div></div>
            </header>
            <TodoList className={this.state.outside_manu_class} children={this.state.outside_manu_child}/>
            {showTap}
        </div>
        </div>)
    }
}

export default Header