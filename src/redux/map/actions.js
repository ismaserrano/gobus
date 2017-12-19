/**
 * Recipe Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { Firebase, FirebaseRef } from '@constants/';

/**
  * Get this User's Favourite Lines
  */
  export function getFavourites(dispatch) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
  
    const UID = Firebase.auth().currentUser.uid;
    if (!UID) return false;
  
    const ref = FirebaseRef.child(`favourites/${UID}`);
  
    return ref.on('value', (snapshot) => {
      const favs = snapshot.val() || [];
  
      return dispatch({
        type: 'FAVOURITES_REPLACE',
        data: favs,
      });
    });
  }

/**
  * Get Lines
  */
  export function getMapLines() {
    if (Firebase === null) return () => new Promise(resolve => resolve());
  
    return dispatch => new Firebase.Promise((resolve) => {
      const ref = FirebaseRef.child('maplines');
  
      return ref.once('value', (snapshot) => {
        const mapLines = snapshot.val() || {};
  
        return resolve(dispatch({
          type: 'LINES_MAP_REPLACE',
          data: mapLines,
        }));
      });
    });
  }

  /**
  * Get concrete Line
  */
  export function getMapLineStops(line) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
  
    return dispatch => new Firebase.Promise((resolve) => {
      let ref = FirebaseRef.child(`stops/${line}`);
      if (!line) {
        ref = FirebaseRef.child('stops');
      }
  
      return ref.once('value', function(snapshot) {
        let mapLineStops = snapshot.val() || {};

        // 37112121818633
        // mapLineStops.map((element, index) => {
        //   let linkModified = element.link.split("&Altura=");
        //   mapLineStops[index].link = linkModified[0]+"&Altura=37112121818633&Zoom=";
        // });
  
        return resolve(dispatch({
          type: 'LINE_STOP_MAP_REPLACE',
          data: mapLineStops,
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


  export function loadStop(stop) {
    if (stop) {
      if (stop.id) {
        return ({
          type: 'LOAD_STOP',
          data: stop,
        });
      } else {
        if (Firebase === null) return () => new Promise(resolve => resolve());
      
        return dispatch => new Firebase.Promise((resolve) => {
          const ref = FirebaseRef.child('stops');
          
          let founded = false;
          let promise = new Promise((res, rej) => {
            ref.once('value', function(snapshotStop){
              snapshotStop.forEach(function(snapVal, key){
                let line = snapVal.val();
                line.map(function(stopLine, indexLine){
                  let stopId = stopLine.id;
                  if (stop == stopId) {
                    res(stopLine);
                    founded = true;
                    return;
                  }
                });
                if (founded) {
                  return;
                }
              });
              res(false);
            });
          });

          promise.then((response) => {
            return resolve(dispatch({
              type: 'LOAD_STOP',
              data: response,
            }));
          });
        });
      }
    } else {
      return ({
        type: 'LOAD_STOP',
        data: null,
      });
    }
  }
