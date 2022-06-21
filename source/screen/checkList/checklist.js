import react, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, StatusBar, TextInput, ActivityIndicator, FlatList, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment'

import db from '../../../config/database';

import { Header } from '../../assets/layout';

const Dimension = Dimensions.get('window')

const Checklist = () => {

    const Navigation = useNavigation()

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: '2022', value: '2022'},
        {label: '2021', value: '2021'}
    ])

    let [role, setRole] = useState()
    let [loading, setLoading] = useState(false)

    let [data, setData] = useState([])
    let [dt, setDt] = useState([])

    useEffect(() => {
        const unsubscribe = Navigation.addListener('focus', async () => {
            fetchData()
        })
        return unsubscribe
    })

    const fetchData = async () => {
        setLoading(true)
        const userdt = await AsyncStorage.getItem('user_data')
        let dt = JSON.parse(userdt)

        let query = "SELECT DISTINCT * FROM ListChecklist WHERE "
        if (dt.role === 'KA') {
            query = query + "type = '0' AND syncBy = '" + dt.username + "'"
        } else if (dt.role === 'KC') {
            query = query + "type = '1' AND syncBy = '" + dt.username + "'"
        } else if (dt.role === 'RPM') {
            query = query + "type = '2' AND syncBy = '" + dt.username + "'"
        } else if (dt.role === 'PPM') {
            query = query + "type = '3' AND syncBy = '" + dt.username + "'"
        }
        query = query + ' ORDER BY NoST DESC'

        console.log(query)
        setRole(dt.role)

        const data = await SelectDataListChecklist(query)

        if(data === 'SUCCESS') {
            setLoading(false)
        }else if(data === 'ERROR'){
            setLoading(false)
            alert('error load data')
        }
    }

    const SelectDataListChecklist = (query) => (new Promise((resolve, reject) => {
        try{
            db.transaction(
                tx => {
                    tx.executeSql(query, [], (tx, results) => {
                        let dataLength = results.rows.length
                        let arr = []

                        for(let a = 0; a < dataLength; a++) {
                            let newData = results.rows.item(a)
                            arr.push(newData)
                        }

                        console.log(arr)
                        setData(arr)
                        setDt(arr)
                        resolve('SUCCESS')
                    })
                }, function(error) {
                    reject('ERROR')
                }
            )
        }catch(error){
            reject('ERROR')
        }
    }))

    const Head = () => {
        return(
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../assets/icon/Checklist-small.png')} />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Data Pemeriksaan</Text>
                </View>
            </View>
        )
    }

    const AddSuratTugasButton = () => {
        return(
            <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                <TouchableOpacity onPress={() => Navigation.navigate('InputChecklist')} style={{ paddingVertical: 3, width: Dimension.width/2, justifyContent: 'center', borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0085E5' }}>
                    <Ionicons name="add" size={24} color="#FFF" />
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Data Pemeriksaan</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const ListBody = () => {
        return(
            <View style={{ flex: 1 }}>
                {loading && 
                    <View style={styles.loading} >
                        <ActivityIndicator size={'large'} color="#0085E5" />
                    </View>
                }
                <SafeAreaView style={{ flex: 1 }}>
                    {data === 'null'}
                    <FlatList 
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        enabledGestureInteraction={true}
                        renderItem={RenderList}
                    />
                </SafeAreaView>
            </View>
        )
    }

    const RenderList = ({item}) => (
        <Item data={item} />
    )

    const Item = ({ data }) => (
        <View style={{ marginHorizontal: 10, borderWidth: 1, padding: 5, borderRadius: 10, backgroundColor: '#FFF', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={styles.headDataList}>
                    <Text>No ST</Text>
                    <Text>{data.NoST}</Text>
                </View>
                <View style={styles.headDataList}>
                    <Text>Tanggal Awal</Text>
                    <Text>{moment(data.tglMulai).format('L')}</Text>
                </View>
                <View style={styles.headDataList}>
                    <Text>Tanggal Akhir</Text>
                    <Text>{moment(data.tglSelesai).format('L')}</Text>
                </View>
            </View>

            <View style={{ borderBottomWidth: 1, marginVertical: 5, marginHorizontal: 10 }} />

            <View style={{ marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                        <Text style={{ fontWeight: 'bold' }}>Status</Text>
                    </View>
                    <View style={{ flex: 4 }}>
                        <Text>: {data.Approval_Flag === '1' ? 'Disetujui' : 'Belum Disetujui'}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                        <Text style={{ fontWeight: 'bold' }}>Cabang</Text>
                    </View>
                    <View style={{ flex: 4 }}>
                        <Text numberOfLines={1}>: {data.Cabang + ' - ' + data.Keterangan}</Text>
                    </View>
                </View>
            </View>

            <View style={{ borderBottomWidth: 1, marginVertical: 5, marginHorizontal: 10 }} />

            <View style={{ flexDirection: 'row'}}>
                <TouchableOpacity style={{ flex: 3, alignItems: 'center', borderBottomStartRadius: 10, borderTopStartRadius: 10, padding: 5, backgroundColor: '#0085E5' }}>
                    <Ionicons name='eye' size={20} color="#FFF" />
                </TouchableOpacity>
                {data.Approval_Flag === '1' ? (
                    <View></View>
                ) : (
                    <TouchableOpacity onPress={() => Navigation.navigate('EditSuratTugas', {register : data.No})} style={{ flex: 3, alignItems: 'center', borderBottomEndRadius: 10, borderTopEndRadius: 10, padding: 5, backgroundColor: '#41BA90' }}>
                        <Ionicons name='pencil' size={20} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )

    const searchHandler = (value, data) => {
        let newData = []

        if (value) {
            newData = data.filter(function(item) {
                const itemData = item.No.toUpperCase();
                const textData = value.toUpperCase();
                return itemData.includes(textData);
            })
            setData([...newData]);
        } else {
            setData([...dt]);
        }
    }

    return(
        <View style={{ flex: 1 }}>
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />
            <Header />
            <Head />
            <AddSuratTugasButton />
            <View>
                <View style={{ marginHorizontal: 10 }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' } }>
                        <View style={{ marginRight: 20 }}>
                            <Text style={{ fontWeight: 'bold' }}>Search</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                placeholder='Masukkan Nomor Surat Tugas'
                                style={{ borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#FFF' }}
                                onChangeText={(value) => {
                                    searchHandler(value, data)
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ borderBottomWidth: 0.5, marginTop: 10, marginBottom: 10 }} />

                </View>
            </View>
            <ListBody />
        </View>
    )
}

export default Checklist

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
        justifyContent: 'center',
        alignItems: 'center'
    },
    headDataList: {
        alignItems: 'center',
        width: Dimension.width/3.5
    },
})

