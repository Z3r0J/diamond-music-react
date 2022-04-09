import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    Animated,
    TouchableOpacity
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react';
import { size } from 'lodash';
import Controllers from './Controllers';
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme';
import TrackPlayer, { Capability, Event } from 'react-native-track-player';
import RollingText from 'react-native-rolling-text';
import SliderComp from './SliderComp';
import ImageColors from 'react-native-image-colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default function Player() {
    const [songs, setSongs] = useState([]);
    const scrollX = useRef(new Animated.Value(0)).current;
    const { width, height } = Dimensions.get("window");
    const slider = useRef(null);
    const [index, setIndex] = useState(0);
    const isDarkMode = useColorScheme() === 'dark';
    const isPlayerReady = useRef(false);
    const [imageUrl,setImageUrl] = useState('https://song-database.netlify.app/music-arts/callingmyphone.png');
    const [musicFavorite, setFavorite] = useState(null);
    const [favoriteState, setFavoriteState] = useState(0);
    const [colorImage, setColorImage] = useState('white');

    const backgroundStyle = {
    colortext: isDarkMode?'white':'black'
  };
    const styles = StyleSheet.create({
        container: {
        justifyContent:'space-evenly',
        height: height,
        maxHeight:600,
        alignItems:'center',

        },
        colorwhite:{
            color:'white'
        },
        colorblack:{
            color:'black'
        },
        image: {
            width: 315,
            height: 315,
            borderRadius:7,
            borderColor:colorImage,
            borderWidth:0.5,
        },
        imgcontainer: {
            width: width,
            alignItems: 'center',
        },
        title: {
            fontSize: 24, top: 15, textTransform: 'capitalize',color:backgroundStyle.colortext, fontWeight:'bold',textAlign:'center',textAlignVertical:'center'
        },
        artist:{
            fontSize: 18, textAlign: 'center', top: 17, textTransform: 'capitalize',color:backgroundStyle.colortext
        },
        textcontainer:{
         left: 111, 
        right: 20,
        justifyContent: 'center', 
        alignItems: 'center'},
    });
    async function music() {
        let response = await fetch(`https://json-note-server.herokuapp.com/music`);
        let data = await response.json();
        setSongs(data);
    }
    let getSongs = async() =>{
    let response = await fetch(`https://json-note-server.herokuapp.com/music/${index+1}`);
    let data = await response.json();
    setFavoriteState(data.favorite);
    console.log(favoriteState);
    setFavorite(data);
    };
    const favorite=()=>{
        getSongs();
        updateFavorite();
    }

    let updateFavorite = async() =>{
        console.log(musicFavorite)
        console.log(favoriteState);
        if(musicFavorite==null){
            alert('Wait the music are charging, click again');
        }else{
            if(favoriteState==0){
                await fetch(`https://json-note-server.herokuapp.com/music/${index+1}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({...musicFavorite,'favorite':1})
                })
                alert('The song was added from favorite, please reset the app.')
                    setFavorite(null);
            }else{
                await fetch(`https://json-note-server.herokuapp.com/music/${index+1}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({...musicFavorite,'favorite':0})
                })
                alert('The song was removed from favorite, please reset the app.')
                setFavorite(null);
            }
        }
    };
    useEffect(() => {
        music();
        amolo();
        }, [])
    const renderItem = ({ item }) => {
        return (
            <View style={styles.imgcontainer}>
                <Image style={styles.image} source={{ uri: item.artwork }} />
                <View style={styles.textcontainer}>
                </View>
            </View>
            
        );
    };

    async function amolo(){
        console.log(imageUrl);
        const result = await ImageColors.getColors(imageUrl, {
            fallback: '#228B22',
            cache: false,
            key: 'unique_key',
          })
          setColorImage(result.muted);
          console.log(result)
    }
    useEffect(() => {
        scrollX.addListener(({ value }) => {
            const ind = Math.round(value / width);
            setIndex(ind);
        })
        TrackPlayer.addEventListener(Event.PlaybackTrackChanged,(e)=>console.log(e))
        TrackPlayer.setupPlayer().then(async()=>{
            console.log("Player Ready");
            TrackPlayer.reset()
            size(songs)===0?console.log('wait'):
                await TrackPlayer.add(songs);
                isPlayerReady.current = true;
                TrackPlayer.play();

                await TrackPlayer.updateOptions({
                stopWithApp:true,
                alwaysPauseOnInterruption:true,
                capabilities:[
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.Stop
                ],
                });
                    })
        return () => {
            scrollX.removeAllListeners();
        }
    }, [songs])
    useEffect(()=>{
        if(size(songs)==0){
            console.log('wait')
        }else{
            if(isPlayerReady.current){
                TrackPlayer.skip(songs[index].id-1)
                setImageUrl(songs[index].artwork)
                amolo()
            }
            else{
                console.log('error')
            }
        }
    },[index])


        const goNext = () =>{
            slider.current.scrollToOffset({
                offset: (index+1)*width
            });
        }
        const goPreview = () =>{
            slider.current.scrollToOffset({
                offset: (index-1)*width
            });
        }
        const renderfavorite=()=>{
        switch (favoriteState) {
            case 1:
            return <MaterialIcons name='favorite' size={22} style={{textAlign:'right',left:-40}} color={songs[index].favorite==1?'green':isDarkMode?'white':'black'}/>
            default:
            return <MaterialIcons name='favorite' size={22} style={{textAlign:'right',left:-40}} color={songs[index].favorite==1?'green':isDarkMode?'white':'black'}/>
        }
        }
       return (
        <View style={styles.container}>
            {
                size(songs) === 0 ? (
                    <Text>You don't have songs</Text>
                )
                    :
                    (
                        <SafeAreaView style={{ height: 520 }}>
                            <FlatList
                                data={songs}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                ref={slider}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled
                                scrollEventThrottle={16}
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                    { useNativeDriver: false }
                                )}
                            />
                            <View style={styles.textcontainer}>
                            <RollingText force={true} durationMsPerWidth={25} style={styles.title} delay={490} startDelay={0}>{songs[index].title}</RollingText>
                            </View>
                            <Text style={styles.artist}>{songs[index].artist}</Text>
                            <TouchableOpacity onPress={favorite}>
                            {renderfavorite()}
                            </TouchableOpacity>
                            <SliderComp imageColor={colorImage}/>
                            <Controllers style={{alignItems:'center'}} onNext={goNext} onPrv={goPreview} />
                        </SafeAreaView>
                    )
            }
        </View>
    )
}