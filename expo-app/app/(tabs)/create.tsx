import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { Link, router } from "expo-router"
import { useTheme } from '../../contexts/ThemeContext';

export default function CreateScreen() {
  const { theme } = useTheme();
  const [title, setTitle] = useState<string>('')
  const [body, setBody] = useState<string>('')

  const colors = {
    dark: { bg: '#030303', text: '#d7dadc', inputBg: '#1a1a1b', border: '#343536' },
    light: { bg: '#ffffff', text: '#030303', inputBg: '#f6f7f8', border: '#e5e5e5' },
  };
  const currentColors = colors[theme];

  const goBack = () => {
    setTitle('')
    setBody('')
    router.back()
  }
  
  return (
    <SafeAreaView style={{ backgroundColor: currentColors.bg, flex: 1, paddingHorizontal: 10 }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <AntDesign name="close" size={30} color={currentColors.text} onPress={() => router.back()} />
        <Pressable onPress={() => console.error('Pressed')} style={{ marginLeft: 'auto'}}>
          <Text style={styles.postText}>Post</Text>
        </Pressable>
      </View>

    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 10}}>
      {/* Community Selector */}
      <Link href={"groupSelector" as any} asChild>
        <Pressable style={styles.communityContainer}>
          <Text style={styles.rStyles}>r/</Text>
          <Text style={{ fontWeight: '600', color: '#1a1a1b' }}>Select a Community</Text>
        </Pressable>
      </Link>

      {/* Post Input */}
      <TextInput
        placeholder="Title"
        placeholderTextColor={theme === 'dark' ? '#818384' : '#a0a0a0'}
        style={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 20, color: currentColors.text }} 
        value={title}
        onChangeText={(text) => setTitle(text)} 
        multiline 
        scrollEnabled={false} />

      <TextInput
        placeholder="body text (optional)"
        placeholderTextColor={theme === 'dark' ? '#818384' : '#a0a0a0'}
        style={{ color: currentColors.text }} 
        value={body}
        onChangeText={(text) => setBody(text)} 
        multiline
        scrollEnabled={false} />
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  postText: {
    color: 'white',
    backgroundColor: '#115BCA',
    fontWeight: 'bold',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 10,
  },

  rStyles: {
    color: 'white',
    backgroundColor: 'black',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10, 
    fontWeight: 'bold',
  },

  communityContainer: {
    backgroundColor: '#EDEDED',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
    gap: 5,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
})