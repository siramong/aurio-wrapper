import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { useAurio } from "aurio-sdk/hooks";

interface AurioBalancesExampleProps {
  walletAddress: string | null | undefined;
}

export function AurioBalancesExample({ walletAddress }: AurioBalancesExampleProps) {
  const { solBalance, aurBalance, loading, refresh } = useAurio(walletAddress);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aurio SDK</Text>

      <View style={styles.card}>
        <Text style={styles.label}>SOL</Text>
        <Text style={styles.value}>{solBalance.toFixed(4)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>AUR</Text>
        <Text style={styles.value}>{aurBalance.toFixed(6)}</Text>
      </View>

      <Pressable style={styles.button} onPress={refresh}>
        {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Refresh</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 6,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#0f172a",
    paddingHorizontal: 18,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
