import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';

import Feed from '../Feed';

interface ApiFeedResponse {
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
}

const Home = () => {
   // Init States
   const [soccerFeed, setSoccerFeed] = useState<ApiFeedResponse[]>([]);
   const [fromNum, setFromNum] = useState<number>(0);
   const [toNum, setToNum] = useState<number>(7);
   const [loading, setLoading] = useState<boolean>(false);
   const [refreshing, setRefreshing] = useState<boolean>(false);
   const [timesRefreshed, setTimesRefreshed] = useState<number>(0);

   // Function to load more items while scrolling DOWN
   function loadFeed() {
      if (loading) {
         return;
      }

      setLoading(true);

      // Get Data from API
      axios.get<ApiFeedResponse[]>('https://www.scorebat.com/video-api/v1/')
         .then(response => {
            const feedData = response.data.slice(fromNum, toNum).map(video => {
               return {
                  title: video.title,
                  thumbnail: video.thumbnail,
                  date: video.date,
                  competition: {
                     name: video.competition.name
                  },
                  videos: video.videos,
               }
            });

            // Add loaded data & update values 
            setSoccerFeed([...soccerFeed, ...feedData]);
            setFromNum(toNum + 1);
            setToNum(toNum + 7);

            setLoading(false);
         })
         .catch(error => console.log(error));

   }

   // First time load
   useEffect(() => {
      loadFeed();
   }, []);


   // Refreshing when scrolling UP
   function onRefresh() {
      // Reset Values
      setSoccerFeed([]);
      setFromNum(0);
      setToNum(7);
      setTimesRefreshed(timesRefreshed + 1); // Sum num of times refreshed and call API call again
   }

   // On "timesRefreshed" change
   useEffect(() => {

      setRefreshing(true);

      // Get Data from API
      axios.get<ApiFeedResponse[]>('https://www.scorebat.com/video-api/v1/')
         .then(response => {
            const feedData = response.data.slice(fromNum, toNum).map(video => {
               return {
                  title: video.title,
                  thumbnail: video.thumbnail,
                  date: video.date,
                  competition: {
                     name: video.competition.name
                  },
                  videos: video.videos,
               }
            });

            // Add loaded data & update values 
            setSoccerFeed([...soccerFeed, ...feedData]);
            setFromNum(toNum + 1);
            setToNum(toNum + 7);

            setRefreshing(false);
         })
         .catch(error => console.warn(error));

   }, [timesRefreshed]);


   return (
      <View style={styles.container}>
         <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>FuTv</Text>
         </View>

         <FlatList
            data={soccerFeed}
            keyExtractor={(item, index) => `key_${index}`}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            onEndReached={loadFeed}
            // onEndReachedThreshold={0.3} // 30%
            renderItem={({ item }) => (
               <Feed feedItem={item} />
            )}
            refreshControl={
               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
         />
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
   },

   headerTitle: {
      fontSize: 36,
      fontFamily: 'Ubuntu_700Bold',
   },
});

export default Home;