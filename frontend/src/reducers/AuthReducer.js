import { EDIT_PROFILE } from '../actions/types';

const initialState = {
    item:{}
}

export default function(state = initialState, action) {
    switch (action.type) {
      case EDIT_PROFILE:
        return {
          ...state,
          item: action.payload
        };
      default:
        return state;
    }
  }