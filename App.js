import React, { useEffect, useState, useRef } from 'react';
import {
  Text, Image, Modal, Platform, SafeAreaView,
  TouchableOpacity, View, StyleSheet, ToastAndroid, Alert
} from 'react-native'

import { Camera } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as MediaLibrary from 'expo-media-library'
import Cabecalho from './componentesCriados/Cabecalho' //por default ele pega o index.js da pasta cabecalho


export default function App() {
  /*
    status de acesso à camera, utilizandp o hook useState,
    flag para dizermos se a camera está ou nao permitida a
    nossa aplicacao. 
    https://pt-br.reactjs.org/docs/hooks-intro.html
  */
  const [temPermissao, setTemPermissao] = useState(null)

<<<<<<< HEAD
  //status permissao a galeria
  const [temPermissaoGaleria, setTemPermissaoGaleria] = useState(null)

  //referencia da camera
=======
  //referencia da camera, com o hook useRef
>>>>>>> 157213cb9a9cab8adc7e56786767b28c95176c79
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
        setIconePadrao('md') //android
        break
      case 'ios':
        setIconePadrao('ios') //ios
        break
    }
  })

  /*
    useEffect é um hook react e é executado no carregamento
    como se fosse o --onload do html, e recebe dois argumentos,
    o segundo argumento é opcional, pois podemos passar alguma
    variavel por exemplo para ser 'observado' e em determinada
    situação ser executada novamente primeiro argumento que é 
    uma funcao
  */
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
<<<<<<< HEAD
    )(); //promisse

    (
      async () => {
        //solicita permissao a galeria
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        setTemPermissaoGaleria(status === 'granted')
      }
    )();

  }, []) /** quando o array "segundo argumento" está vazio, o useEffect é executado apenas uma vez */
=======
    )() //promisse, pesquisar
  }, []) /** quando o array (segundo argumento) está vazio, o useEffect é executado apenas uma vez */
>>>>>>> 157213cb9a9cab8adc7e56786767b28c95176c79

  if (temPermissao === false) {
    return <Text>Acesso negado à câmera ou seu equipamento não possui uma.</Text>
  }

  async function tirarFoto() {
    if (cameraReferencia) {
      {/*Camera, comentanto esta linha pois acho que coloquei Camera aqui sem querer*/}
      const options = {
        quality: 1,
        skipProcessing: false,
        ratio: "16:9"
      }
      const foto = await cameraReferencia.current.takePictureAsync(options)
      setFotoCapturada(foto.uri) //takePictureAsync retorna o uri da foto, aqui 
      setExibeModal(true)

      await obterResolucoes()

      let mensagem = 'Foto Capturada com sucesso!'
      iconePadrao === 'md'
        ? ToastAndroid.showWithGravity(mensagem, ToastAndroid.SHORT, ToastAndroid.CENTER)
        : Alert.alert('Imagem capturada', mensagem)

    }
  }

  async function salvarFoto() {
    if (temPermissaoGaleria) {
      setExibeModal(false)
      const fotoASerSalva = await MediaLibrary.createAssetAsync(fotoCapturada)
      await MediaLibrary.createAlbumAsync('FateCam', fotoASerSalva, false)
    } else {
      Alert.alert('Nao foi possivel', 'Infelizmente o app nao tem permissao')
    }
  }

  async function obterResolucoes() {
    let resolucoes = await cameraReferencia.current.getAvailablePictureSizesAsync('16:9')
    console.log(`Resoluções suportadas:   ${JSON.stringify(resolucoes)}`)
    if (resolucoes && resolucoes.length > 0) {
      console.log(`Maior qualidade:  ${resolucoes[resolucoes.length - 1]}`)
      console.log(`Menor qualidade:  ${resolucoes[0]}`)
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
        ratio={'16:9'}
      >

        <View style={estilos.camera}>
          {/** botao camera */}
          <TouchableOpacity style={estilos.touch} onPress={tirarFoto}>
            <Ionicons name={`${iconePadrao}-camera`} size={40} color="#9e9e9e" />
          </TouchableOpacity>

          {/* Botao camera frontal/traseira */}
          <TouchableOpacity style={estilos.touch} onPress={() => {
            setTipoCamera(
              tipoCamera === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
          }}>
            <Ionicons name={`${iconePadrao}-camera-reverse`} size={40} color='#e9e9e9' />
          </TouchableOpacity>

          {/*Botao flash */}
          <TouchableOpacity style={estilos.touch} onPress={() => {
            setTipoFlash(
              tipoFlash === Camera.Constants.FlashMode.on ? Camera.Constants.FlashMode.off : Camera.Constants.FlashMode.on
            )
          }}
          >
            <Ionicons name={tipoFlash === Camera.Constants.FlashMode.on ? `${iconePadrao}-flash` : `${iconePadrao}-flash-off`}
              size={40} color='#d9e9'
            />
          </TouchableOpacity>
        </View>
      </Camera>

      {/*monstrando a foto */}
      <Modal animationType='slide' transparent={true} visible={exibeModal}>
        <View style={estilos.modalView}>
          <Image source={{ uri: fotoCapturada }} style={{ width: '90%', height: '50%' }} />

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ margin: 2 }} onPress={salvarFoto}>
              <Ionicons name={`${iconePadrao}-cloud-circle`} size={40} color='#121212' />
            </TouchableOpacity>
          </View>

          {/*botao para fechar o modal via documentação*/}
          <TouchableOpacity
            style={[estilos.botaoFecharModal]}
            onPress={() => { setExibeModal(false) }}
            accessible={true}
            accessibilityLabel='Fechar'
            accessibilityHint='Fecha a janela atual'>
            <Text>Fechar</Text>
            <Ionicons name={`${iconePadrao}-close-circle`} size={20} color='rgb(999,0,0)' />
          </TouchableOpacity>

        </View>
      </Modal>

    </SafeAreaView >
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
    opacity: 1,
    alignItems: 'center',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20
  },

  botaoFecharModal: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 80,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 20,
    bottom: '-40%',
    backgroundColor: '#e2a1d5d2'
  }
})
