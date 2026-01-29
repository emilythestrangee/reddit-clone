import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

// Preset Reddit-style avatars
const PRESET_AVATARS = [
  { id: "1", image: require("../../assets/avators/avator1.png"), color: "#FF4500" },
  { id: "2", image: require("../../assets/avators/avator2.png"), color: "#0079D3" },
  { id: "3", image: require("../../assets/avators/avator3.png"), color: "#46D160" },
  { id: "4", image: require("../../assets/avators/avator4.png"), color: "#FF66AC" },
  { id: "5", image: require("../../assets/avators/avator5.png"), color: "#FFB000" },
  { id: "6", image: require("../../assets/avators/avator6.png"), color: "#7193FF" },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets(); // 👈 SAFE AREA FIX

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);

  const colors = {
    dark: {
      bg: "#030303",
      cardBg: "#1a1a1b",
      text: "#d7dadc",
      secondaryText: "#818384",
      border: "#343536",
      inputBg: "#272729",
    },
    light: {
      bg: "#ffffff",
      cardBg: "#f6f7f8",
      text: "#030303",
      secondaryText: "#7c7c7c",
      border: "#e5e5e5",
      inputBg: "#f6f7f8",
    },
  };

  const currentColors = colors[theme];

  const generateRandomUsername = () => {
    const adjectives = ["Happy", "Cool", "Epic", "Super", "Brave", "Swift"];
    const nouns = ["Panda", "Wolf", "Fox", "Dragon", "Tiger"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${
      nouns[Math.floor(Math.random() * nouns.length)]
    }${Math.floor(Math.random() * 1000)}`;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!username) setUsername(generateRandomUsername());
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <>
      {/* 🚫 HEADER DISABLED */}
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={[
          styles.container,
          {
            backgroundColor: currentColors.bg,
            paddingTop: insets.top + 16, // ✅ CONTENT PUSHED DOWN
          },
        ]}
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, step >= 1 && styles.active]} />
          <View style={[styles.progressLine, step >= 2 && styles.active]} />
          <View style={[styles.progressDot, step >= 2 && styles.active]} />
          <View style={[styles.progressLine, step >= 3 && styles.active]} />
          <View style={[styles.progressDot, step >= 3 && styles.active]} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* STEP 1 */}
          {step === 1 && (
            <View style={styles.step}>
              <Text style={[styles.title, { color: currentColors.text }]}>
                Choose your username
              </Text>

              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor={currentColors.secondaryText}
                style={[
                  styles.input,
                  {
                    backgroundColor: currentColors.inputBg,
                    color: currentColors.text,
                    borderColor: currentColors.border,
                  },
                ]}
              />

              <Pressable onPress={() => setUsername(generateRandomUsername())}>
                <Text style={styles.random}>Generate random username</Text>
              </Pressable>

              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Display name (optional)"
                placeholderTextColor={currentColors.secondaryText}
                style={[
                  styles.input,
                  {
                    marginTop: 20,
                    backgroundColor: currentColors.inputBg,
                    color: currentColors.text,
                    borderColor: currentColors.border,
                  },
                ]}
              />
            </View>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <View style={styles.step}>
              <View
                style={[
                  styles.avatarBig,
                  { backgroundColor: selectedAvatar.color },
                ]}
              >
                <Image source={selectedAvatar.image} style={styles.avatarImg} />
              </View>

              <View style={styles.avatarGrid}>
                {PRESET_AVATARS.map((a) => (
                  <Pressable
                    key={a.id}
                    onPress={() => setSelectedAvatar(a)}
                    style={[
                      styles.avatarSmall,
                      { backgroundColor: a.color },
                      selectedAvatar.id === a.id && styles.avatarSelected,
                    ]}
                  >
                    <Image source={a.image} style={styles.avatarImg} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <View style={styles.step}>
              <View
                style={[
                  styles.preview,
                  {
                    backgroundColor: currentColors.cardBg,
                    borderColor: currentColors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.avatarBig,
                    { backgroundColor: selectedAvatar.color },
                  ]}
                >
                  <Image source={selectedAvatar.image} style={styles.avatarImg} />
                </View>

                <Text style={{ color: currentColors.text, fontSize: 20 }}>
                  u/{username}
                </Text>

                {displayName ? (
                  <Text style={{ color: currentColors.secondaryText }}>
                    {displayName}
                  </Text>
                ) : null}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom */}
        <View
          style={[
            styles.bottom,
            {
              borderTopColor: currentColors.border,
              paddingBottom: insets.bottom + 12, // 👈 SAFE BOTTOM
            },
          ]}
        >
          <Pressable onPress={handleSkip}>
            <Text style={{ color: currentColors.secondaryText }}>Skip</Text>
          </Pressable>

          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>
              {step === 3 ? "Finish" : "Next"}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#343536",
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: "#343536",
    alignSelf: "center",
  },
  active: { backgroundColor: "#FF4500" },
  content: { padding: 20, paddingBottom: 140 },
  step: { alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    marginBottom: 10,
  },
  random: { color: "#FF4500", marginBottom: 10 },
  avatarBig: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 30,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "center",
  },
  avatarSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
  },
  avatarSelected: {
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarImg: { width: "100%", height: "100%" },
  preview: {
    padding: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    backgroundColor: "transparent",
  },
  nextBtn: {
    backgroundColor: "#FF4500",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextText: { color: "#fff", fontWeight: "bold" },
});
