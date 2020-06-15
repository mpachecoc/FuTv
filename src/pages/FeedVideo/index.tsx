import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

// import from './styles';

interface Params {
   videos: {
      title: string;
      embed: string;
   }[];
}

const FeedVideo = () => {
   const navigation = useNavigation();
   const route = useRoute();

   const routeParams = route.params as Params;

   function navigateBack() {
      navigation.goBack();
   }

   return (
      <View style={styles.container}>
         <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>FuTv</Text>

            <TouchableOpacity onPress={navigateBack}>
               <Feather name="arrow-left" size={28} color="#E82041" />
            </TouchableOpacity>
         </View>
         
         <View style={styles.feedContainer}>
            <ScrollView>
               { routeParams.videos.map(video => (
                  <View key={video.title}>
                     <Text style={styles.feedHighlight}>{video.title}</Text>
                     <WebView 
                        source={{ uri: String(video.embed.split('src=\'').pop()?.split('\' frameborder').shift()) }}
                        style={styles.feedVideoContainer} 
                        startInLoadingState={true}
                        renderLoading={() => (
                           <View style={styles.spinnerContainer}>
                              <ActivityIndicator color='#E82041' size='small' />
                           </View>
                        )}
                     />
                  </View>
               )) }
            </ScrollView>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: 10 + Constants.statusBarHeight,
   },

   headerContainer: {
      paddingHorizontal: 24,
      paddingBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
   },

   headerTitle: {
      fontSize: 36,
      fontFamily: 'Ubuntu_700Bold',
   },

   feedContainer: {
      marginBottom: 30,
   },

   feedHighlight: {
      fontSize: 20,
      fontFamily: 'Roboto_500Medium',
      paddingBottom: 10,
      alignSelf: 'center',
      marginTop: 30,
   },

   feedVideoContainer: {
      width: '100%',
      height: 190,
      resizeMode: 'cover',
   },

   spinnerContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
   },
});

export default FeedVideo;