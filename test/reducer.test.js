import { createStore } from 'redux';
import reducer from '../src/reducer';

test('successfully initializes store', () => {
    const store = createStore(reducer);
    expect(store.getState()).toHaveProperty('pending');
    expect(store.getState()).toHaveProperty('success');
    expect(store.getState()).toHaveProperty('failure');
});