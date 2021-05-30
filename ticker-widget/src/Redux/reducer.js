import actions from './actions';
import storeKeys from './storeDataKeys';

const defaultState = {};
const rootReducer = (state = defaultState, action) => {
  console.log('>>>its here ', action);
  switch (action.type) {
    case actions.SAVE_TICKER_DATA: {
      return {
        ...state,
        [storeKeys.TICKER_DATA]: action[storeKeys.TICKER_DATA],
      };
    }
    default: {
      return state;
    }
  }
};

export default rootReducer;
