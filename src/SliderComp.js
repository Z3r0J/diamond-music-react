import { StyleSheet, Text, View,useColorScheme } from 'react-native'
import React,{useState,useEffect} from 'react'
import Slider from '@react-native-community/slider';
import TrackPlayer,{useProgress} from 'react-native-track-player';

export default function SliderComp({imageColor}) {
const {position,duration}=useProgress();
const handleChange = (val) =>{
console.log(val)
TrackPlayer.seekTo(val)
}

const formatTime = (secs)=>{
    let minutes = Math.floor(secs/60);
    let seconds = Math.floor(secs-minutes/60);
    if(seconds<10){seconds= `0${seconds}`}
    return `${minutes}:${seconds}`
}
const isDarkMode = useColorScheme() === 'dark';
const backgroundStyle = {
  colortext: isDarkMode?'white':'black'
};
  return (
    <View>
<Slider
  style={{width: 320, height: 50,top:40,left:20}}
  minimumValue={0}
  maximumValue={duration}
  value={position}
  maximumTrackTintColor="rgba(255,255,255,.5)"
  minimumTrackTintColor={imageColor}
  onSlidingComplete={handleChange}
  thumbTintColor={imageColor}
/>
<View style={styles.timercontainer}>
<Text style={{color:backgroundStyle.colortext,top:30,left:35}}>{formatTime(position)}</Text>
<Text style={{color:backgroundStyle.colortext,top:30, right:29}}>{formatTime(duration)}</Text>
</View>
    </View>

  )
}

const styles = StyleSheet.create({
    timercontainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    }

})