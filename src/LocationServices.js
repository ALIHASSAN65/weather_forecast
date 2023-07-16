import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {c_w_api_ur, f_w_api_ur} from './Constant';
import {Linking, PermissionsAndroid} from 'react-native';

export const RequestPermission = async setData => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    callGeolocation(setData);
  }
};
export const permissionStatus = async setData => {
  if (Platform.OS === 'android') RequestPermission(setData);

  if (Platform.OS === 'ios')
    check(
      PERMISSIONS.IOS.LOCATION_ALWAYS || PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    )
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            alert('Location Feature Is Not Available On This Device');
            break;
          case RESULTS.DENIED:
            Geolocation.requestAuthorization('always').then(res =>
              callGeolocation(setData),
            );
            break;
          case RESULTS.LIMITED:
            Alert.alert(
              'Permission Limited',
              'Please Allow Location Permission to check your weather',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Open',
                  onPress: () => {
                    Linking.openSettings();
                  },
                },
              ],
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');

            callGeolocation(setData);
            break;
          case RESULTS.BLOCKED:
            Alert.alert(
              'Permission Denied',
              'Please Allow Location Permission to check your weather.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Open',
                  onPress: () => {
                    Linking.openSettings();
                  },
                },
              ],
            );
            break;
        }
      })
      .catch(error => {
        console.log('error=>', error);
        alert(error);
      });
};
export const callGeolocation = setData => {
  Geolocation.getCurrentPosition(
    position => {
      fetchData(position.coords.latitude, position.coords.longitude, setData);
    },
    error => {
      console.log(error);
      alert('Unable to get your location');
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
};
export const fetchData = async (lat, lng, setData, search = '', c = true) => {
  let q, url;
  if (search.length > 0) q = search;
  else q = `${lat}, ${lng}`;
  if (c) url = c_w_api_ur + q;
  else url = f_w_api_ur + q;
  await fetch(url)
    .then(res => res.json())
    .then(result => {
      if (result.error) alert(result?.error?.message);
      else setData(result);
    })
    .catch(err => {
      console.log('err=>', err);
      alert(err);
    });
};
