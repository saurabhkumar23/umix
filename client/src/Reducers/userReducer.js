export const initialState = null                //initial user state is null

export const reducer = (state,action) => {
    if(action.type=='USER'){
        return action.payload
    }
    return state
}