import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Ícones para botões
import DropDownPicker from "react-native-dropdown-picker"; // DropDown para selecionar o tema

export default function TelaCadastroPergunta({ setTela, db }) {
  const [pergunta, setPergunta] = useState("");
  const [temaSelecionado, setTemaSelecionado] = useState(null);
  const [open, setOpen] = useState(false);
  const [temas, setTemas] = useState([]);
  const [alternativas, setAlternativas] = useState(["", "", "", ""]);
  const [correta, setCorreta] = useState(null);

  useEffect(() => {
    if (db) {
      carregarTemas();
    }
  }, [db]);

  async function carregarTemas() {
    try {
      console.log("📌 Buscando temas...");
      const temasCadastrados = await db.getAllAsync("SELECT * FROM temas");
      if (!temasCadastrados) throw new Error("Nenhum tema encontrado.");

      const formatado = temasCadastrados.map((tema) => ({
        label: tema.nome,
        value: tema.id,
      }));
      setTemas(formatado);
      console.log("✅ Temas carregados:", formatado);
    } catch (error) {
      console.error("❌ Erro ao carregar temas:", error);
      Alert.alert("Erro", "Falha ao carregar temas.");
    }
  }

  async function adicionarPergunta() {
    console.log("📌 Iniciando cadastro da pergunta...");

    if (!temaSelecionado) {
      Alert.alert("Erro", "Selecione um tema antes de adicionar uma pergunta.");
      return;
    }

    if (!pergunta.trim() || alternativas.some((alt) => alt.trim() === "")) {
      Alert.alert("Erro", "Preencha todos os campos da pergunta e das alternativas!");
      return;
    }

    if (correta === null) {
      Alert.alert("Erro", "Selecione a alternativa correta!");
      return;
    }

    try {
      console.log("📌 Inserindo pergunta:", pergunta);
      const result = await db.runAsync("INSERT INTO perguntas (tema_id, pergunta) VALUES (?, ?)", temaSelecionado, pergunta);

      let pergunta_id = result.lastInsertRowId;
      if (!pergunta_id) {
        console.log("⚠️ Tentando recuperar ID da pergunta...");
        const perguntaRecuperada = await db.getFirstAsync("SELECT id FROM perguntas WHERE pergunta = ?", pergunta);
        if (!perguntaRecuperada) throw new Error("❌ Erro ao recuperar ID da pergunta.");
        pergunta_id = perguntaRecuperada.id;
      }

      console.log("✅ Pergunta adicionada com ID:", pergunta_id);

      for (let i = 0; i < alternativas.length; i++) {
        console.log(`📌 Inserindo alternativa ${i + 1}: ${alternativas[i]} ${i === correta ? "(Correta)" : ""}`);
        await db.runAsync(
          "INSERT INTO alternativas (pergunta_id, alternativa, correta) VALUES (?, ?, ?)",
          pergunta_id,
          alternativas[i],
          i === correta ? 1 : 0
        );
      }

      console.log("✅ Todas alternativas foram adicionadas!");
      Alert.alert("Sucesso", "Pergunta cadastrada!");
      setPergunta("");
      setAlternativas(["", "", "", ""]);
      setCorreta(null);
      setTemaSelecionado(null);
    } catch (error) {
      console.error("❌ Erro ao cadastrar pergunta:", error);
      Alert.alert("Erro", "Falha ao cadastrar pergunta.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📌 Cadastro de Perguntas</Text>

      {/* Picker para selecionar o tema */}
      <DropDownPicker
        open={open}
        value={temaSelecionado}
        items={temas}
        setOpen={setOpen}
        setValue={setTemaSelecionado}
        placeholder="Selecione um tema..."
        style={styles.dropdown}
        textStyle={{ color: "#fff", fontSize: 16 }}
        dropDownContainerStyle={{ backgroundColor: "#1E1E2F", borderColor: "#4CAF50" }}
      />

      {/* Campo de Pergunta */}
      <TextInput
        style={styles.input}
        placeholder="Digite a pergunta"
        placeholderTextColor="#aaa"
        value={pergunta}
        onChangeText={setPergunta}
      />

      {/* Campos de Alternativas */}
      {alternativas.map((alt, index) => (
        <View key={index} style={styles.alternativaContainer}>
          <Text style={styles.alternativaLabel}>{String.fromCharCode(97 + index) + "."}</Text>
          <TextInput
            style={styles.inputAlternativa}
            placeholder={`Alternativa ${index + 1}`}
            placeholderTextColor="#aaa"
            value={alt}
            onChangeText={(text) => {
              let novasAlternativas = [...alternativas];
              novasAlternativas[index] = text;
              setAlternativas(novasAlternativas);
            }}
          />
          <TouchableOpacity
            style={[styles.botaoCorreta, correta === index ? styles.botaoSelecionado : null]}
            onPress={() => setCorreta(index)}
          >
            <FontAwesome name={correta === index ? "check-circle" : "circle-o"} size={20} color="white" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.botao} onPress={adicionarPergunta}>
        <Text style={styles.textoBotao}>Salvar Pergunta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => setTela("menu")}>
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos aprimorados
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", backgroundColor: "#121212" },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
  dropdown: { width: "90%", backgroundColor: "#1E1E2F", borderColor: "#4CAF50", borderRadius: 12, marginBottom: 15 },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#1E1E2F",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#4CAF50",
    textAlign: "center",
    marginBottom: 10,
  },
  alternativaContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    width: "90%", 
    backgroundColor: "#1E1E2F",
    borderRadius: 10, 
    padding: 10, 
    marginVertical: 5 
  },
  alternativaLabel: { fontSize: 18, color: "#fff", marginRight: 10 },
  inputAlternativa: {
    flex: 1,
    height: 45,
    backgroundColor: "#2E2E3A",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  botaoCorreta: { padding: 10, marginLeft: 10, borderRadius: 8 },
  botaoSelecionado: { backgroundColor: "#4CAF50" },
  botao: { backgroundColor: "#4CAF50", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, marginTop: 10 },
  botaoVoltar: { backgroundColor: "#D32F2F", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, marginTop: 10 },
  textoBotao: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});
