import { View, Text,StyleSheet,TouchableOpacity,useColorScheme,ActivityIndicator} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import React,{useEffect,useState} from 'react'
import TrackPlayer, { Event, usePlaybackState } from 'react-native-track-player';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent:'space-around',
        top:60
    }
})

function Controllers({onNext, onPrv}) {
  const isDarkMode = useColorScheme() === 'dark';
const backgroundStyle = {
  colortext: isDarkMode?'white':'black'
};
const playbackState = usePlaybackState();
const [isPlaying,setIsPlaying] = useState("paused");
useEffect(() => {
  if(playbackState==="playing"||playbackState===3){
    setIsPlaying("playing");
  }
  else if(playbackState==="paused"||playbackState===2){
    setIsPlaying("paused");
  }
  else{
    setIsPlaying("loading");
  }
}, [playbackState])

const renderPlayPauseButton =()=>{
  console.log(isPlaying);
  switch (isPlaying) {
    case "playing":
      return <MaterialIcons name='pause-circle-filled' onPress={onPlayPause} size={55} color={backgroundStyle.colortext}/>
      case "paused":
        return <MaterialIcons name='play-circle-filled' onPress={onPlayPause} size={55} color={backgroundStyle.colortext}/>
  
    default:
      return <ActivityIndicator size={55}/>
  }
}
const onPlayPause=()=>{
  if(playbackState==="playing"||playbackState===3){
    TrackPlayer.pause();
  }
  else if(playbackState==="paused"||playbackState===2){
    TrackPlayer.play();
  }

}
  return (
    <View style={styles.container}>
    <TouchableOpacity onPress={onPrv}>
    <MaterialIcons name='skip-previous' size={44} color={backgroundStyle.colortext}/>
    </TouchableOpacity>
    <TouchableOpacity>
      {renderPlayPauseButton()}
    </TouchableOpacity>
    <TouchableOpacity onPress={onNext}>
    <MaterialIcons name='skip-next' size={44} color={backgroundStyle.colortext}/>
    </TouchableOpacity>
    </View>
  )
}
export default Controllers;