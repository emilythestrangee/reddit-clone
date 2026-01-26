import { View, Text, TextInput, Pressable, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";
import { useState } from "react";
import { useTheme } from '../contexts/ThemeContext';

import groups from "./assets/data/groups.json";

type Group = {
    id: string;
    name: string;
    image: string;
};

export default function GroupSelector() {
    const [searchValue, setSearchValue] = useState<string>('');
    const { theme } = useTheme();

    const colors = {
        dark: { bg: '#030303', text: '#d7dadc', secondaryText: '#818384', border: '#343536', inputBg: '#1a1a1b' },
        light: { bg: '#ffffff', text: '#030303', secondaryText: '#7c7c7c', border: '#e5e5e5', inputBg: '#f6f7f8' },
    };
    const currentColors = colors[theme];

    const filteredGroups = groups.filter((group: Group) => group.name.toLowerCase().includes(searchValue.toLowerCase()));
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: currentColors.bg }}>
            <View style={{ paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name="close" size={30} color={currentColors.text} onPress={() => router.back()} />
                    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', flex: 1, paddingRight: 30, color: currentColors.text }}>
                        Post to
                    </Text>
                </View>

                <View style={{ 
                    flexDirection: 'row', 
                    backgroundColor: currentColors.inputBg, 
                    borderRadius: 5, 
                    gap: 5, 
                    alignItems: 'center', 
                    paddingHorizontal: 5, 
                    margin: 10 
                }}>
                    <AntDesign name="search" size={16} color={currentColors.secondaryText} />
                    <TextInput 
                        placeholder="Search for a community" 
                        placeholderTextColor={currentColors.secondaryText} 
                        style={{ paddingVertical: 10, flex: 1, color: currentColors.text }}
                        value={searchValue}
                        onChangeText={(text) => setSearchValue(text)} 
                    />
                    {searchValue && (
                        <AntDesign name="close" size={15} color={currentColors.secondaryText} onPress={() => setSearchValue('')} />
                    )}
                </View>
            </View>

            <FlatList
                data={filteredGroups}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 20, paddingHorizontal: 20 }}>
                        <Image source={{ uri: item.image }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                        <Text style={{ fontWeight: '600', color: currentColors.text }}>{item.name}</Text>
                    </Pressable>
                )}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
        </SafeAreaView>
    );
}