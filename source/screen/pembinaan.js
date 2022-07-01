import react, { useState } from 'react'
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, StatusBar, Image, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native'

import { Header } from '../assets/layout'

const Dimension = Dimensions.get('window')

const Pembinaan = () => {

    const Navigation = useNavigation()

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: '2022', value: '2022'},
        {label: '2021', value: '2021'}
    ])

    const [openEntries, setOpenEntries] = useState(false);
    const [valueEntries, setValueEntries] = useState(5);
    const [itemsEntries, setItemsEntries] = useState([
        {label: '5', value: '5'},
        {label: '10', value: '10'}
    ])

    const Head = () => {
        return(
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../assets/icon/Pembinaan-small.png')} />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Data Pembinaan</Text>
                </View>
            </View>
        )
    }

    const AddSuratTugasButton = () => {
        return(
            <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                <TouchableOpacity onPress={() => Navigation.navigate('InputSuratTugas')} style={{ paddingVertical: 3, width: Dimension.width/3, justifyContent: 'center', borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0085E5' }}>
                    <Ionicons name="add" size={24} color="#FFF" />
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Pembinaan</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const Filter = () => {
        return(
            <View>
                <View style={{ marginHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
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
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } }>
                        <Text>Search</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                placeholder='Masukkan Pencarion'
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF' }}
                            />
                        </View>
                    </View>

                    <View style={{ borderBottomWidth: 0.5, marginTop: 10, marginBottom: 20 }} />

                </View>
            </View>
        )
    }

    const ListBody = () => {
        return(
            <View>
                <View>
                    <View style={{ marginHorizontal: 10, borderWidth: 1, padding: 5, borderRadius: 10, backgroundColor: '#FFF' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={styles.headDataList}>
                                <Text>No ST</Text>
                                <Text>123456789</Text>
                            </View>
                            <View style={styles.headDataList}>
                                <Text>Tanggal ST</Text>
                                <Text>12-12-2022</Text>
                            </View>
                            <View style={styles.headDataList}>
                                <Text>Nama Area</Text>
                                <Text>Area Test</Text>
                            </View>
                        </View>

                        <View style={{ borderBottomWidth: 1, marginVertical: 5, marginHorizontal: 10 }} />

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text>Status</Text>
                            <Text>Approved</Text>
                        </View>

                        <View style={{ borderBottomWidth: 1, marginVertical: 5, marginHorizontal: 10 }} />

                        <View style={{ flexDirection: 'row'}}>
                            <TouchableOpacity style={{ flex: 3, alignItems: 'center', borderBottomStartRadius: 10, borderTopStartRadius: 10, padding: 5, backgroundColor: '#0085E5' }}>
                                <Ionicons name='eye' size={20} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 3, alignItems: 'center', borderBottomEndRadius: 10, borderTopEndRadius: 10, padding: 5, backgroundColor: '#41BA90' }}>
                                <Ionicons name='pencil' size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return(
        <View>
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />
            <Header />
            <Head />
            <AddSuratTugasButton />
            <Filter />
            <ListBody />
        </View>
    )
}

export default Pembinaan

const styles = StyleSheet.create({
    headDataList: {
        alignItems: 'center',
        width: Dimension.width/3.5
    }
})