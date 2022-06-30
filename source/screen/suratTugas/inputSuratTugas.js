import react, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { Header } from '../../assets/layout';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../../../config/database';
import { useNavigation } from '@react-navigation/native';
import { GetMasterCekList } from '../../../config/conf';

const Dimension = Dimensions.get('window')

const InputSuratTugas = () => {

    const Navigation = useNavigation()

    let [date, setDate] = useState(new Date())
    let [showStartDate, setShowStartDate] = useState(false)
    let [showEndDate, setShowEndDate] = useState(false)
    let [startDate, setStartDate] = useState()
    let [endDate, setEndDate] = useState()

    let [username, setUsername] = useState()
    let [nama, setNama] = useState()
    let [role, setRole] = useState()
    let [branch, setBranch] = useState()
    let [jenisPemeriksaan, setJenisPemeriksaan] = useState()
    let [type, setType] = useState()

    let [loading, setLoading] = useState(false)

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [label, setLabel] = useState()
    // const [items, setItems] = useState([
    //     {label: 'cabang test 1', value: 90912},
    //     {label: 'cabang test 2', value: 90913},
    // ])
    const [items, setItems] = useState([])

    const [openEntries, setOpenEntries] = useState(false);
    const [valueEntries, setValueEntries] = useState(5);
    const [itemsEntries, setItemsEntries] = useState([])

    useEffect(() => {
        const unsubscribe  = Navigation.addListener('focus', async () => {
            fetchData()
        })
        return unsubscribe
    })

    const fetchData = async () => {
        setLoading(true)

        const syncStatus = await AsyncStorage.getItem('user_data')
        let dt = JSON.parse(syncStatus)

        const masterData = await getMaster()

        setItems(masterData)
        setUsername(dt.username)
        setNama(dt.nama)
        setRole(dt.role)

        setLoading(false)

    }

    const getMaster = () => ((new Promise((resolve, reject) => {
        let query = 'SELECT * FROM CabangDiperiksa'
        try{
            db.transaction(
                tx => {
                    tx.executeSql(query, [], (tx, results) => {
                        let a = results.rows.length
                        let arr = []

                        for(let i = 0; i < a; i++) {
                            let newdt = results.rows.item(i)

                            newdt['label'] = newdt.CabangID + '-' + newdt.NamaCabang
                            newdt['value'] = newdt.CabangID
                            arr.push(newdt)
                        }
                        // console.log(arr)
                        resolve(arr)
                    },function(error){
                        alert(error)
                        reject("error")
                    })
                }
            )
        }catch(error){
            reject(error.message)
        }
    })))

    const PickStartDateHandler = (event, date) => {
        let dateValue = moment(date).format('YYYY-MM-DD');

        console.log(dateValue)

        setShowStartDate(false)
        setStartDate(dateValue)
    }

    const PickEndDateHandler = (event, date) => {
        let dateValue = moment(date).format('YYYY-MM-DD');

        setShowEndDate(false)
        setEndDate(dateValue)
    }

    const onSelect = (item) => {
        setLabel(item.NamaCabang)
    }

    const SubmitHandler = () => {
        let today = moment().format('YYYY-MM-DD')
        let dtType = '0'

        if(role === 'KC') {
            dtType = '1'
        } else if (role === 'RPM') {
            dtType = '2'
        } else if (role === 'PPM') {
            dtType = '3'
        }

        if(startDate === undefined || startDate === null || endDate === undefined || endDate === null) {
            Alert.alert(
                "Peringatan",
                "Data yang anda masukkan tidak lengkap"
            )
        } else {
            let data = {
                Tgl : today,
                auditor : username,
                cabang : value,
                jenisAuditor : role,
                jenis_pemeriksaan : jenisPemeriksaan,
                nama_auditor : nama,
                tglMulai : startDate,
                tglSelesai : endDate,
                type : dtType,
                keterangan : label
            }

            console.log(value)

            Alert.alert(
                "Perhatian",
                `Apakah anda ingin menyimpan Surat Tugas ?`,
                [
                    {
                        text: "BATAL",
                    },
                    {
                        text: "YA",
                        onPress: () => {
                            let query = `INSERT INTO ListSTSV (`

                            if(role === 'KA') {
                                query = query + `Tgl,
                                    tglMulai,
                                    tglSelesai,
                                    auditor,
                                    jenisAuditor,
                                    tahun,
                                    syncBy,
                                    type,
                                    stat) values `
                                    + "('"
                                    + data.Tgl
                                    + "','"
                                    + data.tglMulai
                                    + "','"
                                    + data.tglSelesai
                                    + "','"
                                    + data.auditor
                                    + "','"
                                    + data.jenisAuditor
                                    + "','"
                                    + moment().format('YYYY')
                                    + "','"
                                    + data.auditor
                                    + "','"
                                    + data.type
                                    + "','"
                                    + "1"
                                    + "');"
                            } else if (role === 'PPM') {
                                query = query + `Tgl,
                                    tglMulai,
                                    tglSelesai,
                                    auditor,
                                    nama_auditor,
                                    jenisAuditor,
                                    idCabangDiperiksa,
                                    keterangan,
                                    tahun,
                                    syncBy,
                                    type,
                                    stat) values `
                                    + "('"
                                    + data.Tgl
                                    + "','"
                                    + data.tglMulai
                                    + "','"
                                    + data.tglSelesai
                                    + "','"
                                    + data.auditor
                                    + "','"
                                    + data.nama_auditor
                                    + "','"
                                    + data.jenisAuditor
                                    + "','"
                                    + data.cabang
                                    + "','"
                                    + data.keterangan
                                    + "','"
                                    + moment().format('YYYY')
                                    + "','"
                                    + data.auditor
                                    + "','"
                                    + data.type
                                    + "','"
                                    + "1"
                                    + "');"
                            } else if (role === 'RPM') {
                                query = query + `Tgl,
                                    tglMulai,
                                    tglSelesai,
                                    auditor,
                                    nama_auditor,
                                    jenisAuditor,
                                    idCabangDiperiksa,
                                    keterangan,
                                    tahun,
                                    syncBy,
                                    type,
                                    stat) values `
                                    + "('"
                                    + data.Tgl
                                    + "','"
                                    + data.tglMulai
                                    + "','"
                                    + data.tglSelesai
                                    + "','"
                                    + data.auditor
                                    + "','"
                                    + data.nama_auditor
                                    + "','"
                                    + data.jenisAuditor
                                    + "','"
                                    + data.cabang
                                    + "','"
                                    + data.keterangan
                                    + "','"
                                    + moment().format('YYYY')
                                    + "','"
                                    + data.auditor
                                    + "','"
                                    + data.type
                                    + "','"
                                    + "1"
                                    + "');"
                            }

                            let insertedID = ''
                            
                            try{
                                db.transaction(
                                    tx => {
                                        tx.executeSql(query, [], (tx, results) => {
                                            let a  = results.insertId
                                            insertedID = a
                                        })
                                    },function(error) {
                                        alert('Transaction ERROR: ' + error.message);
                                    },function() {
                                        Alert.alert(
                                            'Berhasil',
                                            'Input data berhasil, dengan Nomor Register ' + insertedID,
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
                                )
                            }catch(error){
                                alert('Transaction ERROR: ' + error.message);
                            }
                        }
                    }
                ]
            )
        }

    }

    const Head = () => {
        return(
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Image source={require('../assets/icon/Task-small.png')} /> */}
                    <Image source={require('../../assets/icon/Task-small.png')} />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >{role === 'KC' ? ('Add Surprise Visit') : ('Input Surat Tugas')}</Text>
                </View>
            </View>
        )
    }

    const BodyForm = () => {
        return(
            <View style={{ marginTop: 40 }}>
                {loading && 
                    <View style={styles.loading} >
                        <ActivityIndicator size={'large'} color="#71CDF1" />
                    </View>
                }
                {role === 'KA' || role === 'RPM' || role === 'PPM' ? (
                    <View style={{ marginHorizontal: 10 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Tanggal Awal</Text>
                            <View style={{ width: Dimension.width/2 }} >
                                <TouchableOpacity onPress={() => setShowStartDate(true)}>
                                    <TextInput
                                        value={startDate}
                                        style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10 }}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                            {showStartDate && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={PickStartDateHandler}
                                    minimumDate={new Date()}
                                />
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Tanggal Akhir</Text>
                            <View style={{ width: Dimension.width/2 }} >
                                <TouchableOpacity onPress={() => setShowEndDate(true)}>
                                    <TextInput
                                        value={endDate}
                                        style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10 }}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                            {showEndDate && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={PickEndDateHandler}
                                />
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Nama Unit</Text>
                            <View style={{ width: Dimension.width/2 }}>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    placeholder={'Silahkan pilih'}
                                    searchable={true}
                                    onSelectItem={(item) => onSelect(item)} 
                                    // dropDownContainerStyle={{marginLeft: 30, marginTop: 25, borderColor: "#0E71C4", width: Dimension.width/2, borderWidth: 2}}
                                    // style={{ width: Dimension.width/2.5, borderRadius: 10 }}
                                />
                            </View>
                        </View>

                    </View>
                ) : role === 'KC' ? (
                    <View style={{ marginHorizontal: 10 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Tanggal Register SV</Text>
                            <View style={{ width: Dimension.width/2 }} >
                                <TouchableOpacity onPress={() => setShowStartDate(true)}>
                                    <TextInput
                                        value={startDate}
                                        style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10 }}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                            {showStartDate && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={PickStartDateHandler}
                                    minimumDate={new Date()}
                                />
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Nama Kelompok</Text>
                            <View style={{ width: Dimension.width/2, flexDirection: 'row', alignItems: 'center' }} >
                                <TextInput
                                    value={startDate}
                                    style={{ flex: 4, marginRight: 2, borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10 }}
                                    editable={false}
                                />
                                <TouchableOpacity style={{ flex: 1, borderRadius: 5, backgroundColor: '#41BA90', alignItems: 'center', marginHorizontal: 1, paddingVertical: 3 }}>
                                    <Ionicons name='add-outline' size={15} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1, borderRadius: 5, backgroundColor: '#41BA90', alignItems: 'center', marginHorizontal: 1, paddingVertical: 3 }}>
                                    <Ionicons name='remove-outline' size={15} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Nama Cabang Diperiksa</Text>
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
                            </View>
                        </View>

                    </View>
                ) : (
                    <View></View>
                )}
            </View>
        )
    }

    const ButtonSUbmit = () => {
        return(
            <View style={{ marginTop: 50 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 50 }}>
                    <TouchableOpacity style={{ flex: 3, alignItems: 'center', padding: 10, borderBottomStartRadius: 10, borderTopStartRadius: 10, backgroundColor: '#FF6347' }}>
                        <Text style={{ fontWeight: 'bold', color: '#FFF' }}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => SubmitHandler()} style={{ flex: 3, alignItems: 'center', padding:10, borderBottomEndRadius: 10, borderTopEndRadius: 10, backgroundColor: '#0085E5' }}>
                        <Text style={{ fontWeight: 'bold', color: '#FFF' }}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return(
        <View>
            <Header />
            <Head />
            <BodyForm />
            <ButtonSUbmit />
        </View>
    )
}

export default InputSuratTugas

const styles = StyleSheet.create({
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