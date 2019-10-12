import React, { Component} from "react";
import '../static/css/temp1.scss'

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
        };
    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    handleChange() {
        // 当数据源更新时，更新组件状态
        this.setState({});
    }
    render() {
        let list = this.props.children.map((node) => <li key={node.name}><a href={node.href}><i className={"fa "+node.className}></i><span>{node.name}</span></a></li>)
        return <div className={this.props.className}>
            <ul>
                {list}
            </ul>
        </div>;
    }
}

export default TodoList