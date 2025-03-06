import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function TelaMenu({ setTela, db, iniciarQuiz }) {
  const [openTema, setOpenTema] = useState(false);
  const [openQtd, setOpenQtd] = useState(false);
  const [temaSelecionado, setTemaSelecionado] = useState(null);
  const [qtdSelecionada, setQtdSelecionada] = useState(5);
  const [temas, setTemas] = useState([]);
  const [quantidades] = useState([
    { label: "5 Perguntas", value: 5 },
    { label: "10 Perguntas", value: 10 },
    { label: "15 Perguntas", value: 15 },
  ]);

  useEffect(() => {
    if (db) {
      carregarTemas();
    } else {
      console.warn("⚠️ Banco de dados ainda não carregado.");
    }
  }, [db]);

  async function carregarTemas() {
    try {
      console.log("📌 Buscando temas...");
      const temasCadastrados = await db.getAllAsync("SELECT * FROM temas");
      if (!temasCadastrados) throw new Error("Nenhum tema encontrado.");

      const formatado = temasCadastrados.map((tema) => ({
        label: tema.nome,
        value: tema.nome,
      }));
      setTemas(formatado);
      console.log("✅ Temas carregados:", formatado);
    } catch (error) {
      console.error("❌ Erro ao carregar temas:", error);
      Alert.alert("Erro", "Falha ao carregar temas.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎯 Quiz App</Text>

      <View style={styles.quizConfigContainer}>
        <Text style={styles.label}>Escolha um tema para começar:</Text>

        {/* Picker de Tema */}
        <View style={[styles.pickerContainer, { zIndex: openTema ? 3000 : 1000 }]}>
          <DropDownPicker
            open={openTema}
            value={temaSelecionado}
            items={temas}
            setOpen={(val) => {
              setOpenTema(val);
              if (val) setOpenQtd(false); // Fecha o outro picker se estiver aberto
            }}
            setValue={setTemaSelecionado}
            setItems={setTemas}
            placeholder="Selecione um tema..."
            style={styles.dropdown}
            textStyle={{ color: "#fff", fontSize: 16 }}
            dropDownContainerStyle={{
              backgroundColor: "#1E1E2F",
              borderColor: "#4CAF50",
              zIndex: openTema ? 3000 : 1000,
            }}
          />
        </View>

        {/* Picker de Quantidade de Perguntas */}
        <Text style={styles.label}>Quantidade de perguntas:</Text>
        <View style={[styles.pickerContainer, { zIndex: openQtd ? 2000 : 500 }]}>
          <DropDownPicker
            open={openQtd}
            value={qtdSelecionada}
            items={quantidades}
            setOpen={(val) => {
              setOpenQtd(val);
              if (val) setOpenTema(false); // Fecha o picker de tema se estiver aberto
            }}
            setValue={setQtdSelecionada}
            placeholder="Escolha a quantidade..."
            style={styles.dropdown}
            textStyle={{ color: "#fff", fontSize: 16 }}
            dropDownContainerStyle={{
              backgroundColor: "#1E1E2F",
              borderColor: "#4CAF50",
              zIndex: openQtd ? 2000 : 500,
            }}
          />
        </View>

        {/* Botão de Iniciar Quiz */}
        <TouchableOpacity
          style={[styles.botao, (!temaSelecionado || !qtdSelecionada) && styles.desativado]}
          disabled={!temaSelecionado || !qtdSelecionada}
          onPress={() => iniciarQuiz(temaSelecionado, qtdSelecionada)}
        >
          <Text style={styles.textoBotao}>🚀 Iniciar Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Botões inferiores */}
      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botao} onPress={() => setTela("cadastroTema")}>
          <Text style={styles.textoBotao}>➕ Cadastrar Tema</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => setTela("cadastroPergunta")}>
          <Text style={styles.textoBotao}>📝 Cadastrar Pergunta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSecundario} onPress={() => setTela("listaPerguntas")}>
          <Text style={styles.textoBotao}>📋 Listar Perguntas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#121212", padding: 20, justifyContent: "space-between" },

  titulo: { fontSize: 30, fontWeight: "bold", color: "#4CAF50", marginBottom: 20, textTransform: "uppercase" },

  quizConfigContainer: { width: "100%", alignItems: "center", marginBottom: 20 },

  botoesContainer: { width: "100%", alignItems: "center" },

  label: { fontSize: 18, color: "#fff", marginBottom: 10, textAlign: "center" },

  pickerContainer: { width: "90%", marginBottom: 15 },

  dropdown: { width: "100%", backgroundColor: "#1E1E2F", borderColor: "#4CAF50", borderRadius: 12 },

  botao: { backgroundColor: "#4CAF50", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, marginTop: 10, width: "90%", alignItems: "center", zIndex: 1 },

  botaoSecundario: { backgroundColor: "#FFA000", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, marginTop: 10, width: "90%", alignItems: "center", zIndex: 1 },

  textoBotao: { fontSize: 18, fontWeight: "bold", color: "white" },

  desativado: { backgroundColor: "#555", shadowOpacity: 0 },
});
