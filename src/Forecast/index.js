//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

//services
import {http_s} from '../Constant';
import {fetchData} from '../LocationServices';
import {navigate} from '../NavigationService';

// create a component
const Home = ({route: {params}}) => {
  const [data, setData] = useState(null);
  const [search] = useState(params?.city);

  //will call everytime when screen focused
  useFocusEffect(
    React.useCallback(() => {
      fetchData(0, 0, setData, search, false);
    }, [params]),
  );

  //flatlist item to render the weather list
  const renderItem = ({item}) => (
    <View style={styles.item}>
      <View style={styles.weatherContainer}>
        <Image
          style={styles.icon}
          source={{uri: http_s + item.day.condition.icon}}
        />
        <Text style={styles.temp_c}>{item.day.maxtemp_c || '-'}</Text>
        <View style={styles.degree} />
      </View>
      <Text style={styles.condition}>{item.day.condition.text}</Text>
      <View style={styles.bottomContainer}>
        <Text style={styles.bHText}>Wind</Text>
        <Text style={styles.bHText}>Humidity</Text>
        <Text style={styles.bHText}>Date</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.bText}>{item.day.maxwind_mph}/mph</Text>
        <Text style={styles.bText}>{item.day.avghumidity}</Text>
        <Text style={styles.bText}>{item.date}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.city}>
        {data?.location.name} Forecast
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data?.forecast?.forecastday}
        renderItem={renderItem}
      />
      <TouchableOpacity
        onPress={() => navigate('Home', {city: search})}
        style={styles.btnF}>
        <Text style={styles.btnText}>Back to Home</Text>
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
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    padding: 15,
    borderRadius: 5,
    borderColor: 'grey',
    marginTop: 5,
  },
  btnF: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
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
    fontSize: 28,
    width: '90%',
    textAlign: 'center',
    color: '#000',
    margin: 5,
  },
  weatherContainer: {
    flexDirection: 'row',
    margin: '1%',
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
    fontSize: 58,
    fontWeight: 'bold',
    color: '#000',
  },
  condition: {
    fontSize: 14,
    marginBottom: '1%',
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
