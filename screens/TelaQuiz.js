import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";

export default function TelaQuiz({ pergunta, responder, db }) {
  const [alternativas, setAlternativas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const letrasAlternativas = ["A", "B", "C", "D"]; // Letras para as alternativas

  useEffect(() => {
    async function carregarAlternativas() {
      if (!db) {
        console.error("❌ Erro: Banco de dados não inicializado!");
        Alert.alert("Erro", "Banco de dados não carregado.");
        return;
      }

      if (!pergunta || !pergunta.id) {
        console.warn("⚠️ Nenhuma pergunta encontrada.");
        Alert.alert("Erro", "Nenhuma pergunta encontrada.");
        return;
      }

      try {
        console.log(`🔍 Buscando alternativas para a pergunta ID: ${pergunta.id}`);

        const alternativasCarregadas = await db.getAllAsync(
          "SELECT * FROM alternativas WHERE pergunta_id = ?",
          [pergunta.id]
        );

        if (!alternativasCarregadas || alternativasCarregadas.length === 0) {
          console.warn("⚠️ Nenhuma alternativa encontrada no banco.");
          Alert.alert("Erro", "Nenhuma alternativa encontrada para essa pergunta.");
        }

        console.log("✅ Alternativas carregadas:", alternativasCarregadas);
        setAlternativas(alternativasCarregadas);
      } catch (error) {
        console.error("❌ Erro ao carregar alternativas:", error);
        Alert.alert("Erro", "Falha ao carregar alternativas.");
      } finally {
        setCarregando(false);
      }
    }

    carregarAlternativas();
  }, [db, pergunta]);

  function verificarResposta(alternativaSelecionada) {
    console.log(`🔍 ID selecionado: ${alternativaSelecionada}`);

    // Certifique-se de que estamos pegando o objeto certo
    const alternativaEncontrada = alternativas.find((alt) => Number(alt.id) === Number(alternativaSelecionada));

    if (!alternativaEncontrada) {
        console.error("❌ Alternativa não encontrada! ID:", alternativaSelecionada);
        Alert.alert("Erro", "Houve um problema ao registrar a resposta.");
        return;
    }

    const correta = alternativaEncontrada.correta === 1;

    console.log(`✅ Alternativa encontrada: ${alternativaEncontrada.alternativa}, Correta: ${correta}`);

    responder(alternativaSelecionada);
}

  if (!pergunta || !pergunta.id) {
    return (
      <View style={styles.container}>
        <Text style={styles.tituloErro}>⚠️ Nenhuma pergunta carregada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Exibir número da pergunta */}
        <Text style={styles.numeroPergunta}>Pergunta {pergunta.id}</Text>

        {/* Exibir a pergunta */}
        <Text style={styles.titulo}>{pergunta.pergunta}</Text>

        {/* Carregamento enquanto busca alternativas */}
        {carregando ? (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.carregando} />
        ) : alternativas.length > 0 ? (
          alternativas.map((alt, index) => (
            <TouchableOpacity
              key={alt.id}
              style={styles.botao}
              activeOpacity={0.7}
              onPress={() => verificarResposta(alt.id)}
            >
              {/* Exibir letra da alternativa antes do texto */}
              <Text style={styles.textoBotao}>{letrasAlternativas[index]}. {alt.alternativa}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.tituloErro}>⚠️ Nenhuma alternativa disponível.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1E1E2F", padding: 20 },

  card: {
    backgroundColor: "#2E2E3D",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  numeroPergunta: { fontSize: 18, color: "#4CAF50", fontWeight: "bold", marginBottom: 5 },

  titulo: { fontSize: 22, color: "#fff", marginBottom: 20, fontWeight: "bold", textAlign: "center" },

  botao: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  textoBotao: { fontSize: 18, fontWeight: "bold", color: "white" },

  tituloErro: { fontSize: 20, color: "#ff5555", textAlign: "center", fontWeight: "bold", marginTop: 10 },

  carregando: { marginTop: 15 },
});
