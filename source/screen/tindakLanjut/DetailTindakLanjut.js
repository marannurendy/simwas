import react, { useState, useEffect, useMemo } from 'react'
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, StatusBar, ToastAndroid, TextInput, ActivityIndicator, Alert, FlatList, SafeAreaView } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native'
import db from '../../../config/database';
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PostSuratTugas } from "../../../config/conf"

import { Header } from '../../assets/layout'

const Dimension = Dimensions.get('window')

const DetailTindakLanjut = ({route}) => {
    const Navigation = useNavigation()

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Ya', value: '1'},
        {label: 'Tidak', value: '0'}
    ])

    let [username, setUsername] = useState()
    let [role, setRole] = useState()
    let [Token, setToken] = useState()
    let [datast, setDatast] = useState([])
    let [dt, setDt] = useState([])
    let [isLoaded, setIsLoaded] = useState(false)

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

    const handleInputChangeDropdownST = async (value, index, i) => {
        let draft = [...datast]
        const indexx = draft.findIndex(object => {
            return object.IdPertanyaan == index.IdPertanyaan;
        });
        index.tindak_lanjut = value
        index.stat = "1"
        draft[indexx] = index
        setDatast(draft)
    };

    useEffect(() => {
        const unsubscribe  = Navigation.addListener('focus', async () => {
            fetchData()
        })
        return unsubscribe
    }, [datast])

    const fetchData = async () => {
        const syncStatus = await AsyncStorage.getItem('user_data')
        let dt = JSON.parse(syncStatus)

        const token = await AsyncStorage.getItem('token')
        let dttoken = token
        
        let query = "SELECT A.*, B.Pertanyaan, C.Nama_Sub_Kategori FROM ListSiapTL A  "+
                    "Left Join Pertanyaan B on A.IdPertanyaan = B.IdPertanyaan "+
                    "Left Join SubKategori C on B.IdSubKategori = C.IdSubKategori "+
                    "where IdST = "+route.params.IdST+""
        const data = await SelectDataSuratTugas(query)

        setRole(dt.role)
        setUsername(dt.username)
        setToken(dttoken)
        setDatast(data)
        setDt(data)

    }

    const ButtonSUbmit = () => {
        return(
            <View style={{ marginVertical: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 50 }}>
                    <TouchableOpacity onPress={() => SubmitDraft()} style={{ flex: 3, alignItems: 'center', padding:10, borderBottomEndRadius: 10, borderTopEndRadius: 10, backgroundColor: '#0085E5' }}>
                        <Text style={{ fontWeight: 'bold', color: '#FFF' }}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const SubmitDraft = async () => {
        try{
            if(datast.length > 0){
                for(let a = 0; a < datast.length; a++) {
                    let query = "UPDATE ListSiapTL SET tindak_lanjut = " + datast[a].tindak_lanjut + ", stat='1' WHERE IdPertanyaan = " + datast[a].IdPertanyaan + "";
                    db.transaction(
                        tx => {
                            tx.executeSql(query)
                        }, function(error) {
                            alert(error)
                        }
                    )
                }
                ToastAndroid.show("Save draft berhasil!", ToastAndroid.SHORT);
                Navigation.replace("Home")
            }
        }
        catch(error){
            alert(error)
        }
    }

    const Head = () => {
        return(
            <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Detail Tindak Lanjut</Text>
                </View>
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
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal:10, marginVertical:10}}>
                <Text>Sub Kategori</Text>
                <Text>{data.Nama_Sub_Kategori}</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal:10, marginVertical:10}}>
                <Text>Pertanyaan</Text>
                <Text>{data.Pertanyaan}</Text>
            </View>
            <View style={{ borderBottomWidth: 1, marginVertical: 5, marginHorizontal: 10 }} />

            <View style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical:5,justifyContent: 'space-between', alignItems: 'center' } }>
            <Text>Tindak Lanjut</Text>
            <View
                style={{
                    width: Dimension.width / 2,
                    color: "#333",
                    fontWeight: "bold",
                    borderRadius: 3,
                    borderWidth: 1,
                }}
            >
                    <Picker
                        selectedValue={data.tindak_lanjut}
                        onValueChange={(itemValue, itemIndex) => {
                            handleInputChangeDropdownST(itemValue, data, itemIndex);
                        }}
                    >
                        <Picker.Item key={"-1"} label={"-- Pilih --"} value={null} />
                        {items.length > 0 &&
                        items.map((x, i) => (
                            <Picker.Item key={i} label={x.label} value={x.value} />
                        ))}
                    </Picker>
                </View>
            </View>
        </View>
    )

    return(
        <View style={{ flex: 1 }}>
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />
            <Header />
            <Head />
            <ListBody />
            <ButtonSUbmit />
            {isLoaded && 
                <View style={styles.loading} >
                    <ActivityIndicator size={'large'} color="#71CDF1" />
                </View>
            }
        </View>
    )
}

export default DetailTindakLanjut

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