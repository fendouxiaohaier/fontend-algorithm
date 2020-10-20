// import { init, RematchRootState, Models, ExtractRematchDispatchersFromEffects } from '@rematch/core';
// // import models from './models';
// import createLoadingPlugin from '@rematch/loading';
// import createRematchPersist from '@rematch/persist';
// import storage from 'redux-persist/lib/storage';
// // Options 设置请参考
// // https://github.com/rematch/rematch/blob/master/plugins/loading/README.md#options
// const loadingPlugin = createLoadingPlugin({});
// const persistPlugin = createRematchPersist({
//   key: 'root',
//   whitelist: [],
//   throttle: 2000,
//   version: 1,
//   storage,
// });
// const store = init({
//   //models,
//   //plugins: [loadingPlugin, persistPlugin],
// });

// type Loading<M extends Models> = {
//   //models: { [modelKey in keyof M]: M[modelKey]['name'] };
//   effects: {
//     [modelKey in keyof M]: ExtractRematchDispatchersFromEffects<M[modelKey]['effects']>;
//   };
// } & {
//   global: boolean;
// };

// export type Store = typeof store;
// export type Dispatch = typeof store.dispatch;
// export type RootState = RematchRootState<typeof models> & {
//   loading: Loading<typeof models>;
// };



import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { reduceHospitalSource } from './models/hospital'

const reducers = combineReducers({
  hospitalSource: reduceHospitalSource
})

const store = createStore(reducers, applyMiddleware(thunk));


export default store;
