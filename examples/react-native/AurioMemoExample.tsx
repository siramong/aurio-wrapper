import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Transaction } from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo";

interface SignAndSendWallet {
  signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string } | string>;
}

interface AurioMemoExampleProps {
  wallet: SignAndSendWallet | null;
}

export function AurioMemoExample({ wallet }: AurioMemoExampleProps) {
  async function handleSendMemo(): Promise<void> {
    if (!wallet) {
      return;
    }

    const transaction = new Transaction().add(createMemoInstruction("Aurio SDK memo"));
    const result = await wallet.signAndSendTransaction(transaction);
    const signature = typeof result === "string" ? result : result.signature;

    console.log("Memo signature:", signature);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memo example</Text>

      <Pressable style={styles.button} onPress={handleSendMemo}>
        <Text style={styles.buttonText}>Send Memo</Text>
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
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#334155",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
