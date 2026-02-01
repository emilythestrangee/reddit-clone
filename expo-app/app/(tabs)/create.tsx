import { useState, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from "expo-router"
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import postService from '../../services/postService';

type MediaType = 'image' | 'gif' | 'video' | null;

export default function CreateScreen() {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState<string>('')
  const [body, setBody] = useState<string>('')
  const [mediaUri, setMediaUri] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<MediaType>(null)
  const [link, setLink] = useState<string>('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showFormattingModal, setShowFormattingModal] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [selectedCommunity, setSelectedCommunity] = useState<string>('r/')
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const bodyInputRef = useRef<TextInput>(null)

  const player = useVideoPlayer(mediaUri && mediaType === 'video' ? mediaUri : '', (player) => {
    player.loop = true;
  });

  const colors = {
    dark: { bg: '#030303', text: '#d7dadc', inputBg: '#1a1a1b', border: '#343536' },
    light: { bg: '#ffffff', text: '#030303', inputBg: '#f6f7f8', border: '#e5e5e5' },
  };
  const currentColors = colors[theme];

  // ✅ CHECK AUTH - If not authenticated, show login prompt
  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={{ backgroundColor: currentColors.bg, flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF5700" />
        <Text style={{ color: currentColors.text, fontSize: 20, fontWeight: 'bold', marginTop: 16, textAlign: 'center' }}>
          Login Required
        </Text>
        <Text style={{ color: theme === 'dark' ? '#818384' : '#7c7c7c', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
          You need to be logged in to create a post
        </Text>
        <Pressable 
          onPress={() => router.push('/auth/page' as any)}
          style={{ 
            backgroundColor: '#FF5700', 
            paddingHorizontal: 32, 
            paddingVertical: 12, 
            borderRadius: 24, 
            marginTop: 24 
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Go to Login</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const goBack = () => {
    setTitle('')
    setBody('')
    setMediaUri(null)
    setMediaType(null)
    setLink('')
    router.back()
  }

  // Unified media picker
  const pickMedia = async (type: 'image' | 'video' | 'gif' | 'camera') => {
    try {
      let result;

      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.8,
        });
      } else if (type === 'video') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['videos'],
          allowsEditing: true,
          quality: 0.8,
        });
      } else if (type === 'gif') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          allowsEditing: false,
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: undefined,
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        const asset = result.assets[0];
        setMediaUri(asset.uri);
        
        if (asset.type === 'video' || asset.uri.match(/\.(mp4|mov|avi|mkv)$/i)) {
          setMediaType('video');
        } else if (asset.uri.toLowerCase().endsWith('.gif')) {
          setMediaType('gif');
        } else {
          setMediaType('image');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media');
    }
  }

  // Handle link
  const handleAddLink = () => {
    if (linkInput.trim()) {
      if (!linkInput.startsWith('http://') && !linkInput.startsWith('https://')) {
        Alert.alert('Invalid URL', 'Please enter a valid URL starting with http:// or https://');
        return;
      }
      setLink(linkInput);
      setLinkInput('');
      setShowLinkModal(false);
    } else {
      Alert.alert('Error', 'Please enter a valid link');
    }
  }

  // Handle text formatting with selection support
  const handleTextFormat = (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'quote') => {
    const start = selection.start;
    const end = selection.end;
    
    const textBefore = body.substring(0, start);
    const selectedText = body.substring(start, end);
    const textAfter = body.substring(end);
    
    let newText = '';
    let placeholder = '';
    
    switch (format) {
      case 'bold':
        placeholder = selectedText || 'bold text';
        newText = textBefore + '**' + placeholder + '**' + textAfter;
        break;
      case 'italic':
        placeholder = selectedText || 'italic text';
        newText = textBefore + '*' + placeholder + '*' + textAfter;
        break;
      case 'underline':
        placeholder = selectedText || 'underlined text';
        newText = textBefore + '__' + placeholder + '__' + textAfter;
        break;
      case 'strikethrough':
        placeholder = selectedText || 'strikethrough text';
        newText = textBefore + '~~' + placeholder + '~~' + textAfter;
        break;
      case 'code':
        placeholder = selectedText || 'code';
        newText = textBefore + '`' + placeholder + '`' + textAfter;
        break;
      case 'quote':
        newText = textBefore + '\n> ' + (selectedText || '') + textAfter;
        break;
    }
    
    setBody(newText);
    setShowFormattingModal(false);
    
    setTimeout(() => {
      bodyInputRef.current?.focus();
    }, 100);
  }

  // Handle post creation
  const handleCreatePost = async () => {
    // Double check authentication
    if (!isAuthenticated || !user) {
      Alert.alert('Error', 'You must be logged in to create a post', [
        { text: 'Login', onPress: () => router.replace('/auth/page' as any) }
      ]);
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    setIsPosting(true);
    try {
      const postData = {
        title: title.trim(),
        content: body.trim() || undefined,
        body: body.trim() || undefined,
        image: mediaUri || undefined,
      };

      console.log('📝 Creating post:', postData);

      const response = await postService.createPost(postData);
      
      console.log('✅ Post created successfully:', response);
      
      Alert.alert('Success', 'Post created successfully!', [
        { text: 'OK', onPress: goBack }
      ]);
    } catch (error: any) {
      console.error('❌ Create post error:', error);
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => router.replace('/auth/page' as any) }
          ]
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to create post');
      }
    } finally {
      setIsPosting(false);
    }
  }
  
  return (
    <SafeAreaView style={{ backgroundColor: currentColors.bg, flex: 1, paddingHorizontal: 10 }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <AntDesign name="close" size={30} color={currentColors.text} onPress={() => goBack()} />
        <Pressable onPress={handleCreatePost} disabled={isPosting} style={{ marginLeft: 'auto'}}>
          {isPosting ? (
            <ActivityIndicator color="#115BCA" />
          ) : (
            <Text style={styles.postText}>Post</Text>
          )}
        </Pressable>
      </View>

    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 10}}>
      {/* Community Selector */}
      <Pressable 
        onPress={() => router.push('/groupSelector' as any)}
        style={styles.communityContainer}
      >
        <Text style={styles.rStyles}>r/</Text>
        <Text style={{ fontWeight: '600', color: '#1a1a1b' }}>Select a Community</Text>
      </Pressable>

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
        ref={bodyInputRef}
        placeholder="body text (optional)"
        placeholderTextColor={theme === 'dark' ? '#818384' : '#a0a0a0'}
        style={{ color: currentColors.text, minHeight: 100 }} 
        value={body}
        onChangeText={(text) => setBody(text)}
        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
        multiline
        scrollEnabled={false} />

      {/* Media Preview */}
      {mediaUri && (
        <View style={{ marginVertical: 15, position: 'relative' }}>
          {mediaType === 'video' ? (
            <View>
              <VideoView
                player={player}
                style={{ width: '100%', height: 300, borderRadius: 12 }}
                allowsPictureInPicture
              />
              <View style={{ 
                position: 'absolute', 
                top: 12, 
                left: 12, 
                backgroundColor: 'rgba(0,0,0,0.7)', 
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10, 
                paddingVertical: 6, 
                borderRadius: 6,
                gap: 4 
              }}>
                <Ionicons name="videocam" size={14} color="white" />
                <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>VIDEO</Text>
              </View>
            </View>
          ) : (
            <Image 
              source={{ uri: mediaUri }} 
              style={{ width: '100%', height: 250, borderRadius: 12 }}
              contentFit="contain"
            />
          )}
          {mediaType === 'gif' && (
            <View style={{ 
              position: 'absolute', 
              top: 12, 
              left: 12, 
              backgroundColor: 'rgba(0,0,0,0.7)', 
              paddingHorizontal: 10, 
              paddingVertical: 6, 
              borderRadius: 6 
            }}>
              <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>GIF</Text>
            </View>
          )}
          <Pressable 
            onPress={() => {
              setMediaUri(null);
              setMediaType(null);
            }}
            style={{ marginTop: 10, padding: 8, backgroundColor: '#dc3545', borderRadius: 8 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              Remove {mediaType === 'video' ? 'Video' : mediaType === 'gif' ? 'GIF' : 'Image'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Link Display */}
      {link && (
        <View style={{ 
          marginVertical: 10, 
          padding: 12, 
          backgroundColor: currentColors.inputBg, 
          borderRadius: 8,
          borderLeftWidth: 3,
          borderLeftColor: '#115BCA'
        }}>
          <Text style={{ color: '#115BCA', fontWeight: 'bold', marginBottom: 4 }}>Link Added</Text>
          <Text style={{ color: currentColors.text, fontSize: 12 }} numberOfLines={1}>{link}</Text>
          <Pressable 
            onPress={() => setLink('')}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: '#dc3545', fontSize: 12 }}>Remove</Text>
          </Pressable>
        </View>
      )}

      </ScrollView>

      {/* Emoji Picker Modal */}
      <Modal visible={showEmojiPicker} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: currentColors.bg, padding: 15, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ color: currentColors.text, fontSize: 16, fontWeight: 'bold' }}>Add Emoji</Text>
                <Pressable onPress={() => setShowEmojiPicker(false)}>
                  <AntDesign name="close" size={24} color={currentColors.text} />
                </Pressable>
              </View>
              <View style={{ maxHeight: 300 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                  {['😀', '😂', '🤣', '😊', '😍', '🥰', '😎', '🤔', '😮', '😢', '😭', '😡', '🤯', '🥳', '🤩',
                    '👍', '👎', '👏', '🙌', '💪', '🙏', '❤️', '💔', '💯', '🔥', '✨', '⭐', '🎉', '🎊', '🚀'].map((emoji) => (
                    <Pressable
                      key={emoji}
                      onPress={() => {
                        setBody(body + emoji);
                        setShowEmojiPicker(false);
                      }}
                      style={{ padding: 10 }}
                    >
                      <Text style={{ fontSize: 32 }}>{emoji}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Link Modal */}
      <Modal visible={showLinkModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: currentColors.bg, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Text style={{ color: currentColors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Add Link</Text>
            <TextInput
              placeholder="https://example.com"
              placeholderTextColor={theme === 'dark' ? '#818384' : '#a0a0a0'}
              value={linkInput}
              onChangeText={setLinkInput}
              autoCapitalize="none"
              keyboardType="url"
              style={{
                backgroundColor: currentColors.inputBg,
                color: currentColors.text,
                padding: 12,
                borderRadius: 8,
                marginBottom: 15,
                borderWidth: 1,
                borderColor: currentColors.border,
              }}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable 
                onPress={() => {
                  setLinkInput('');
                  setShowLinkModal(false);
                }}
                style={{ flex: 1, padding: 12, backgroundColor: currentColors.inputBg, borderRadius: 8 }}
              >
                <Text style={{ color: currentColors.text, textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
              </Pressable>
              <Pressable 
                onPress={handleAddLink}
                style={{ flex: 1, padding: 12, backgroundColor: '#115BCA', borderRadius: 8 }}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Text Formatting Modal */}
      <Modal visible={showFormattingModal} transparent animationType="fade">
        <Pressable 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setShowFormattingModal(false)}
        >
          <View style={{ 
            backgroundColor: currentColors.bg, 
            borderRadius: 12, 
            padding: 20, 
            width: '80%',
            maxWidth: 300
          }}>
            <Text style={{ 
              color: currentColors.text, 
              fontSize: 18, 
              fontWeight: 'bold', 
              marginBottom: 20,
              textAlign: 'center'
            }}>Text Formatting</Text>
            
            <Pressable 
              onPress={() => handleTextFormat('bold')}
              style={{ 
                backgroundColor: currentColors.inputBg,
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: currentColors.border
              }}
            >
              <Text style={{ color: currentColors.text, fontSize: 16, fontWeight: 'bold' }}>Bold</Text>
              <Text style={{ color: theme === 'dark' ? '#818384' : '#666', fontSize: 12, marginTop: 4 }}>
                **bold text**
              </Text>
            </Pressable>

            <Pressable 
              onPress={() => handleTextFormat('italic')}
              style={{ 
                backgroundColor: currentColors.inputBg,
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: currentColors.border
              }}
            >
              <Text style={{ color: currentColors.text, fontSize: 16, fontStyle: 'italic' }}>Italic</Text>
              <Text style={{ color: theme === 'dark' ? '#818384' : '#666', fontSize: 12, marginTop: 4 }}>
                *italic text*
              </Text>
            </Pressable>

            <Pressable 
              onPress={() => handleTextFormat('underline')}
              style={{ 
                backgroundColor: currentColors.inputBg,
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: currentColors.border
              }}
            >
              <Text style={{ color: currentColors.text, fontSize: 16, textDecorationLine: 'underline' }}>Underline</Text>
              <Text style={{ color: theme === 'dark' ? '#818384' : '#666', fontSize: 12, marginTop: 4 }}>
                __underlined text__
              </Text>
            </Pressable>

            <Pressable 
              onPress={() => handleTextFormat('strikethrough')}
              style={{ 
                backgroundColor: currentColors.inputBg,
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: currentColors.border
              }}
            >
              <Text style={{ color: currentColors.text, fontSize: 16, textDecorationLine: 'line-through' }}>Strikethrough</Text>
              <Text style={{ color: theme === 'dark' ? '#818384' : '#666', fontSize: 12, marginTop: 4 }}>
                ~~strikethrough text~~
              </Text>
            </Pressable>

            <Pressable 
              onPress={() => handleTextFormat('code')}
              style={{ 
                backgroundColor: currentColors.inputBg,
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: currentColors.border
              }}
            >
              <Text style={{ color: currentColors.text, fontSize: 16, fontFamily: 'monospace' }}>Code</Text>
              <Text style={{ color: theme === 'dark' ? '#818384' : '#666', fontSize: 12, marginTop: 4 }}>
                `code`
              </Text>
            </Pressable>

            <Pressable 
              onPress={() => handleTextFormat('quote')}
              style={{ 
                backgroundColor: currentColors.inputBg,
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: currentColors.border
              }}
            >
              <Text style={{ color: currentColors.text, fontSize: 16 }}>Quote</Text>
              <Text style={{ color: theme === 'dark' ? '#818384' : '#666', fontSize: 12, marginTop: 4 }}>
                {'> quoted text'}
              </Text>
            </Pressable>

            <Pressable 
              onPress={() => setShowFormattingModal(false)}
              style={{ 
                padding: 12,
                borderRadius: 8,
                marginTop: 8
              }}
            >
              <Text style={{ color: '#dc3545', textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Bottom Action Bar */}
      <View style={[styles.actionBar, { borderTopColor: currentColors.border }]}>
        {/* Link Button */}
        <Pressable 
          style={styles.actionButton}
          onPress={() => setShowLinkModal(true)}
        >
          <Ionicons name="link" size={24} color={currentColors.text} />
        </Pressable>

        {/* Image/Video/GIF Button */}
        <Pressable 
          style={styles.actionButton}
          onPress={() => {
            Alert.alert('Add Media', 'Choose an option', [
              { text: 'Photo', onPress: () => pickMedia('image') },
              { text: 'Video', onPress: () => pickMedia('video') },
              { text: 'GIF', onPress: () => pickMedia('gif') },
              { text: 'Camera', onPress: () => pickMedia('camera') },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }}
        >
          <Ionicons name="image-outline" size={24} color={currentColors.text} />
        </Pressable>

        {/* Emoji Button */}
        <Pressable 
          style={styles.actionButton}
          onPress={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Ionicons name="happy-outline" size={24} color={currentColors.text} />
        </Pressable>

        {/* Text Formatting Button */}
        <Pressable 
          style={styles.actionButton}
          onPress={() => setShowFormattingModal(true)}
        >
          <Ionicons name="text" size={24} color={currentColors.text} />
        </Pressable>
      </View>
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

  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  actionButton: {
    padding: 8,
  },
})