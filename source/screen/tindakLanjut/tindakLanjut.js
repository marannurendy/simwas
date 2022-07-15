import react, { useState, useEffect, useMemo } from 'react'
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, StatusBar, Image, TextInput, ActivityIndicator, Alert, FlatList, SafeAreaView } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native'
import db from '../../../config/database';
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PostTindakLanjut } from "../../../config/conf"

import { Header } from '../../assets/layout'

const Dimension = Dimensions.get('window')

const TindakLanjut = () => {
    const Navigation = useNavigation()

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    let [username, setUsername] = useState()
    let [role, setRole] = useState()
    let [Token, setToken] = useState()
    let [datast, setDatast] = useState([])
    let [dt, setDt] = useState([])
    let [isLoaded, setIsLoaded] = useState(false)
    let [DataSync, setDataSync] = useState(0)

    
    const SelectDataSuratTugas = (listSuratTUgas) => (new Promise((resolve, reject) => {
        try{
            db.transaction(
                tx => {
                    tx.executeSql(listSuratTUgas, [], (tx, results) => {
                        let dataLength = results.rows.length
                        var dataList = []
                        for(let a = 0; a < dataLength; a++) {
                            let newData = results.rows.item(a);
                            dataList.push(newData);
                        }

                        // console.log(dataList)
                        resolve (dataList)
                    })
                },function(error) {
                    reject(error)
                }
            )
        } catch( error ) {
            reject(error)
        }
    }))

    useEffect(() => {
        const unsubscribe  = Navigation.addListener('focus', async () => {
            fetchData()
        })
        return unsubscribe
    }, [])

    const fetchData = async () => {
        const syncStatus = await AsyncStorage.getItem('user_data')
        let dt = JSON.parse(syncStatus)

        const token = await AsyncStorage.getItem('token')
        let dttoken = token

        let query = "SELECT DISTINCT * FROM OptionSTCL ORDER BY NoST DESC"
        const data = await SelectDataSuratTugas(query)

        let query1 = "SELECT * FROM ListSiapTL where stat='1' ORDER BY NoST DESC"
        const data1 = await SelectDataSuratTugas(query1)

        setDataSync(data1.length)
        console.log(data)
        
        setRole(dt.role)
        setUsername(dt.username)
        setToken(dttoken)
        setDatast(data)
        setDt(data)

    }

    const SubmitPost = async () => {
        setIsLoaded(true)
        let queryListCekListDraft = "SELECT IdST as idst, IdPertanyaan, tindak_lanjut FROM ListSiapTL where stat='1'"

        const data = await SelectDataSuratTugas(queryListCekListDraft);

        Alert.alert(
            'Info !',
            'Apakah Anda yakin ingin melakukan sync data ?',
            [
                {
                    text: 'Batal'
                },
                {
                    text: 'Ya',
                    onPress: () => {
                        if(data.length > 0 ){
                            fetch(PostTindakLanjut, {
                                method: 'POST',
                                headers: {
                                    Authorization: Token,
                                    Accept:
                                        'application/json',
                                        'Content-Type': 'application/json'
                                    }, 
                                body: JSON.stringify(data)
                            })
                            .then((response) => response.json())
                            .then((responseJSON) => {
                                console.log(responseJSON)
                                if (responseJSON.responseCode === 200) {
                                    const queryDeleteSosialisasiDatabase = "DELETE FROM ListSiapTL";
                                    const querydeletelist = "DELETE FROM OptionSTCL";
                                    db.transaction(
                                        tx => {
                                            tx.executeSql(queryDeleteSosialisasiDatabase, [], (tx, results) => {
                                                if (__DEV__) console.log(`${queryDeleteSosialisasiDatabase} RESPONSE:`, results.rows);
                                            })
                                        }, function(error) {
                                            if (__DEV__) console.log(`${queryDeleteSosialisasiDatabase} ERROR:`, error);
                                        }, function() {}
                                    );
                                    db.transaction(
                                        tx => {
                                            tx.executeSql(querydeletelist, [], (tx, results) => {
                                                if (__DEV__) console.log(`${querydeletelist} RESPONSE:`, results.rows);
                                            })
                                        }, function(error) {
                                            if (__DEV__) console.log(`${querydeletelist} ERROR:`, error);
                                        }, function() {}
                                    );
                                    setIsLoaded(false)  
                                    Alert.alert(  
                                        'Berhasil',  
                                        'Sync Data Berhasil',  
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => {
                                                    Navigation.goBack()
                                                }
                                            }
                                        ]
                                    )
                                    return true;
                                }else{
                                    setIsLoaded(false)
                                    Alert.alert(  
                                        'Gagal!',  
                                        responseJSON?.message || 'Sync Data Tidak Berhasil',  
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => {
                                                    Navigation.goBack()
                                                }
                                            }
                                        ]
                                    )  
                                }
                            })
                        }
                    }
                }
            ]
        )
    }

    const Head = () => {
        return(
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../assets/icon/TindakLanjut-small.png')} />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Input Tindak Lanjut</Text>
                </View>
            </View>
        )
        
    }

    const SyncPost = () => {
        return(
            <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                <TouchableOpacity disabled={DataSync > 0 ? false : true} onPress={() => SubmitPost()} style={{ paddingVertical: 3, width: Dimension.width/3, justifyContent: 'center', borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: DataSync > 0 ? '#0085E5' : '#999' }}>
                    <AntDesign name="sync" size={20} color="#fff" />
                    <Text style={{ color: '#FFF', fontWeight: 'bold', marginVertical:5 }}>{" "}Sync Draft</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const ListBody = () => {
        return(
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    {datast === 'null'}
                    <FlatList 
                        data={datast}
                        keyExtractor={(item, index) => index.toString()}
                        enabledGestureInteraction={true}
                        renderItem={renderCollection}
                    />
                </SafeAreaView>
            </View>
        )
    }

    const renderCollection = ({item}) => (
        <Item data={item} />
    )

    const Item = ({ data }) => (
        <View style={{ marginHorizontal: 10, borderWidth: 1, padding: 5, borderRadius: 10, backgroundColor: '#FFF', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={styles.headDataList}>
                    <Text>No Register</Text>
                    <Text>{data.IdST}</Text>
                </View>
                <View style={styles.headDataList}>
                    <Text>Tanggal Target</Text>
                    <Text>{moment(data.Tgl).format('L')}</Text>
                </View>
                <View style={styles.headDataList}>
                    <Text>Keterangan</Text>
                    <Text>{data.Keterangan}</Text>
                </View>
            </View>

            <View style={{ borderBottomWidth: 1, marginVertical: 5, marginHorizontal: 10 }} />

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Status</Text>
                    <Text>{data.tindak_lanjut != "null" ? 'Sudah Ditindak Lanjut' : 'Belum Ditindak Lanjut'}</Text>
                </View>
            <View style={{ flexDirection: 'row'}}>
                <TouchableOpacity style={{ flex: 3, alignItems: 'center', borderBottomStartRadius: 10, borderTopStartRadius: 10, padding: 5, backgroundColor: '#0085E5' }}
                onPress={() => Navigation.navigate('DetailTindakLanjut', {IdST:data.IdST})}>
                    <Ionicons name='eye' size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    )

    return(
        <View style={{ flex: 1 }}>
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />
            <Header />
            <Head />
            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                <SyncPost />
            </View>
            <ListBody />
            {isLoaded && 
                <View style={styles.loading} >
                    <ActivityIndicator size={'large'} color="#71CDF1" />
                </View>
            }
        </View>
    )
}

export default TindakLanjut

const styles = StyleSheet.create({
    headDataList: {
        alignItems: 'center',
        width: Dimension.width/3.5
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