import react, { useState, useEffect, useMemo } from 'react'
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, StatusBar, Image, TextInput, ScrollView, FlatList, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native'
import db from '../../config/database';
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Header } from '../assets/layout'

const Dimension = Dimensions.get('window')

const SuratTugas = () => {

    const Navigation = useNavigation()

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

    let [username, setUsername] = useState()
    let [role, setRole] = useState()
    let [datast, setDatast] = useState([])
    let [dt, setDt] = useState([])
    let [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const unsubscribe  = Navigation.addListener('focus', async () => {
            fetchData()
        })
        return unsubscribe
    }, [])

    const fetchData = async () => {
        const syncStatus = await AsyncStorage.getItem('user_data')
        let dt = JSON.parse(syncStatus)

        let query = "SELECT DISTINCT * FROM ListSTSV WHERE "
        if (dt.role === 'KA') {
            query = query + "type = '0' AND syncBy = '" + dt.username + "'"
        } else if (dt.role === 'KC') {
            query = query + "type = '1' AND syncBy = '" + dt.username + "'"
        } else if (dt.role === 'RPM') {
            query = query + "type = '2' AND syncBy = '" + dt.username + "'"
        } else if (dt.role === 'PPM') {
            query = query + "type = '3' AND syncBy = '" + dt.username + "'"
        }

        const data = await SelectDataSuratTugas(query)

        console.log(data)
        setRole(dt.role)
        setUsername(dt.username)
        setDatast(data)
        setDt(data)
    }

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: '2022', value: '2022'},
        {label: '2021', value: '2021'},
        {label: 'All', value: ''}
    ])

    const Head = () => {
        return(
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../assets/icon/Task-small.png')} />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >{role === 'KC' ? ("Data Surprise Visit") : ("Data Surat Tugas")}</Text>
                </View>
            </View>
        )
    }

    const AddSuratTugasButton = () => {
        return(
            <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                <TouchableOpacity onPress={() => Navigation.navigate('InputSuratTugas')} style={{ paddingVertical: 3, width: Dimension.width/2.5, justifyContent: 'center', borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0085E5' }}>
                    <Ionicons name="add" size={24} color="#FFF" />
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{role === 'KC' ? ("Surprise Visit") : ("Surat Tugas")}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const Filter = () => {
        return(
            <View>
                <View style={{ marginHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Pilih Tahun</Text>
                        <View style={{ width: Dimension.width/2 }}>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder={'Silahkan pilih'}
                                // dropDownContainerStyle={{marginLeft: 30, marginTop: 25, borderColor: "#0E71C4", width: Dimension.width/2, borderWidth: 2}}
                                // style={{ width: Dimension.width/2.5, borderRadius: 10 }}

                            />
                        </View>
                    </View>

                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Show</Text>
                        <View style={{ width: Dimension.width/2 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ width: Dimension.width/3 }}>
                                    <DropDownPicker
                                        open={openEntries}
                                        value={valueEntries}
                                        items={itemsEntries}
                                        setOpen={setOpenEntries}
                                        setValue={setValueEntries}
                                        setItems={setItemsEntries}
                                        placeholder={valueEntries}
                                        // dropDownContainerStyle={{marginLeft: 30, marginTop: 25, borderColor: "#0E71C4", width: Dimension.width/2, borderWidth: 2}}
                                        // style={{ width: Dimension.width/2.5, borderRadius: 10 }}
                                    />
                                </View>
                                <Text>Entries</Text>
                            </View>
                        </View>
                    </View> */}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } }>
                        <Text>Search</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                placeholder='Masukkan No. Register'
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF' }}
                                onChangeText={(value) => {
                                    searchHandler(value, datast)
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ borderBottomWidth: 0.5, marginTop: 10, marginBottom: 10 }} />

                </View>
            </View>
        )
    }

    const yrHandler = () => {
        if(value !== null) {
            let newData = []

            if (value !== '') {
                newData = dt.filter(function(item) {
                    const itemData = moment(item.TanggalMulai).format('YYYY');
                    const textData = value;
                    return itemData.includes(textData);
                })
                setDatast([...newData]);
                return true
            } else if(value === '') {
                setDatast([...dt]);
                return true
            }
        }else{
            return true
        }
    }

    const searchHandler = (value, data) => {
        let newData = []

        if (value) {
            newData = data.filter(function(item) {
                const itemData = item.No.toUpperCase();
                const textData = value.toUpperCase();
                return itemData.includes(textData);
            })
            setDatast([...newData]);
        } else {
            setDatast([...dt]);
        }
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
                    <Text>{data.No}</Text>
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

            {role === 'KC' ? (
                <View></View>
            ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Status</Text>
                    <Text>{data.Approval_Flag === '1' ? 'Disetujui' : 'Belum Disetujui'}</Text>
                </View>
            ) }

            {role === 'KC' ? (
                <View></View>
            ) : (
                <View style={{ borderBottomWidth: 1, marginVertical: 5, marginHorizontal: 10 }} />
            ) }

            <View style={{ flexDirection: 'row'}}>
                <TouchableOpacity style={{ flex: 3, alignItems: 'center', borderBottomStartRadius: 10, borderTopStartRadius: 10, padding: 5, backgroundColor: '#0085E5' }}>
                    <Ionicons name='eye' size={20} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 3, alignItems: 'center', borderBottomEndRadius: 10, borderTopEndRadius: 10, padding: 5, backgroundColor: '#41BA90' }}>
                    <Ionicons name='pencil' size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    )

    return(
        <View style={{ flex: 1 }}>
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />
            <Header />
            <Head />
            <AddSuratTugasButton />
            <View>
                <View style={{ marginHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Pilih Tahun</Text>
                        <View style={{ width: Dimension.width/2 }}>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder={'Silahkan pilih'}
                            />
                            <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 5, borderRadius: 5, paddingHorizontal: 20, backgroundColor: '#41BA90' }} onPress={() => yrHandler()}>
                                <Text style={{ color: '#FFF' }}>Filter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } }>
                        <Text>Search</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                placeholder='Masukkan No. Register'
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF' }}
                                onChangeText={(value) => {
                                    searchHandler(value, datast)
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

export default SuratTugas

const styles = StyleSheet.create({
    headDataList: {
        alignItems: 'center',
        width: Dimension.width/3.5
    }
})