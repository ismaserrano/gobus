/**
 * Recipe Reducer
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
// import Store from './store';

// Set initial state
export const initialState = {};

export default function favouritesReducer(state = initialState, action) {
  switch (action.type) {
    case 'FAVOURITES_FAV_REPLACE': {
      return {
        ...state,
        favourites: action.data || [],
      };
    }
    break;
    default:
      return state;
  }
}
