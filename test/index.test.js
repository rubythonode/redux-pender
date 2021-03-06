import penderMiddleware, { penderReducer, createPenderAction, pender, resetPender } from '../src';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { handleActions, createAction } from 'redux-actions';

test('entire flow is working (major)', async () => {
    const promiseCreator = ({triggerError, value}) => {
        const p = new Promise((resolve, reject) => {
            setTimeout(() => {
                if(triggerError) {
                    reject(value);
                } else {
                    resolve(value);
                }
            }, 100)
        });

        return p;
    }
    

    const ACTION_TYPE = 'ACTION_TYPE';
    const actionCreator = createAction(ACTION_TYPE, promiseCreator);

    const myReducer = handleActions({
        ...pender({
            type: ACTION_TYPE,
            onSuccess: (state, action) => {
                return action.payload;
            }
        })
    }, null)

    const reducers = combineReducers({
        myReducer,
        pender: penderReducer
    });

    const store = createStore(reducers, applyMiddleware(penderMiddleware()));

    expect(store).toBeTruthy(); 

    const promise = store.dispatch(actionCreator({triggerError: false, value: true}));

    // sleep 50ms 
    await new Promise(
        resolve => {
            setTimeout(
               resolve, 50
            )
        }
    )

    expect(store.getState().pender.pending[ACTION_TYPE]).toBe(true);

    const r = await promise;

    expect(store.getState().pender.pending[ACTION_TYPE]).toBe(false);
    expect(store.getState().pender.success[ACTION_TYPE]).toBe(true);
    expect(store.getState().myReducer).toBe(true);

    // test reset
    await store.dispatch(resetPender());
    expect(Object.keys(store.getState().pender.success).length).toBe(0);
})


test('entire flow is working (!major)', async () => {
    const promiseCreator = ({triggerError, value}) => {
        const p = new Promise((resolve, reject) => {
            setTimeout(() => {
                if(triggerError) {
                    reject(value);
                } else {
                    resolve(value);
                }
            }, 100)
        });

        return p;
    }
    

    const ACTION_TYPE = 'ACTION_TYPE';
    const actionCreator = createPenderAction(ACTION_TYPE, promiseCreator);

    const myReducer = handleActions({
        ...pender({
            type: ACTION_TYPE,
            onSuccess: (state, action) => {
                return action.payload;
            }
        })
    }, null)

    const reducers = combineReducers({
        myReducer,
        pender: penderReducer
    });

    const store = createStore(reducers, applyMiddleware(penderMiddleware({major: false})));

    expect(store).toBeTruthy(); 

    const promise = store.dispatch(actionCreator({triggerError: false, value: true}));

    // sleep 50ms 
    await new Promise(
        resolve => {
            setTimeout(
               resolve, 50
            )
        }
    )

    expect(store.getState().pender.pending[ACTION_TYPE]).toBe(true);

    const r = await promise;

    expect(store.getState().pender.pending[ACTION_TYPE]).toBe(false);
    expect(store.getState().pender.success[ACTION_TYPE]).toBe(true);
    expect(store.getState().myReducer).toBe(true);

    // test reset
    await store.dispatch(resetPender());
    expect(Object.keys(store.getState().pender.success).length).toBe(0);
})

