import react, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput, Dimensions, StyleSheet, StatusBar, ImageBackground, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { showMessage } from "react-native-flash-message"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { VERSION, AUTHLOGIN } from '../../config/conf'

const Dimension = Dimensions.get('window')

const Login = () => {

    const Navigation = useNavigation()

    useState(() => {
        AsyncStorage.getItem('token', (error, result) => {
            if(result != null) {
                Navigation.replace('Home')
            }
          })
    })

    let [username, setUsername] = useState()
    let [password, setPassword] = useState()
    let [secure, setSecure] =useState(true)
    let [loading, setLoading] = useState(false)

    const LoginHandler = () => {

        setLoading(true)

        if(username === '' || username === undefined) {
            setLoading(false)
            flashNotification("Caution !", "Silahkan masukkan Username anda", "#FA8D49", "#fff")
        }else if(password === '' || password === undefined) {
            setLoading(false)
            flashNotification("Caution !", "Silahkan masukkan Password anda", "#FA8D49", "#fff")
        }else{
            try{
                const data = new FormData()

                data.append('username',username)
                data.append('password',password)

                fetch(AUTHLOGIN, {
                    method: 'POST',
                    body: data
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.response === true) {

                        let userData = {
                            kode_unit: responseJson.data.KODE_UNIT,
                            nama: responseJson.data.nama,
                            username: responseJson.data.username,
                            user_id: responseJson.data.user_id,
                            position_name: responseJson.data.position_name,
                            role: responseJson.data.role
                        }

                        console.log(responseJson.token)

                        AsyncStorage.setItem('token', responseJson.token)
                        AsyncStorage.setItem('user_data', JSON.stringify(userData))

                        setLoading(false)
                        Navigation.replace('Home')

                    } else {
                        setLoading(false)
                        flashNotification("Alert !", "Username atau password salah !", "#FF6347", "#fff")
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    flashNotification("Alert !", error.message, "#FF6347", "#fff")
                })
            }catch{
                setLoading(false)
                flashNotification("Caution !", "errror", "#FA8D49", "#fff")
            }
        }
    }

    const flashNotification = (title, message, backgroundColor, color) => {
        showMessage({
            message: title,
            description: message,
            type: "info",
            duration: 3500,
            statusBarHeight: 20,
            backgroundColor: backgroundColor,
            color: color
        });
    }

    return(
        <ScrollView>
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />
            <View style={{ height: Dimension.height, backgroundColor: '#FFF'}}>
                <View style={{ top: 50 }}>
                    <ImageBackground resizeMode='contain' source={require('../assets/image/simwasHead.png')} style={styles.backgroundUmi} />
                </View>
                <View style={ styles.bottomView }>
                    <View style={{ padding: 20, flex: 1 }}>
                        <View>
                            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>SIMWAS</Text>
                            <Text style={{ fontSize: 15 }}>Sistem Monitoring Dan Pengawasan</Text>
                            <View style={{ borderBottomWidth: 1, width: Dimension.width/1.5, marginTop: 5 }} />
                        </View>

                        <View style={{ flex: 1, marginVertical: 20, padding: 20 }}>
                            <View style= {{ marginVertical: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>Username</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{flex: 1}}>
                                        <TextInput 
                                            placeholder='Masukkan Username' 
                                            onChangeText={(text) => setUsername(text)}
                                            style={ styles.inputUsername } />
                                    </View>
                                    <MaterialCommunityIcons name='account-check' size={24} color='black' />
                                </View>
                            </View>
                            <View style= {{ marginVertical: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>Password</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <TextInput 
                                            placeholder='Masukkan Password' 
                                            onChangeText={(text) => setPassword(text)}
                                            style={ styles.inputPassword }
                                            secureTextEntry={secure} />
                                    </View>
                                    <TouchableOpacity onPress={() => setSecure(!secure)}>
                                        <MaterialCommunityIcons name={secure === true ? 'eye-outline' : 'eye-remove-outline'} size={24} color='black' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 60 }}>
                                <TouchableOpacity onPress={() => LoginHandler()}>
                                    <View style={{paddingHorizontal: 30, paddingVertical: 5, borderRadius: 10, backgroundColor: '#0085E5'}}>
                                        <Text style={{ fontWeight: 'bold', color: '#FFF', fontSize: 16 }}>LOGIN</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ backgroundColor: '#FFF', borderLeftWidth: 4, borderRightWidth: 4}}>
                <Text style={{ paddingHorizontal: 10, alignSelf: 'center' }} >{VERSION}</Text>
            </View>

            {loading && 
                <View style={styles.loading} >
                    <ActivityIndicator size={'large'} color="#71CDF1" />
                </View>
            }

        </ScrollView>
    )
}

export default Login

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        borderWidth: 1,
        justifyContent: 'center'
    },
    backgroundUmi: {
        width: "100%",
        height: "100%",
        height: Dimension.height/2.5, 
        width: Dimension.width
    },
    bottomView: {
        flex: 1,
        // borderWidth: 4,
        backgroundColor: '#FFF',
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        borderRightWidth: 4,
        borderLeftWidth: 4,
        borderTopWidth: 4
    },
    inputUsername: {
        paddingHorizontal: 5,
        fontSize: 15,
        color: "black",
        fontWeight: 'bold',
        borderBottomWidth: 1
    },
    inputPassword: {
        paddingHorizontal: 5,
        fontSize: 15,
        color: "black",
        fontWeight: 'bold',
        borderBottomWidth: 1
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    }
})