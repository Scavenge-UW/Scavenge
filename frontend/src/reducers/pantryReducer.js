import { FETCH_PANTRIES } from '../actions/types';

const initalState = {
  pantries: {}
}

export default (state = initalState, action) => {
  const { type, payload } = action;

  switch(type) {
    case FETCH_PANTRIES:
      return {
        ...state,
        pantries: payload
      };
    default:
      return state;
  }
}