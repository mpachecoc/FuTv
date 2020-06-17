import React, { memo, useState } from 'react';
import { 
   View, 
   Text, 
   StyleSheet, 
   Image, 
   TouchableOpacity, 
   Modal, 
   ActivityIndicator, 
   Dimensions,
   Platform,
   NativeModules 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

interface Props {
   feedItem: {
      title: string;
      thumbnail: string;
      date: string;
      competition: {
         name: string;
      };
      videos: {
         title: string;
         embed: string;
      }[];
   };
}

const Feed: React.FC<Props> = ({ feedItem }) => {
   
   // Init States
   const navigation = useNavigation();
   const [modalVisible, setModalVisible] = useState(false);

   // Navigate or display (if 1 video)
   function navigateToVideos(videos: {}[]) {
      
      if (videos.length > 1) {
         navigation.navigate('FeedVideo', { videos: videos });
      } else {
         setModalVisible(true);
      }

   }

   // Format Date
   function formatDate(inDate: string) {
      const stringDate = inDate.split('+')[0]; 
      const date = new Date(stringDate); 
      
      const options = { 
         month: "long", 
         day: "numeric", 
         year: "numeric",
         hour: 'numeric',
         minute: 'numeric'
      };

      const deviceLanguage = 
         Platform.OS === 'ios'
         ? NativeModules.SettingsManager.settings.AppleLanguages[0]
         : NativeModules.I18nManager.localeIdentifier;


      // Resolve "Invalid regular expression" error
      if (Platform.OS === "android") {
         if (typeof (Intl as any).__disableRegExpRestore === "function") {
               (Intl as any).__disableRegExpRestore();
         }
      }

      return Intl.DateTimeFormat('es-ES', options).format(date);
      // return Intl.DateTimeFormat(deviceLanguage, options).format(date);
   }

   return (
      <View style={styles.feedContainer}>
         <Text style={styles.feedTitle}>{feedItem.title}</Text>
         <Text style={styles.feedSubTitle}>{feedItem.competition.name}</Text>
         <Text style={styles.feedDate}>{formatDate(feedItem.date)}</Text>
         <TouchableOpacity onPress={() => navigateToVideos(feedItem.videos)}>
            <Image source={{ uri: feedItem.thumbnail }} style={styles.feedThumbnailContainer} />
            <View style={styles.playIconContainer}>
               <Feather name="play" size={54} color="#FCF1EE" />
            </View>
         </TouchableOpacity>

         <Modal
            animationType= "fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {}}
         >
            <View style={styles.modalContainer}>
               <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(!modalVisible)}>
                  <Feather name="x-circle" size={36} color="#FCF1EE" />
               </TouchableOpacity>
               <View style={styles.modalView}>
                  <WebView
                     source={{ uri: String(feedItem.videos[0].embed.split('src=\'').pop()?.split('\' frameborder').shift()) }}
                     style={styles.modalVideoContainer}
                     startInLoadingState={true}
                     renderLoading={() => (
                        <View style={styles.modalSpinnerContainer}>
                           <ActivityIndicator color='#E82041' size='small' />
                        </View>
                     )}
                  />
               </View>
            </View>
         </Modal>
      </View>
   );
}

const styles = StyleSheet.create({
   feedContainer: {
      marginTop: 16,
      marginBottom: 30,
   },

   feedTitle: {
      fontSize: 20,
      fontFamily: 'Roboto_500Medium',
      paddingLeft: 10,
   },

   feedSubTitle: {
      fontSize: 12,
      fontFamily: 'Roboto_400Regular',
      paddingTop: 3,
      paddingLeft: 10,
      color: '#6C6C80'
   },
   
   feedDate: {
      fontSize: 12,
      fontFamily: 'Roboto_400Regular',
      paddingTop: 3,
      paddingBottom: 10,
      paddingLeft: 10,
      color: '#6C6C80'
   },

   feedThumbnailContainer: {
      width: '100%',
      height: 190,
      resizeMode: 'cover',
   },

   playIconContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
   },


   modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
   },

   modalCloseBtn: {
      position: 'absolute',
      left: 15,
      right: 0,
      top: 20,
      bottom: 0,
   },

   modalView: {
      // width: '100%',
      height: 190,
      alignItems: "center",
   },

   modalVideoContainer: {
      width: Dimensions.get('window').width,
      height: 190,
      resizeMode: 'cover',
   },

   modalSpinnerContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
   },
});

export default memo(Feed);