import react, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';

import { Header } from '../assets/layout'

const Dimension = Dimensions.get('window')

const TindakLanjut = () => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: '2022', value: '2022'},
        {label: '2021', value: '2021'}
    ])

    const Head = () => {
        return(
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../assets/icon/TindakLanjut-small.png')} />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Input Tindak Lanjut</Text>
                </View>
            </View>
        )
        
    }

    const BodyFilter = () => {
        return(
            <View style={{ marginTop: 30, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Pilih Nomor Register</Text>
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
            </View>
        )
    }

    return(
        <View>
            <Header />
            <Head />
            <BodyFilter />
        </View>
    )
}

export default TindakLanjut