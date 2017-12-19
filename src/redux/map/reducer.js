/**
 * Recipe Reducer
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
// import Store from './store';

// Set initial state
export const initialState = {};

export default function mapReducer(state = initialState, action) {
  switch (action.type) {
    case 'FAVOURITES_REPLACE': {
      return {
        ...state,
        favourites: action.data || [],
      };
    }
    break;
    case 'LOAD_STOP': {
      return {
        ...state,
        stopToLoad: action.data || null,
      };
    }
    break;
    case 'LINES_MAP_REPLACE': {
      let mapLines = [];

      // Pick out the props I need
      if (action.data && typeof action.data === 'object') {
        mapLines = action.data.map(item => ({
          title: item.title,
          children: item.children
        }));
      }

      return {
        ...state,
        mapLines,
      };
    }
    break;
    case 'LINE_STOP_MAP_REPLACE': {
      // let mapLineStops = [];
      let mapLineStops = (action.data && typeof action.data === 'object') ? action.data : [];

      // Pick out the props I need
      // if (action.data && typeof action.data === 'object') {
      //   mapLineStops = action.data.map(item => ({
      //     id: item.id,
      //     title: item.title,
      //     latitude: item.latitude,
      //     longitude: item.longitude,
      //     link: item.link,
      //     numStop: item.numStop
      //   }));
      // }

      return {
        ...state,
        mapLineStops,
      };
    }
    break;
    default:
      return state;
  }
}
