import React, { useEffect, useState, useRef } from 'react';
import { Image, Modal, Platform, SafeAreaView, TouchableOpacity, View, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as MediaLibrary from 'expo-media-library'
import Cabecalho from './componentesCriados/Cabecalho' //por default ele pega o index.js da pasta cabecalho


export default function App() {
  //status de acesso à camera
  const [temPermissao, setTemPermissao] = useState(null)
  //referencia da camera
  const cameraReferencia = useRef(null)
  //icones padroes que serao exibidos, md material design
  const [iconePadrao, setIconePadrao] = useState('md')
  //tipo da camera (frontal ou trasiera)
  const [tipoCamera, setTipoCamera] = useState(Camera.Constants.Type.back)
  //status inicial do flash
  const [tipoFlash, setTipoFlash] = useState(Camera.Constants.FlashMode.off)
  //foto capturada
  const [fotoCapturada, setFotoCapturada] = useState(null)
  //exibe ou nao modal - controle do modal
  const [exibeModal, setExibeModal] = useState(false)

  //Dependendo do SO, exibiremos diferentes icones
  useEffect(() => {
    switch (Platform.OS) {
      case 'android':
        setIconePadrao('md')
        break
      case 'ios':
        setIconePadrao('ios')
        break
    }
  })

  //useEffect é executado no carregamento --onload 
  useEffect(() => {
    (
      async () => {
        if (Platform.OS === 'web') {
          const cameraDisponivel = await Camera.isAvailableAsync()
          setTemPermissao(cameraDisponivel)
        } else {
          const { status } = await Camera.requestPermissionsAsync() //retorna granted
          setTemPermissao(status === 'granted')
        }
      }
    )() //
  }, []) /** quando o array "segundo argumento" está vazio, o useEffect é executado apenas uma vez */

  if (temPermissao === false) {
    return <Text> Acesso negado à câmera ou seu equipamento não possui uma. </Text>
  }

  async function tirarFoto() {
    if (cameraReferencia) {
      const options = {
        quality: 0.5,
        skipProcessing: true
      }
      const foto = await cameraReferencia.current.takePictureAsync(options)
      setFotoCapturada(foto.uri)
      setExibeModal(true)
    }
  }

  return (
    <SafeAreaView style={estilos.container}>

      <Cabecalho titulo='FatecCam' />

      <Camera
        style={{ flex: 1 }}
        type={tipoCamera} //iniciando a camera com a camera traseira
        flashMode={tipoFlash}
        ref={cameraReferencia}
      >
        <View style={estilos.camera}>
          {/** botao camera */}
          <TouchableOpacity style={estilos.touch} onPress={tirarFoto}>
            <Ionicons name={`${iconePadrao}-camera`} size={40} color="#9e9e9e" />
          </TouchableOpacity>

          <TouchableOpacity style={estilos.touch} onPress={() => {
            setTipoCamera(
              tipoCamera === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
            )
          }}>
            <Ionicons name={`${iconePadrao}-camera-reverse`} size={40} color='#e9e9e9' />
          </TouchableOpacity>
        </View>
      </Camera>

      {/**monstrando a foto */}
      <Modal animationType='slide' transparent={true} visible={exibeModal}>
        <View style={estilos.modalView}>
          <Image source={{ uri: fotoCapturada }}
            style={{ width: '90%', height: '50%', borderRadius: 20 }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },

  camera: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  touch: {
    margin: 20,

  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    padding: 15,
    opacity: 0.9,
    alignItems: 'center'
  }
})