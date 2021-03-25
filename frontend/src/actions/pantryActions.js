import { FETCH_PANTRIES } from './types';

import PantryService from '../services/pantry.service';

// Exports a function with a parameter called dispatch
export const fetchPantries = () => dispatch => {
  PantryService.getPantries()
    .then(pantries => dispatch({
      type: FETCH_PANTRIES,
      payload: pantries
    }));
}