import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

//componente sempre em letra maiuscula
const Cabecalho = ({ titulo }) => {
    return (
        <View>
            <Text style={estilos.cabecalho}>{titulo}</Text>
        </View>
    )
}

const estilos = StyleSheet.create({
    cabecalho: {
        fontSize: 20,
        paddingTop: 10,
        backgroundColor: '#1a237e',
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

export default Cabecalho