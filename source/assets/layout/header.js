import react, { useState, useEffect } from 'react'
import { View, Text, StatusBar, StyleSheet, Dimensions, ImageBackground, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

const Dimension = Dimensions.get('window')

const Header = () => {

    const Navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = Navigation.addListener('focus', async () => {
            console.log(Route.name)
        })

        return unsubscribe;
    })

    const Route = useRoute()

    return(
        <View style={styles.container}>
            <View style={{ paddingTop: StatusBar.currentHeight }} >
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ height:35, width: Dimension.width/4, marginBottom: 15 }}>
                            <ImageBackground resizeMode='contain' source={require('../image/pnm.png')} style={styles.backgroundUmi} />
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <MaterialCommunityIcons name='menu' size={25} color="black" />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text>USER TEST 1</Text>
                            <Text>USERNAME01 - KEPALA AREA</Text>
                            <Text>AREA TEST</Text>
                        </View>
                        {Route.name == 'Home' ? (
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