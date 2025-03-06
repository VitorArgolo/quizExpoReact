import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // Ícones para botões

export default function TelaCadastroTema({ setTela, db }) {
  const [tema, setTema] = useState("");
  const [temas, setTemas] = useState([]);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarTemas();
  }, []);

  async function carregarTemas() {
    try {
      const temasCadastrados = await db.getAllAsync("SELECT * FROM temas");
      setTemas(temasCadastrados);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar temas.");
    }
  }

  async function adicionarOuEditarTema() {
    if (!tema.trim()) {
      Alert.alert("Erro", "O nome do tema é obrigatório!");
      return;
    }

    try {
      if (editando) {
        await db.runAsync("UPDATE temas SET nome = ? WHERE id = ?", tema, editando);
        Alert.alert("Sucesso", "Tema atualizado!");
      } else {
        await db.runAsync("INSERT INTO temas (nome) VALUES (?)", tema);
        Alert.alert("Sucesso", "Tema cadastrado!");
      }

      setTema("");
      setEditando(null);
      carregarTemas();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar tema.");
    }
  }

  async function excluirTema(id) {
    try {
      const perguntasAssociadas = await db.getAllAsync("SELECT * FROM perguntas WHERE tema_id = ?", id);

      if (perguntasAssociadas.length > 0) {
        Alert.alert("Erro", "Este tema não pode ser excluído porque possui perguntas associadas.");
        return;
      }

      await db.runAsync("DELETE FROM temas WHERE id = ?", id);
      Alert.alert("Sucesso", "Tema excluído!");
      carregarTemas();
    } catch (error) {
      Alert.alert("Erro", "Falha ao excluir tema.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{editando ? "✏️ Editar Tema" : "📌 Cadastro de Temas"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Tema"
        placeholderTextColor="#aaa"
        value={tema}
        onChangeText={setTema}
      />

      <TouchableOpacity style={styles.botao} onPress={adicionarOuEditarTema}>
        <Text style={styles.textoBotao}>{editando ? "Salvar Alteração" : "Adicionar Tema"}</Text>
      </TouchableOpacity>

      {/* Listagem de Temas */}
      <FlatList
        data={temas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.temaContainer, editando === item.id && styles.temaEditando]}>
            <Text style={styles.temaTexto}>{item.nome}</Text>
            <View style={styles.botoesContainer}>
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() => {
                  setTema(item.nome);
                  setEditando(item.id);
                }}
              >
                <FontAwesome name="pencil" size={16} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirTema(item.id)}>
                <FontAwesome name="trash" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => setTela("menu")}>
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilização visual aprimorada
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", backgroundColor: "#121212" },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
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
  botao: { backgroundColor: "#4CAF50", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, marginTop: 10 },
  botaoVoltar: { backgroundColor: "#D32F2F", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, marginTop: 10 },
  textoBotao: { fontSize: 18, fontWeight: "bold", color: "#fff" },

  // Estilos da listagem
  temaContainer: {
    width: "100%",
    backgroundColor: "#1E1E2F",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  temaTexto: { fontSize: 18, color: "#fff", flex: 1, textAlign: "left" },
  botoesContainer: { flexDirection: "row" },
  botaoEditar: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 5,
  },
  botaoExcluir: {
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 5,
  },
  temaEditando: { borderColor: "#FFD700", borderWidth: 2 },
});
