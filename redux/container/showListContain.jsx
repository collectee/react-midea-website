import App from '../../src/App'
import { connect } from 'react-redux';
import V_Clip from '../action/index'

let mapStateToProps = (state) => ({
    videoClip: state.videoClip
})

let mapDispatchToProps = (dispatch) => {
    return {
        initPage:() => {
            let vClip = new V_Clip()
            vClip.nextPage(0,function(res){
                dispatch({type:'changePage', data:res})
            })
        },
        prePage: data => {
            let vClip = new V_Clip()
            vClip.prePage(data,function(res){
                dispatch({type:'changePage', data:res})
            })
        },
        nextPage: data  => {
            let vClip = new V_Clip()
            vClip.nextPage(data,function(res){
                dispatch({type:'changePage', data:res})
            })
        },
        search : data  => {
            let vClip = new V_Clip()
            vClip.prePage(data,function(res){
                dispatch({type:'changePage', data:res})
            })
        },
        showVideo : data =>{
            dispatch({type:'changeVideo', data:data})
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)