import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import FeedVideo from './pages/FeedVideo';

const AppStack = createStackNavigator();

const Routes = () => {
   return (
      <NavigationContainer>
         <AppStack.Navigator headerMode="none" screenOptions={{ cardStyle: { backgroundColor: '#f0f0f5' } }}>
            <AppStack.Screen name="Home" component={Home} />
            <AppStack.Screen name="FeedVideo" component={FeedVideo} />
         </AppStack.Navigator>
      </NavigationContainer>
   );
}

export default Routes;