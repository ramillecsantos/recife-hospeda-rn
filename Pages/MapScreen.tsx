import { useEffect, useState } from "react"
import { View, Text, TextInput, Dimensions, StyleSheet } from "react-native";
import MapView, { Callout, Marker, Region, } from "react-native-maps";

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    map: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    },
  });

export default function MapScreen({route}: any) {
    const [region, setRegion] = useState<Region>();
    useEffect(() => {
    setRegion({
        latitude: route.params.latitude,
        longitude: route.params.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
        });
    }, [])
    
    return (
        <View>
            <MapView
                style={styles.map}
                region={region}
                initialRegion={region} 
                >
                <Marker
                    coordinate={{
                        latitude: Number(route.params.latitude),
                        longitude: Number(route.params.longitude),
                    }}
                >
                </Marker>
            </MapView>
        </View>
    )
}