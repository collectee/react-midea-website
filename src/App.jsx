import React, { Component} from "react";
import {observer} from 'mobx-react'
import Header from './header'
import TodoList from './todoList'
import VideoList from './videosList'
import ShowVideo from './showVideo'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

import '../static/css/temp1.scss'

@observer
class App extends Component {
    constructor(props) {
        super(props);
        this.showLeft = this.showLeft.bind(this)
        // props.initPage()
        this.state = {
            outside_manu_class:'outside-menu hidding',
            outside_manu_child:[
                {name:'上传',className:'fa-upload',href:'#',clickType:()=>{this.showTap('upload')}},
                {name:'转码',className:'fa-film',href:'#',clickType:()=>{this.showTap('transcode')}},
                {name:'登陆',className:'fa-chevron-right',href:'#',clickType:()=>{this.showTap('login')}},
                {name:'登出',className:'fa-chevron-right',href:'#'}
            ],
            left_menu_child:[
                {name:'Media',className:'fa-chevron-right',href:'/react/'},
                {name:'Articles',className:'fa-chevron-right',href:'/vue/'},
                {name:'UserProfile',className:'fa-chevron-right',href:'/'}
            ],
            showType:'',
            closeTap:''
        };
    }
    showLeft(){
        this.setState({
            closeTap:this.state.closeTap?'':'closeTap'
        })
    }
    render(){
        let closeTap = this.state.closeTap
    return (<div>
        <Header store={this.props.store}/>
        <div className={"left-menu "+closeTap}>
            <TodoList  className={'relative'} children={this.state.left_menu_child}/>
            <div class="closeLeft" onClick={this.showLeft}></div>
        </div>
        <div className={"right-menu "+closeTap}>
            <Route exact path="/" component={props => <VideoList closeTap={closeTap} store={this.props.store}></VideoList>}></Route>
            <Route path="/playVideo/:id" component={props => <ShowVideo {...props} store={this.props.store}/>}></Route>
        </div>
        </div>)
    }
}

export default App