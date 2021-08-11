const redux = require('redux')
const  createstore  =  redux.createStore()
const BUY_CAKE =  'BUY_CAKE'
const BUY_ICE =  'BUY_ICE'

const buyCake  =  ()=>{
    return {
        type: BUY_CAKE,
        info  : 'First redux'
    }
}
const buyIce  =  ()=>{
    return {
        type: BUY_ICE,
        info  : 'First redux'
    }
}
const initialState= {
    numofcakes : 10,
    numofices : 20
}
const reducer = (state = initialState , action) =>{
    switch(action.type) {
        case BUY_CAKE  : return{
            ...state ,
            numofcakes :  state.numofcakes - 1
            
        }
        case BUY_ICE  : return{
            ...state ,
            numofices :  state.numofices - 1
            
        }
        default : return state
    }
}
const store =  createstore(reducer)
console.log('initialState' , store.getState())
const unsubscribe  = store.subscribe(()=>{
    console.log('updated state',store.getState())
})
store.dispatch(buyCake())
store.dispatch(buyCake())
store.dispatch(buyCake())
unsubscribe()
