/**
 * Recipe Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { Firebase, FirebaseRef } from '@constants/';
import { AsyncStorage } from 'react-native';

/**
  * Get Lines
  */
export function getLines() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Firebase.Promise((resolve) => {
    const ref = FirebaseRef.child('lines');

    return ref.on('value', (snapshot) => {
      const lines = snapshot.val() || {};

      return resolve(dispatch({
        type: 'LINES_REPLACE',
        data: lines,
      }));
    });
  });
}

/**
  * Get Lines
  */
  export function getMapLines() {
    if (Firebase === null) return () => new Promise(resolve => resolve());
  
    return dispatch => new Firebase.Promise((resolve) => {
      const ref = FirebaseRef.child('lines');
  
      return ref.on('value', (snapshot) => {
        const lines = snapshot.val() || {};
  
        return resolve(dispatch({
          type: 'LINES_MAP_REPLACE',
          data: lines,
        }));
      });
    });
  }

/**
  * Reset a User's Favourite Lines in Redux (eg for logou)
  */
  export function resetFavourites(dispatch) {
    return dispatch({
      type: 'FAVOURITES_REPLACE',
      data: [],
    });
  }
  
  /**
    * Update My Favourites Lines
    */
  export function replaceFavourites(newFavourites) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
  
    const UID = Firebase.auth().currentUser.uid;
    if (!UID) return false;
  
    return () => FirebaseRef.child(`favourites/${UID}`).set(newFavourites);
  }

  