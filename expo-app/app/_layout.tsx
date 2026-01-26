import { Redirect, router, Stack } from 'expo-router';
import { View } from 'react-native';
import { AntDesign, MaterialIcons, Entypo } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="groupSelector" options={{ headerShown: false }} />
      <Stack.Screen name="post/[id]" options={{
         headerTitle: '',
         headerStyle: { backgroundColor: '#FF5700' },
         headerLeft: () => <AntDesign name="close" size={24} color="white" onPress={() => router.back()} />,
         headerRight: () => 
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <AntDesign name="search" size={24} color="white" />
                <MaterialIcons name="sort" size={24} color="white" />
                <Entypo name="dots-three-vertical" size={24} color="white" />
            </View>,
        animation: 'slide_from_bottom',

      }} />
    </Stack>
  );
}