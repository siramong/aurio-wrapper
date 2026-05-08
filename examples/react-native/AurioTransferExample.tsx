import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Transaction } from "@solana/web3.js";

import { buildAurioTransferTx } from "aurio-sdk";

interface SignAndSendWallet {
  publicKey: { toBase58: () => string } | string;
  signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string } | string>;
}

interface AurioTransferExampleProps {
  wallet: SignAndSendWallet | null;
}

export function AurioTransferExample({ wallet }: AurioTransferExampleProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("1");

  async function handleSend(): Promise<void> {
    if (!wallet) {
      Alert.alert("Wallet missing", "Connect a wallet before sending AUR.");
      return;
    }

    const sender = typeof wallet.publicKey === "string" ? wallet.publicKey : wallet.publicKey.toBase58();
    const transaction = await buildAurioTransferTx({
      sender,
      recipient,
      amount,
    });

    const result = await wallet.signAndSendTransaction(transaction);
    const signature = typeof result === "string" ? result : result.signature;

    console.log("AUR transfer signature:", signature);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer AUR</Text>

      <TextInput
        style={styles.input}
        placeholder="Recipient wallet"
        placeholderTextColor="#94a3b8"
        value={recipient}
        onChangeText={setRecipient}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor="#94a3b8"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Pressable style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Build + Send</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0f172a",
    backgroundColor: "#ffffff",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#0f172a",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
