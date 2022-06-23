import react, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Image, SafeAreaView, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'

import db from '../../../config/database'
import { Model, ModelInsertChecklist, ModelGetDataEditChecklist } from '../../actions/model'
import { Header } from '../../assets/layout'
import AsyncStorage from '@react-native-async-storage/async-storage'
import flashNotification from '../../actions/alert'

const Dimension = Dimensions.get('window')

const EditChecklist = (props) => {
    const { register } = props.route.params
    const Navigation = useNavigation()
    const scrollRef = useRef()

    let [dataInput, setDataInput] = useState({
        Cabang : '',
        IdST : '',
        Keterangan : '',
        NoST : date,
        TglMulai : '',
        TglSelesai : '',
        stat : '',
        syncBy : '',
        type : ''
    })

    let [inputList, setInputList] = useState([
        {
            idPemeriksaan: '',
            jenisPemeriksaan: '',
            kategoriPemeriksaan: '',
            subKategori: '',
            pertanyaan: [
                {
                    idPertanyaan: '',
                    jumlahSample: '',
                    jumlahTemuan: '',
                    detailTemuan: '',
                    scoring: ''
                }
            ]
        }
    ])
    let [userInfo, setUserInfo] = useState()

    let [date, setDate] = useState(new Date())
    const [items, setItems] = useState([])

    const [openListST, setOpenListST] = useState(false);
    const [valueST, setValueST] = useState();

    const [dataTest, setDataTest] = useState([])

    const [listST, setListST] = useState([])
    const [jenisPemeriksaan, setJenisPemeriksaan] = useState([[]])
    const [dtJenisPemeriksaan, setDtJenisPemeriksaan] = useState([])
    const [kategoriPemeriksaan, setKategoriPemeriksaan] = useState([[]])
    const [dtKategoriPemeriksaan, setDtKategoriPemeriksaan] = useState([])
    const [subKategori, setSubKategori] = useState([[]])
    const [dtSubKategori, setDtSubKategori] = useState([])
    const [pertanyaan, setPertanyaan] = useState([[]])
    const [dtPertanyaan, setDtPertanyaan] = useState([])
    const [jawaban, setJawaban] = useState([])
    const [dtJawaban, setDtJawaban] = useState([])

    useEffect(() => {
        const unsubscribe = Navigation.addListener('focus', async () => {
            const data = await AsyncStorage.getItem('user_data')
            let params = JSON.parse(data)

            setUserInfo(params)
            getMaster(params)
            getDataExist(params)
        })

        return unsubscribe
    })

    const getMaster = async (params) => {
        let queryGetMasterST = await Model('queryGetMasterST', params)
        let queryGetMasterJenisPemeriksaan = await Model('queryGetMasterJenisPemeriksaan', params)
        let queryGetMasterKategoriPemeriksaan = await Model('queryGetMasterKategoriPemeriksaan', params)
        let queryGetMasterSubKategori = await Model('queryGetMasterSubKategori', params)
        let queryGetPertanyaan = await Model('queryGetMasterPertanyaan', params)
        let queryGetMasterJawaban = await Model('queryGetMasterJawaban', params)

        const masterST = await selectMaster(queryGetMasterST)
        if(masterST.status === 'ERROR') {
            alert(masterST.data)
            return false
        }

        const masterJenisPemeriksaan = await selectMaster(queryGetMasterJenisPemeriksaan)
        if(masterJenisPemeriksaan.status === 'ERROR') {
            alert(masterJenisPemeriksaan.data)
            return false
        }

        const masterKategoriPemeriksaan = await selectMaster(queryGetMasterKategoriPemeriksaan)
        if(masterKategoriPemeriksaan.status === 'ERROR') {
            alert(masterJenisPemeriksaan.data)
            return false
        }

        const masterSubKategori = await selectMaster(queryGetMasterSubKategori)
        if(masterSubKategori.status === 'ERROR') {
            alert(masterSubKategori.data)
            return false
        }

        const masterPertanyaan = await selectMaster(queryGetPertanyaan)
        if(masterPertanyaan.status === 'ERROR') {
            alert(masterPertanyaan.data)
            return false
        }

        const masterJawaban = await selectMaster(queryGetMasterJawaban)
        if(masterJawaban.status === 'ERROR') {
            alert(masterJawaban.data)
            return false
        }

        setJawaban(masterJawaban.data)
        setDtJawaban(masterJawaban.data)
        setPertanyaan([masterPertanyaan.data])
        setDtPertanyaan(masterPertanyaan.data)
        setSubKategori([masterSubKategori.data])
        setDtSubKategori(masterSubKategori.data)
        setKategoriPemeriksaan([masterKategoriPemeriksaan.data])
        setDtKategoriPemeriksaan(masterKategoriPemeriksaan.data)
        setJenisPemeriksaan([masterJenisPemeriksaan.data])
        setDtJenisPemeriksaan(masterJenisPemeriksaan.data)
        setListST(masterST.data)
    }

    const getDataExist = async (params) => {
        let queryGetDataDetail = await ModelGetDataEditChecklist('queryGetDataDetail', register, params)
        let queryGetDataQuest = await ModelGetDataEditChecklist('queryGetDataQuest', register, params)

        // let test = `SELECT * FROM ListPemeriksaan`
        // let test1 = await selectMaster(test, register)
        // console.log(test1)

        let test = `SELECT * FROM ListPemeriksaan WHERE NoST = '` + register + `'`
        let test1 = await selectMasterDetail(test, register)
        console.log(test1)

        let masterDataDetail = await selectMaster(queryGetDataDetail)
        if(masterDataDetail.status === 'ERROR') {
            alert(masterDataDetail.data)
            return false
        }
        setDataInput(masterDataDetail.data[0])
        setValueST(masterDataDetail.data[0].NoST)

        let masterDataQuest = await selectMaster(queryGetDataQuest)
        if(masterDataQuest.status === 'ERROR') {
            alert(masterDataQuest.data)
            return false
        }

        // console.log(masterDataQuest)
    }

    const selectMasterDetail = (query, register) => (new Promise((resolve, reject) => {
        let response = {
            status : '',
            data : []
        }

        let detail = {
            idPemeriksaan: '',
            jenisPemeriksaan: '',
            kategoriPemeriksaan: '',
            subKategori: '',
            pertanyaan: [
                {
                    idPertanyaan: '',
                    jumlahSample: '',
                    jumlahTemuan: '',
                    detailTemuan: '',
                    scoring: ''
                }
            ]
        }
        
        try{
            db.transaction(
                tx => {
                    tx.executeSql(query, [], (tx, results) => {
                        let dataLen = results.rows.length
                        let arr = []

                        for(let a = 0; a < dataLen; a++) {
                            let dt = results.rows.item(a)

                            let det = {
                                idPemeriksaan: dt.IdPemeriksaan,
                                jenisPemeriksaan: dt.JenisPememeriksaan,
                                kategoriPemeriksaan: dt.KategoriPemeriksaan,
                                subKategori: dt.SubKategori,
                                pertanyaan: []
                            }

                            let query = `SELECT * FROM InputListChecklist WHERE NoST = '` + dt.NoST + `' AND IdPemeriksaan = '` + dt.IdPemeriksaan + `'`

                            db.transaction(
                                tx => {
                                    tx.executeSql(query, [], (tx, results) => {
                                        let dtLen = results.rows.length
                                        let arrHelp = []
        
                                        for(let x = 0; x < dtLen; x++) {
                                            let u = results.rows.item(x)
        
                                            arrHelp.push(u)
                                        }
                                        console.log("holy shit")
                                        console.log(det)
                                        // det[a].pertanyaan.push(arr)
                                    })
                                }, function(error) {
                                    console.log(error.message)
                                }
                            )

                            // console.log(query)

                            arr.push(det)
                        }

                        console.log("this")
                        console.log(arr)

                        response = {
                            status : 'SUCCESS',
                            data: arr
                        }
                        resolve(response)
                    })
                }, function(error) {
                    response = {
                        status : 'ERROR',
                        data: error.message
                    }
                    reject(response)
                }
            )
        }catch(error){
            response = {
                status : 'ERROR',
                data : error.message
            }
            reject(response)
        }
    }))

    const selectMaster = (query) => (new Promise((resolve, reject) => {
        let response = {
            status : '',
            data : []
        }
        try{
            db.transaction(
                tx => {
                    tx.executeSql(query, [], (tx, results) => {
                        let dataLen = results.rows.length
                        let arr = []

                        for(let a = 0; a < dataLen; a++) {
                            let newDt = results.rows.item(a)
                            arr.push(newDt)
                        }

                        response = {
                            status : 'SUCCESS',
                            data: arr
                        }
                        resolve(response)
                    })
                }, function(error) {
                    response = {
                        status : 'ERROR',
                        data: error.message
                    }
                    reject(response)
                }
            )
        }catch(error){
            response = {
                status : 'ERROR',
                data : error.message
            }
            reject(response)
        }
    }))

    const Head = () => {
        return(
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Image source={require('../assets/icon/Task-small.png')} /> */}
                    <Image source={require('../../assets/icon/Checklist-small.png')} />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Edit Checklist</Text>
                </View>
                <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => SaveHandler()} style={{ paddingVertical: 5, paddingHorizontal: 25, justifyContent: 'center', borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0085E5' }}>
                        <Ionicons name="save" size={18} color="#FFF" style={{ marginHorizontal: 5 }} />
                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Update</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        )
    }

    const jenisPemeriksaanChangeHandler = (val, i) => {
        let newData = [...inputList]
        newData[i].jenisPemeriksaan = val
        newData[i].kategoriPemeriksaan = ''
        setInputList(newData)

        let optData = []
        optData = dtKategoriPemeriksaan.filter(function(item) {
            const itemData = item.IdTipeCeklist.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.includes(textData);
        })

        let newdt = [...kategoriPemeriksaan]
        newdt[i] = [...optData]

        setKategoriPemeriksaan([...newdt]);
    }

    const kategoriPemeriksaanChangeHandler = (val, i) => {
        let newData = [...inputList]
        newData[i].kategoriPemeriksaan = val
        newData[i].subKategori = ''
        setInputList(newData)

        let optData = []
        optData = dtSubKategori.filter(function(item) {
            const itemData = item.IdKategori.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.includes(textData);
        })

        let newdt = [...subKategori]
        newdt[i] = [...optData]

        setSubKategori([...newdt]);
    }

    const subKategoriChangeHandler = (val, i) => {
        let newData = [...inputList]
        newData[i].subKategori = val
        newData[i].pertanyaan = [
            {
                idPertanyaan: '',
                jumlahSample: '',
                jumlahTemuan: '',
                detailTemuan: '',
                scoring: ''
            }
        ]
        setInputList(newData)

        let optData = []
        optData = dtPertanyaan.filter(function(item) {
            const itemData = item.IdSubKategori.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.includes(textData);
        })

        let newdt = [...pertanyaan]
        newdt[i] = [...optData]

        setPertanyaan([...newdt]);
    }

    const pertanyaanChangeHandler = (val, idx, i) => {
        let newData = [...inputList]
        newData[idx].pertanyaan[i].idPertanyaan = val

        setInputList(newData)
    }

    const jawabanChangeHandler = (val, idx, i) => {
        let newData = [...inputList]
        newData[idx].pertanyaan[i].scoring = val

        setInputList(newData)
    }

    const addFormHandler = () => {
        let newObj = {
            jenisPemeriksaan: '',
            kategoriPemeriksaan: '',
            subKategori: '',
            pertanyaan: [
                {
                    idPertanyaan: '',
                    jumlahSample: '',
                    jumlahTemuan: '',
                    detailTemuan: ''
                }
            ]
        }

        setJenisPemeriksaan([...jenisPemeriksaan, dtJenisPemeriksaan])
        setKategoriPemeriksaan([...kategoriPemeriksaan, dtKategoriPemeriksaan])
        setSubKategori([...subKategori, dtSubKategori])
        setPertanyaan([...pertanyaan, dtPertanyaan])

        setInputList([...inputList, newObj])
    }

    const removeHandler = () => {
        let lastIndex = inputList.length - 1

        if(lastIndex === 0) {
            flashNotification('Caution', 'Silakan tambahkan form pemeriksaan', '#FF7900')
            return false
        }

        let dt = [...inputList]
        dt.splice(lastIndex, 1)
        setInputList(dt)

        let listJenisPemeriksaan = [...jenisPemeriksaan]
        listJenisPemeriksaan.splice(lastIndex, 1)
        setJenisPemeriksaan(listJenisPemeriksaan)

        let listKategoriPemeriksaan = [...kategoriPemeriksaan]
        listKategoriPemeriksaan.splice(lastIndex, 1)
        setJenisPemeriksaan(listKategoriPemeriksaan)

        let listSubKategori = [...subKategori]
        listSubKategori.splice(lastIndex, 1)
        setJenisPemeriksaan(listSubKategori)

        let listPertanyaan = [...pertanyaan]
        listPertanyaan.splice(lastIndex, 1)
        setJenisPemeriksaan(listPertanyaan)
    }

    const addFormPertanyaanHandler = (i) => {
        let newObj = {
            idPertanyaan: '',
            jumlahSample: '',
            jumlahTemuan: '',
            detailTemuan: ''
        }

        let newData = [...inputList]
        newData[i].pertanyaan.push(newObj)

        setInputList(newData)
    }
    const removeFormPertanyaanHandler = (i) => {
        let newData = [...inputList]
        let lastid = newData[i].pertanyaan.length - 1

        newData[i].pertanyaan.splice(lastid, 1)
        setInputList(newData)
    }

    const onSelectListST = (item) => {
        console.log('ini')
        console.log(item)
        setDataInput(item)
    }

    const SaveHandler = async () => {
        let dataLength = inputList.length
        let dataPemeriksaan = inputList
        let dataChecklist = {
            noST : valueST,
            idST : dataInput.IdST,
            cabang : dataInput.Cabang,
            keterangan : dataInput.keterangan,
            tgl : moment(dataInput.Tgl).format('L'),
            tglMulai : moment(dataInput.tglMulai).format('L'),
            tglSelesai : moment(dataInput.tglSelesai).format('L')

        }

        if(dataChecklist.noST === undefined || dataChecklist.noST === null || dataChecklist.noST === '') {
            alert('Pilih surat tugas terlebih dahulu')
        }

        for(let a = 0; a < dataLength; a++) {
            let no = a + 1
            if(inputList[a].jenisPemeriksaan === '' || inputList[a].kategoriPemeriksaan === '' || inputList[a].subKategori === '' ) {
                Alert.alert(
                    'Peringatan',
                    'Data pemeriksaan nomor ' + no + ' belum lengkap'
                )

                return false
            }else{
                let questLength = inputList[a].pertanyaan.length
                let currrentData = inputList[a]

                if(currrentData.jenisPemeriksaan === '1') {
                    for(let i = 0; i < questLength; i++) {
                        if(currrentData.pertanyaan[i].idPertanyaan === '' || currrentData.pertanyaan[i].jumlahSample === '' || currrentData.pertanyaan[i].jumlahTemuan === '') {
                            Alert.alert(
                                'Peringatan',
                                'Data pertanyaan nomor ' + no + ' belum lengkap'
                            )
    
                            return false
                        }
                    }
                }else if(currrentData.jenisPemeriksaan === '2') {
                    for(let i = 0; i < questLength; i++) {
                        if(currrentData.pertanyaan[i].scoring === '') {
                            Alert.alert(
                                'Peringatan',
                                'Jawaban pertanyaan nomor ' + no + ' belum dipilih'
                            )
    
                            return false
                        }
                    }
                }

            }
        }

        Alert.alert(
            'Perhatian !',
            'Apakah anda yakin akan menyimpan data Checklist ?',
            [
                {
                    text: 'Batal'
                },
                {
                    text: 'Ya',
                    onPress: async () => {
                        const PostData = await ModelInsertChecklist(dataChecklist, dataPemeriksaan, userInfo)
        
                        if(PostData.status === 'ERROR') {
                            Alert.alert(
                                'ERROR',
                                'Data gagal disimpan : ' + PostData.data,
                                [
                                    {
                                        text: 'Ok'
                                    }
                                ]
                            )
                        }else if(PostData.status === 'SUCCESS') {
                            Alert.alert(
                                'BERHASIL',
                                'Data Berhasil di simpan',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => Navigation.goBack()
                                    }
                                ]
                            )
                        }
                    }
                }
            ]
        )
    }

    return(
        <View style={{ flex: 1 }}>
            <Header />
            <Head />
            <SafeAreaView style={{ marginTop: 10, flex: 1 }}>
                <ScrollView ref={scrollRef} style={{ marginHorizontal: 10 }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Nomor Surat Tugas</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                numberOfLines={1}
                                value={dataInput.NoST}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Nama Cabang</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                numberOfLines={1}
                                value={dataInput.Keterangan}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Tanggal Input</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                value={moment(dataInput.Tgl).format('L')}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Tanggal Awal</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                value={dataInput.TglMulai}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Tanggal Akhir</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                value={dataInput.TglSelesai}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View>

                    <View style={{ justifyContent: 'space-between', marginTop: 20, flex: 1 } }>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Pemeriksaan</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => addFormHandler()} style={{ marginHorizontal: 2.5, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0085E5' }}>
                                <Ionicons name="md-add-circle" size={26} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeHandler()} style={{ marginHorizontal: 2.5, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 10, backgroundColor: '#FF6347' }}>
                                <Ionicons name="remove-circle-outline" size={26} color="white" />
                            </TouchableOpacity>
                        </View>

                        {inputList.map((x, i) => {
                            return(
                                <View key={i} style={{ marginBottom: i === inputList.length - 1 ? 0 : 12, borderColor: 'gray', backgroundColor: '#FFF', borderWidth: 1, borderRadius: 15, marginTop: 10, padding: 15, marginBottom: 20 }} >
                                    <View>
                                        <View>
                                            <Text style={{ fontSize: 15 }}>Jenis Pemeriksaan : </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <View style={{ width: Dimension.width/1.5, borderBottomWidth: 1 }} >
                                                    <Picker
                                                        selectedValue={inputList[i].jenisPemeriksaan}
                                                        onValueChange={(val, idx) => jenisPemeriksaanChangeHandler(val, i)}
                                                        style={{ fontSize: 10 }}
                                                    >
                                                        <Picker.Item label={'Silahkan Pilih'} value={''} />
                                                        {jenisPemeriksaan[i].map((item, index) => (
                                                            <Picker.Item label={item.label} value={item.value} key={index} />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                        </View>
                        
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={{ fontSize: 15 }}>Kategori Pemeriksaan : </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <View style={{ width: Dimension.width/1.5, borderBottomWidth: 1 }} >
                                                    <Picker
                                                        selectedValue={inputList[i].kategoriPemeriksaan}
                                                        onValueChange={(val, idx) => kategoriPemeriksaanChangeHandler(val, i)}
                                                        style={{ fontSize: 10 }}
                                                    >
                                                        <Picker.Item label={'Silahkan Pilih'} value={''} />
                                                        {kategoriPemeriksaan[i].map((item, index) => (
                                                            <Picker.Item label={item.label} value={item.value} key={index} />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                        </View>
                        
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={{ fontSize: 15 }}>Sub Kategori : </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <View style={{ width: Dimension.width/1.5, borderBottomWidth: 1 }} >
                                                    <Picker
                                                        selectedValue={inputList[i].subKategori}
                                                        onValueChange={(val, idx) => subKategoriChangeHandler(val, i)}
                                                        style={{ fontSize: 10 }}
                                                    >
                                                        <Picker.Item label={'Silahkan Pilih'} value={''} />
                                                        {subKategori[i].map((item, index) => (
                                                            <Picker.Item label={item.label} value={item.value} key={index} />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                        </View>
                                        
                                        <View style={{ marginTop: 30 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Pertanyaan</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <TouchableOpacity onPress={() => addFormPertanyaanHandler(i)} style={{ marginHorizontal: 2.5, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0085E5' }}>
                                                    <Ionicons name="md-add-circle" size={20} color="white" />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => removeFormPertanyaanHandler(i)} style={{ marginHorizontal: 2.5, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 10, backgroundColor: '#FF6347' }}>
                                                    <Ionicons name="remove-circle-outline" size={20} color="white" />
                                                </TouchableOpacity>
                                            </View>
                        
                                            {inputList[i].pertanyaan.map((y, idx) => {
                                                return(
                                                    <View key={idx}>
                                                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, marginTop: 20, padding: 10 }}>
                                                            <Text style={{ fontSize: 15 }}>Pilih Pertanyaan : </Text>
                                                            <View style={{ ustifyContent: 'flex-end', marginBottom: 20 }}>
                                                                <View style={{ borderBottomWidth: 1, marginLeft: 10 }} >
                                                                    <Picker
                                                                        selectedValue={inputList[i].pertanyaan[idx].idPertanyaan}
                                                                        onValueChange={(val) => pertanyaanChangeHandler(val, i, idx)}
                                                                        style={{ fontSize: 10 }}
                                                                    >
                                                                        <Picker.Item label={'Silahkan Pilih'} value={''} />
                                                                        {pertanyaan[i].map((item, index) => (
                                                                            <Picker.Item label={item.label} value={item.value} key={index} />
                                                                        ))}
                                                                    </Picker>
                                                                </View>
                                                            </View>

                                                            {inputList[i].jenisPemeriksaan === '2' ? (
                                                                <View>
                                                                    <Text style={{ fontSize: 15 }}>Jawaban : </Text>
                                                                    <View style={{ ustifyContent: 'flex-end', marginBottom: 20 }}>
                                                                        <View style={{ borderBottomWidth: 1, marginLeft: 10 }} >
                                                                            <Picker
                                                                                selectedValue={inputList[i].pertanyaan[idx].scoring}
                                                                                onValueChange={(val) => jawabanChangeHandler(val, i, idx)}
                                                                                style={{ fontSize: 10 }}
                                                                            >
                                                                                <Picker.Item label={'Silahkan Pilih'} value={''} />
                                                                                {jawaban.map((item, index) => (
                                                                                    <Picker.Item label={item.label} value={item.value} key={index} />
                                                                                ))}
                                                                            </Picker>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            ) : (
                                                                <View>
                                                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                                        <View style={{ flex: 2 }}>
                                                                            <Text style={{ fontSize: 15 }}>Jumlah Sample</Text>
                                                                        </View>
                                                                        <View style={{ flex: 3 }} >
                                                                            <View style={{ borderWidth: 1, borderRadius: 5 }}>
                                                                                <TextInput
                                                                                    value={inputList[i].pertanyaan[idx].jumlahSample}
                                                                                    placeholder='Masukkan jumlah sample'
                                                                                    style={{ marginHorizontal: 10 }}
                                                                                    keyboardType={'numeric'}
                                                                                    onChangeText={(val) => {
                                                                                        let newData = [...inputList]
                                                                                        inputList[i].pertanyaan[idx].jumlahSample = val
                                                                                        setInputList(newData)
                                                                                    }}
                                                                                />
                                                                            </View>
                                                                        </View>
                                                                    </View>

                                                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                                        <View style={{ flex: 2 }}>
                                                                            <Text style={{ fontSize: 15 }}>Jumlah Temuan</Text>
                                                                        </View>
                                                                        <View style={{ flex: 3}} >
                                                                            <View style={{ borderWidth: 1, borderRadius: 5 }}>
                                                                                <TextInput
                                                                                    value={inputList[i].pertanyaan[idx].jumlahTemuan}
                                                                                    placeholder='Masukkan jumlah temuan'
                                                                                    style={{ marginHorizontal: 10 }}
                                                                                    keyboardType={'numeric'}
                                                                                    onChangeText={(val) => {
                                                                                        let newData = [...inputList]
                                                                                        inputList[i].pertanyaan[idx].jumlahTemuan = val
                                                                                        setInputList(newData)
                                                                                    }}
                                                                                />
                                                                            </View>
                                                                        </View>
                                                                    </View>

                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <View style={{ flex: 2}} >
                                                                            <Text style={{ fontSize: 15 }}>Detail Temuan</Text>
                                                                        </View>
                                                                        <View style={{ flex: 3}} >
                                                                            <View style={{ borderWidth: 1, borderRadius: 5 }}>
                                                                                <TextInput
                                                                                    value={inputList[i].pertanyaan[idx].detailTemuan}
                                                                                    placeholder='Masukkan detail temuan'
                                                                                    numberOfLines={10}
                                                                                    multiline={true}
                                                                                    style={{ marginHorizontal: 10 }}
                                                                                    onChangeText={(val) => {
                                                                                        let newData = [...inputList]
                                                                                        inputList[i].pertanyaan[idx].detailTemuan = val
                                                                                        setInputList(newData)
                                                                                    }}
                                                                                    blurOnSubmit={true}
                                                                                />
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            )}
                                                            
                                                        </View>
                                                    </View>
                                                )
                                            })}
                        
                                        </View>
                                    </View>
                                </View>
                            )
                        })}

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default EditChecklist

const styles = StyleSheet.create({

})