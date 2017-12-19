/**
 * Recipe Reducer
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
// import Store from './store';

// Set initial state
export const initialState = {};

export default function lineReducer(state = initialState, action) {
  switch (action.type) {
    case 'FAVOURITES_REPLACE': {
      return {
        ...state,
        favourites: action.data || [],
      };
    }
    break;
    case 'LINES_REPLACE': {
      let lines = [];

      // Pick out the props I need
      if (action.data && typeof action.data === 'object') {
        lines = action.data.map(item => ({
          id: item.id,
          title: item.title,
          code: item.code,
          single: item.single,
          back: item.back,
          image: item.image
        }));
      }

      return {
        ...state,
        lines,
      };
    }
    break;
    default:
      return state;
  }
}
