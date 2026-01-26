import { Tabs } from "expo-router";
import { AntDesign, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { useRouter } from "expo-router";

export default function TabLayout() {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const colors = {
    dark: { bg: '#030303', text: '#d7dadc', headerBg: '#1a1a1b', tabBg: '#1a1a1b' },
    light: { bg: '#ffffff', text: '#030303', headerBg: '#f6f6f7', tabBg: '#ffffff' },
  };

  const currentColors = colors[theme];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FF5700',
          tabBarInactiveTintColor: currentColors.text,
          headerStyle: {
            backgroundColor: currentColors.headerBg,
            borderBottomWidth: 1,
            borderBottomColor: theme === 'dark' ? '#343536' : '#ccc',
          },
          headerTintColor: currentColors.text,
          tabBarStyle: {
            backgroundColor: currentColors.tabBg,
            borderTopColor: theme === 'dark' ? '#343536' : '#ccc',
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => setSidebarOpen(true)}
              style={{ paddingLeft: 16 }}
            >
              <MaterialIcons name="menu" size={24} color={currentColors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push("../auth/page")} 
              style={{ paddingRight: 16 }}
            >
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: theme === 'dark' ? '#343536' : '#e4e6e8',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <MaterialIcons 
                  name="person-outline" 
                  size={20} 
                  color={theme === 'dark' ? '#d7dadc' : '#878A8C'} 
                />
              </View>
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerTitle: 'Reddit',
            headerTitleStyle: { color: '#FF4500' },
            tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="communities"
          options={{
            title: 'Communities',
            headerTitle: 'Communities',
            tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} />
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            tabBarIcon: ({ color }) => <AntDesign name="plus" size={24} color={color} />,
            headerShown: false,
            tabBarStyle: { display: 'none' }
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            headerTitle: 'Chat',
            tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            title: 'Inbox',
            headerTitle: 'Inbox',
            tabBarIcon: ({ color }) => <Feather name="bell" size={24} color={color} />
          }}
        />
      </Tabs>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}