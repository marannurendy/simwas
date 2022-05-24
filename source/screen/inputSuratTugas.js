import react, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { Header } from '../assets/layout'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'

const Dimension = Dimensions.get('window')

const InputSuratTugas = () => {

    let [date, setDate] = useState(new Date())
    let [showStartDate, setShowStartDate] = useState(false)
    let [showEndDate, setShowEndDate] = useState(false)
    let [startDate, setStartDate] = useState()
    let [endDate, setEndDate] = useState()

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([])

    const [openEntries, setOpenEntries] = useState(false);
    const [valueEntries, setValueEntries] = useState(5);
    const [itemsEntries, setItemsEntries] = useState([])

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

    const Head = () => {
        return(
            <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../assets/icon/Task-small.png')} />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Input Surat Tugas</Text>
                </View>
            </View>
        )
    }

    const BodyForm = () => {
        return(
            <View style={{ marginTop: 40 }}>
                <View style={{ marginHorizontal: 10 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Nomor Surat Tugas</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                placeholder='1'
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10 }}
                                editable={false}
                            />
                        </View>
                    </View>

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
                                maximumDate={new Date()}
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
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Name Cabang</Text>
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

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Nama Unit</Text>
                        <View style={{ width: Dimension.width/2 }}>
                            <DropDownPicker
                                open={openEntries}
                                value={valueEntries}
                                items={itemsEntries}
                                setOpen={setOpenEntries}
                                setValue={setValueEntries}
                                setItems={setItemsEntries}
                                placeholder={'Silahkan pilih'}
                                // dropDownContainerStyle={{marginLeft: 30, marginTop: 25, borderColor: "#0E71C4", width: Dimension.width/2, borderWidth: 2}}
                                // style={{ width: Dimension.width/2.5, borderRadius: 10 }}

                            />
                        </View>
                    </View>

                </View>
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
                    <TouchableOpacity style={{ flex: 3, alignItems: 'center', padding:10, borderBottomEndRadius: 10, borderTopEndRadius: 10, backgroundColor: '#0085E5' }}>
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

})