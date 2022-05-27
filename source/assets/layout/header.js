import react, { useState, useEffect } from 'react'
import { View, Text, StatusBar, StyleSheet, Dimensions, ImageBackground, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Dimension = Dimensions.get('window')

const Header = () => {

    const Navigation = useNavigation()

    let [kodeUnit, setKodeUnit] = useState()
    let [nama, setNama] = useState()
    let [username, setUsername] = useState()
    let [userid, setUserid] = useState()
    let [positionName, setPositionName] = useState()
    let [role, setRole] = useState()

    useEffect(() => {
        const unsubscribe = Navigation.addListener('focus', async () => {
            const syncStatus = await AsyncStorage.getItem('user_data')
            let data = JSON.parse(syncStatus)
            setKodeUnit(data.kode_unit)
            setNama(data.nama)
            setUsername(data.username)
            setUserid(data.user_id)
            setPositionName(data.position_name)
            setRole(data.role)
        })
        return unsubscribe;
    })

    const Route = useRoute()

    return(
        <View style={styles.container}>
            <View style={{ paddingTop: StatusBar.currentHeight }} >
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ height:35, width: Dimension.width/4, marginBottom: 10 }}>
                            <ImageBackground resizeMode='contain' source={require('../image/pnm.png')} style={styles.backgroundUmi} />
                        </View>
                        {Route.name == 'Front Home' ? (
                            <TouchableOpacity onPress={() => Navigation.openDrawer()}>
                                <View style={{ marginRight: 10 }}>
                                    <MaterialCommunityIcons name='menu' size={25} color="black" />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View></View>
                        )}
                    </View>
                    <View style={{ marginHorizontal: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{nama}</Text>
                            <Text>{username} - {positionName}</Text>
                            <Text>{kodeUnit}</Text>
                        </View>
                        {Route.name == 'Front Home' ? (
                        <View></View>) : 
                        (
                            <TouchableOpacity style={{ alignSelf: 'flex-end'}} onPress={() => Navigation.goBack()} >
                                <MaterialCommunityIcons name='arrow-left' size={24} color="black" />
                            </TouchableOpacity>
                        )}
                        
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
    },
    backgroundUmi: {
        width: "100%",
        height: "100%",
    }
})