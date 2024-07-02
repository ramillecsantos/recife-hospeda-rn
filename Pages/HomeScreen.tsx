import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, SafeAreaView, StatusBar, ViewProps, TextInput, ActivityIndicator, FlatList, Linking } from 'react-native';
import filter from "lodash.filter";
import * as Location from 'expo-location';


export default function HomeScreen({ navigation }: any) {
    const API_HOTEIS = 'http://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=0d8fb090-2863-4d51-9b21-baae4bae5a11';

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<string[]>([]);
    const [haserror, setHasError] = useState(false);
    const [fullData, setFullData] = useState([]);
    const [searchQuery, setsearchQuery] = useState("");
  
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
  
    useEffect(() => {
      (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      })();
    }, []);
        
    const toRadians = (degrees: number): number => {
      return degrees * (Math.PI / 180);
    };
    
    const calculateDistance = (coord1: any, coord2: any): number => {
      const R = 6371e3;
    
      const lat1 = toRadians(coord1.latitude);
      const lat2 = toRadians(coord2.latitude);
      const deltaLat = toRadians(coord2.latitude - coord1.latitude);
      const deltaLon = toRadians(coord2.longitude - coord1.longitude);
    
      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
      const distance = R * c;
    
      return distance / 1000;
    };
  
    useEffect (() => {
      setIsLoading(true);
      fetchData(API_HOTEIS);
    }, []);
  
    const fetchData = async(url: string) => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json.result.records);
    
        setFullData(json.result.records)
        setIsLoading(false);
      } catch(haserror) {
        setHasError(true);
        console.log(haserror);
      }
    }
  
    const handleSearch = (query: any) => {
      setsearchQuery(query);
      const formattedQuery = query.toLowerCase();
      const filteredData = filter(fullData, (nome: string) => {
        return contains(nome, formattedQuery);
      });
      setData(filteredData);
    }
  
    const contains = ({nome, telefone, site}: any, query: string) => {
      
      if( nome.includes(query) || telefone.includes(query) || site.includes(query) ) {
        return true;
      }
      return false;
    };
  
    if (isLoading) {
      return(
        <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color= "#48B" />
        </View>
      );
    }
  
    if (haserror) {
      return(
        <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
        <Text>Aconteceu algum problema na busca de hospedagens em Recife... Verifique sua conexão!</Text>
        </View>
      );
    }
return (
      <View style={styles.content}>
        <View>
          <Text style={{textAlign: 'center', fontFamily: 'Rounded', fontWeight: 'bold', color: '#48B'}}>RECIFE HOSPEDA</Text>
          <Text style={{textAlign: 'center', fontFamily: 'Rounded'}}>Aqui você encontra os melhores hotéis de Recife!</Text>
        </View>
        <TextInput 
        placeholder='Buscar' 
        clearButtonMode='always' 
        style={styles.searchBox}
        autoCapitalize='none'
        autoCorrect={false}
        value={searchQuery}
        onChangeText={(query) => handleSearch(query)}
        />
        <FlatList 
          data={data}
          keyExtractor={(item: any) => item._id}
          style={styles.list}
          renderItem={({item}: any) => (
            <TouchableOpacity style={styles.itemList} onPress={() => navigation.navigate('Maps', {latitude: item.latitude, longitude: item.longitude})}>
              <Text style={styles.itemNome}>{item.nome}</Text>
              <Text style={styles.itemTelefone}>{item.telefone}</Text>
              <Text style={styles.itemSite}
                onPress={() => {
                  Linking.openURL(`https://${item.site}`)
                }}
              >{item.site}</Text>
              <Text style={{color: 'grey'}}>a { Math.round(calculateDistance({latitude, longitude}, {latitude: item.latitude, longitude: item.longitude})) }km de distância</Text>
            </TouchableOpacity>
            )}
        />
      </View>
    )
}


const styles = StyleSheet.create({
  list:{
    marginTop: 10,
  },
  itemList: {
    alignItems: 'flex-start',
    marginLeft: 10,
    marginTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 0.2, 
    borderColor: 'grey',
  },
  itemNome: {
    fontSize: 17,
    fontWeight:'600',
  },
  itemTelefone: {
    fontSize: 14,
    color:'grey',
    fontWeight: 'bold',
  },
  itemSite: {
    color:'blue',
    textDecorationLine: 'underline'
  },
  searchBox: {
    marginTop: 20,
    paddingHorizontal:20,
    paddingVertical:10, 
    borderColor:'#ccc', 
    borderWidth:1, 
    borderRadius:8
  },
  content: {
    flex: 1,
    padding:10,
    paddingTop:40,
    backgroundColor: '#FFFFFF',
  },
});