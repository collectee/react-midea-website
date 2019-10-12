import { combineReducers } from 'redux'

const videoClip = (state = {}, action) => {
    switch (action.type) {
        case 'changePage':
            return action.data
        default:
            return state
    }
}

const showVideo = (state = {}, action) => {
    switch (action.type) {
        case 'changeVideo':
            return action.data
        default:
            return state
    }
}

export default combineReducers({
    videoClip,
    showVideo
})

// export const getOthorVideo = (state) => {
//     return state.videoClip.data.filter((node)=> {
//         return node.id !== state.showVideo.id
//     })
// }
