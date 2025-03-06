import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";

export default function TelaListaPerguntas({ setTela, db, setPerguntaSelecionada }) {
  const [perguntas, setPerguntas] = useState([]);

  useEffect(() => {
    carregarPerguntas();
  }, []);

  async function carregarPerguntas() {
    try {
      console.log("📌 Buscando perguntas do banco...");
      const resultados = await db.getAllAsync("SELECT * FROM perguntas");
      setPerguntas(resultados);
    } catch (error) {
      console.error("❌ Erro ao carregar perguntas:", error);
      Alert.alert("Erro", "Falha ao carregar perguntas.");
    }
  }

  async function deletarPergunta(pergunta_id) {
    Alert.alert("Confirmação", "Deseja realmente excluir essa pergunta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            console.log(`🗑️ Excluindo pergunta ID: ${pergunta_id}`);
            await db.runAsync("DELETE FROM alternativas WHERE pergunta_id = ?", [pergunta_id]);
            await db.runAsync("DELETE FROM perguntas WHERE id = ?", [pergunta_id]);
            console.log("✅ Pergunta deletada!");
            carregarPerguntas();
          } catch (error) {
            console.error("❌ Erro ao deletar pergunta:", error);
            Alert.alert("Erro", "Falha ao deletar pergunta.");
          }
        },
      },
    ]);
  }

  // 🔹 Função para truncar texto
  function truncarTexto(texto, limite = 11) {
    return texto.length > limite ? texto.substring(0, limite) + "..." : texto;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📜 Lista de Perguntas</Text>

      <ScrollView horizontal>
        <View style={styles.tabela}>
          {/* Cabeçalho da Tabela */}
          <View style={styles.linhaHeader}>
            <Text style={styles.headerTexto}>Pergunta</Text>
            <Text style={styles.headerTexto}>Ações</Text>
          </View>

          {/* Lista de Perguntas */}
          <FlatList
            data={perguntas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.linha}>
                {/* 🔹 Exibir pergunta truncada e permitir visualização completa */}
                <TouchableOpacity
                  style={styles.perguntaContainer}
                  onPress={() => Alert.alert("Pergunta Completa", item.pergunta)}
                >
                  <Text style={styles.textoPergunta}>
                    {truncarTexto(item.pergunta)}
                  </Text>
                </TouchableOpacity>

                {/* Botões de ação */}
                <View style={styles.acoesContainer}>
                  <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() => {
                      setPerguntaSelecionada(item);
                      setTela("editarPergunta");
                    }}
                  >
                    <Text style={styles.textoBotao}>✏️ Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.botaoExcluir} onPress={() => deletarPergunta(item.id)}>
                    <Text style={styles.textoBotao}>🗑️ Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Botão de Voltar */}
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => setTela("menu")}>
        <Text style={styles.textoBotao}>🔙 Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos aprimorados
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1E1E2F", alignItems: "center" },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 15 },

  tabela: { width: "100%", borderRadius: 10, overflow: "hidden" },

  linhaHeader: {
    flexDirection: "row",
    backgroundColor: "#333",
    padding: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerTexto: { flex: 1, fontSize: 18, fontWeight: "bold", color: "#4CAF50", textAlign: "center" },

  linha: {
    flexDirection: "row",
    backgroundColor: "#2E2E3D",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    alignItems: "center",
  },

  perguntaContainer: { flex: 2, paddingRight: 10 },
  textoPergunta: { color: "#fff", fontSize: 16 },

  acoesContainer: { flexDirection: "row", flex: 1, justifyContent: "center" },

  botaoEditar: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  botaoExcluir: {
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  botaoVoltar: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
    width: "80%",
    alignItems: "center",
  },

  textoBotao: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
});
