//import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

//services
import {http_s} from '../Constant';
import {fetchData, permissionStatus} from '../LocationServices';
import {navigate} from '../NavigationService';

// create a component
const Home = ({route: {params}}) => {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');

  //will call everytime when screen focused or params change
  useFocusEffect(
    React.useCallback(() => {
      setSearch(params?.city);
      check();
    }, [params]),
  );
  // to get the weather data
  const check = async () => {
    Keyboard.dismiss();
    //if something is written in input then will search that otherwise search the current location

    if (search?.trim().length > 0) await fetchData(0, 0, setData, search);
    else permissionStatus(setData);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="search"
          onChangeText={setSearch}
          style={styles.input}
          value={search}
        />
        <TouchableOpacity onPress={check} style={styles.btn}>
          <Text style={styles.btnText}>Check</Text>
        </TouchableOpacity>
      </View>
      <Text numberOfLines={1} style={styles.city}>
        {data?.location.name}
      </Text>
      <View style={styles.weatherContainer}>
        <Image
          style={styles.icon}
          source={{uri: http_s + data?.current.condition.icon}}
        />
        <Text style={styles.temp_c}>{data?.current.temp_c || '-'}</Text>
        <View style={styles.degree} />
      </View>
      <Text style={styles.condition}>{data?.current.condition.text}</Text>
      <View style={styles.bottomContainer}>
        <Text style={styles.bHText}>Wind</Text>
        <Text style={styles.bHText}>Humidity</Text>
        <Text style={styles.bHText}>Feels</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.bText}>{data?.current.wind_mph}/mph</Text>
        <Text style={styles.bText}>{data?.current.humidity}</Text>
        <Text style={styles.bText}>{data?.current.feelslike_c}/c</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigate('Forecast', {city: data?.location.name})}
        style={styles.btnF}>
        <Text style={styles.btnText}>Move to Forecast</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6e8e6',
  },
  header: {
    flexDirection: 'row',
    marginTop: '5%',
    marginBottom: '20%',
    height: 45,
  },
  input: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
    width: '70%',
    height: '100%',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    height: '100%',
    backgroundColor: 'grey',
    borderRadius: 5,
  },

  btnF: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20%',
    width: '80%',
    height: 45,
    backgroundColor: 'grey',
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  city: {
    fontSize: 38,
    width: '90%',
    textAlign: 'center',
    color: '#000',
  },
  weatherContainer: {
    flexDirection: 'row',
    margin: '5%',
  },
  icon: {
    width: 50,
    height: 50,
    alignSelf: 'flex-end',
  },
  degree: {
    width: 20,
    height: 20,
    borderColor: '#000',
    borderWidth: 5,
    borderRadius: 10,
  },
  temp_c: {
    fontSize: 98,
    fontWeight: 'bold',
    color: '#000',
  },
  condition: {
    fontSize: 14,
    marginBottom: '10%',
    color: '#000',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
  },
  bHText: {
    width: '33%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  bText: {
    width: '33%',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
    color: '#000',
  },
});

//make this component available to the app
export default Home;
