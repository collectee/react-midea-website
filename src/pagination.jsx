import React from 'react'
import {observer} from 'mobx-react'
// import { connect } from 'react-redux';
// import { nextPage,prePage } from '../redux/action'

@observer class Pagination extends React.Component{
    constructor(props){
        super(props)
        this.prePage = this.prePage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.state={
        }
    }
    prePage(){
        this.props.store.getList(this.props.store.prePage)
        // this.props.prePage(this.props.thisPage)
    }
    nextPage(){
        this.props.store.getList(this.props.store.nextPage)
        // this.props.nextPage(this.props.thisPage)
    }
    render(){
        return(
            <div className={"pagination "+this.props.closeTap}>
                <div>
                    <a><span class="click-page" onClick={this.prePage}>上一页</span></a>
                    <span class="this-page" >{this.props.currentPage}</span>
                    <a><span class="click-page" onClick={this.nextPage}>下一页</span></a>
                </div>
            </div>
        )
    }
}

export default Pagination