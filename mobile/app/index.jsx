import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(113, 197, 166, 1)",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href={"/about"}>About</Link>
    </View>
  );
}
