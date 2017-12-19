/**
 * Recipe Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { Firebase, FirebaseRef } from '@constants/';
import { AsyncStorage } from 'react-native';

/**
  * Get this User's Favourite Lines
  */
  export function getFavouritesFav(favsArg) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
  
    return dispatch => new Firebase.Promise((resolve) => {
      const UID = Firebase.auth().currentUser.uid;
      if (!UID) return false;

      if (!favsArg) return resolve(dispatch({
        type: 'FAVOURITES_FAV_REPLACE',
        data: false,
      }));;
    
      const ref = FirebaseRef.child('stops');

      let dataStops = [];
      let added = [];
      let promise = new Promise((res, rej) => {
        ref.once('value', function(snapshotStop){
          snapshotStop.forEach(function(snapVal, key){
            let line = snapVal.val();
            line.map(function(stop, index){
              let stopId = stop.id;
              if (favsArg.indexOf(stopId) > -1 && added.indexOf(stopId) <= -1) {
                dataStops.push(stop);
                added.push(stopId);
                if (favsArg.length == dataStops.length) {
                  res(dataStops);
                }
              }
            });
          });
        });
      });

      promise.then((response) => {
        return resolve(dispatch({
          type: 'FAVOURITES_FAV_REPLACE',
          data: response,
        }));
      });
    
      // return ref.on('value', (snapshot) => {
      //   const favs = snapshot.val() || [];

      //   // const stopsRef = FirebaseRef.child('stops');

      //   // var promises = favs.map(function(key) {
      //   //   // return FirebaseRef.child(`stops/${key}`).once("value");
      //   //   return FirebaseRef.child('stops').child(key).once("value");
      //   // });
      //   // Promise.all(promises).then(function(snapshots) {
      //   //   snapshots.forEach(function(snapshot) {
      //   //     console.log(snapshot.key+": "+snapshot.val());
      //   //   });
      //   // });
    
      //   // return resolve(dispatch({
      //   //   type: 'FAVOURITES_REPLACE',
      //   //   data: favs,
      //   // }));
      // });
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

