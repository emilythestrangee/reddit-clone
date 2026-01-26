import { View, Text, TextInput, Pressable, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";
import { useState } from "react";

import groups from "./assets/data/groups.json";

type Group = {
    id: string;
    name: string;
    image: string;
};

export default function GroupSelector() {
    const [searchValue, setSearchValue] = useState<string>('');

    const filteredGroups = groups.filter((group: Group) => group.name.toLowerCase().includes(searchValue.toLowerCase()));
    
    return (
        <SafeAreaView style={{ marginHorizontal: 10, flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="close" size={30} color="black" onPress={() => router.back()} />
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', flex: 1, paddingRight: 30 }}>
                    Post to
                </Text>
            </View>

            <View style={{ 
                flexDirection: 'row', 
                backgroundColor: 'lightgrey', 
                borderRadius: 5, 
                gap: 5, 
                alignItems: 'center', 
                paddingHorizontal: 5, 
                margin: 10 
            }}>
                <AntDesign name="search" size={16} color="gray" />
                <TextInput 
                    placeholder="Search for a community" 
                    placeholderTextColor="grey" 
                    style={{ paddingVertical: 10, flex: 1 }}
                    value={searchValue}
                    onChangeText={(text) => setSearchValue(text)} 
                />
                {searchValue && (
                    <AntDesign name="close" size={15} color="#E4E4E4" onPress={() => setSearchValue('')} />
                )}
            </View>

            <FlatList
                data={filteredGroups}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 20 }}>
                        <Image source={{ uri: item.image }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                        <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
}