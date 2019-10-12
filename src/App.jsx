import React, { Component} from "react";
import '../static/css/temp1.scss'

class App extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {};
    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    handleChange() {
        // 当数据源更新时，更新组件状态
        this.setState({});
    }
    render(){

    }
}

export default App