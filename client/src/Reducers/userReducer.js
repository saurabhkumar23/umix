export const initialState = null                //initial user state is null

export const reducer = (state,action) => {
    if(action.type=='USER'){
        return action.payload
    }
    if(action.type=='CLEAR'){
        return null
    }
    if(action.type=='UPDATE'){
        return {...state,followers:action.payload.followers,following:action.payload.following}
    }
    if(action.type=='UPDATEPIC'){
        return {...state,photo:action.payload}
    }
    return state
}