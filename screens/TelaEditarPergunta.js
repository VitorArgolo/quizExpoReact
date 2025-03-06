import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";

export default function TelaEditarPergunta({ setTela, db, perguntaSelecionada }) {
  const [novaPergunta, setNovaPergunta] = useState(perguntaSelecionada.pergunta);
  const [alternativas, setAlternativas] = useState([]);
  const [correta, setCorreta] = useState(null);

  useEffect(() => {
    carregarAlternativas();
  }, []);

  async function carregarAlternativas() {
    try {
      const resultado = await db.getAllAsync("SELECT * FROM alternativas WHERE pergunta_id = ?", [
        perguntaSelecionada.id,
      ]);
      setAlternativas(resultado);
      const indexCorreta = resultado.findIndex((alt) => alt.correta === 1);
      setCorreta(indexCorreta);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar alternativas.");
    }
  }

  async function salvarEdicao() {
    if (!novaPergunta.trim() || alternativas.some((alt) => alt.alternativa.trim() === "")) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (correta === null) {
      Alert.alert("Erro", "Selecione a alternativa correta!");
      return;
    }

    try {
      await db.runAsync("UPDATE perguntas SET pergunta = ? WHERE id = ?", [novaPergunta, perguntaSelecionada.id]);

      for (let i = 0; i < alternativas.length; i++) {
        await db.runAsync(
          "UPDATE alternativas SET alternativa = ?, correta = ? WHERE id = ?",
          [alternativas[i].alternativa, i === correta ? 1 : 0, alternativas[i].id]
        );
      }

      Alert.alert("Sucesso", "Pergunta atualizada!");
      setTela("listaPerguntas");
    } catch (error) {
      Alert.alert("Erro", "Falha ao editar pergunta.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>✏️ Editar Pergunta</Text>

      <Text style={styles.label}>Pergunta:</Text>
      <TextInput
        style={styles.input}
        value={novaPergunta}
        onChangeText={setNovaPergunta}
        placeholder="Digite a pergunta"
        placeholderTextColor="#ccc"
      />

      <Text style={styles.label}>Alternativas:</Text>
      {alternativas.map((alt, index) => (
        <View key={alt.id} style={[styles.alternativaContainer, correta === index ? styles.alternativaSelecionada : null]}>
          <TextInput
            style={styles.inputAlternativa}
            value={alt.alternativa}
            onChangeText={(text) => {
              let novasAlternativas = [...alternativas];
              novasAlternativas[index].alternativa = text;
              setAlternativas(novasAlternativas);
            }}
            placeholder={`Alternativa ${index + 1}`}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={[styles.botaoCorreta, correta === index ? styles.botaoSelecionado : null]}
            onPress={() => setCorreta(index)}
          >
            <Text style={styles.textoBotao}>{correta === index ? "✔" : " "}</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.botao} onPress={salvarEdicao}>
        <Text style={styles.textoBotao}>💾 Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => setTela("listaPerguntas")}>
        <Text style={styles.textoBotao}>🔙 Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", backgroundColor: "#1E1E2F", padding: 20 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 18, color: "#bbb", alignSelf: "flex-start", marginBottom: 5 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#2E2E3D",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginBottom: 10,
  },
  alternativaContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  alternativaSelecionada: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  inputAlternativa: {
    flex: 1,
    height: 45,
    backgroundColor: "#444",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#fff",
  },
  botaoCorreta: {
    width: 40,
    height: 40,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 10,
  },
  botaoSelecionado: {
    backgroundColor: "#4CAF50",
  },
  botao: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  botaoVoltar: {
    backgroundColor: "#D32F2F",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});
