import '../static/css/temp1.scss'
import React,{Component} from 'react'
import {BrowserRouter as Router , Route, IndexRoute} from 'react-router-dom';

React.render((
    <Router>
        <Route path="/" component={App}>
            {/* 当 url 为/时渲染 Dashboard */}
            <IndexRoute component={Dashboard} />
            <Route path="about" component={About} />
            <Route path="inbox" component={Inbox}>
                <Route path="messages/:id" component={Message} />
            </Route>
        </Route>
    </Router>
), document.body)
