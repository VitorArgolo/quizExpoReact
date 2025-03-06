import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import * as SQLite from "expo-sqlite";
import TelaMenu from "./screens/TelaMenu";
import TelaCadastroTema from "./screens/TelaCadastroTema";
import TelaCadastroPergunta from "./screens/TelaCadastroPergunta";
import TelaQuiz from "./screens/TelaQuiz";
import TelaResultado from "./screens/TelaResultado";
import TelaListaPerguntas from "./screens/TelaListaPerguntas";
import TelaEditarPergunta from "./screens/TelaEditarPergunta";

export default function App() {
  const [db, setDb] = useState(null);
  const [tela, setTela] = useState("menu");
  const [temaSelecionado, setTemaSelecionado] = useState(null);
  const [quizPerguntas, setQuizPerguntas] = useState([]);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [indicePerguntaAtual, setIndicePerguntaAtual] = useState(0);
  const [perguntaSelecionada, setPerguntaSelecionada] = useState(null);

  useEffect(() => {
    async function setupDatabase() {
      try {
        console.log("📌 Iniciando banco de dados...");
        const database = await SQLite.openDatabaseAsync("quiz.db");
        await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS temas (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nome TEXT UNIQUE NOT NULL
          );
          CREATE TABLE IF NOT EXISTS perguntas (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            tema_id INTEGER, 
            pergunta TEXT NOT NULL,
            FOREIGN KEY (tema_id) REFERENCES temas(id)
          );
          CREATE TABLE IF NOT EXISTS alternativas (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            pergunta_id INTEGER, 
            alternativa TEXT NOT NULL, 
            correta BOOLEAN DEFAULT 0,
            FOREIGN KEY (pergunta_id) REFERENCES perguntas(id)
          );
        `);
        setDb(database);
        console.log("✅ Banco de dados inicializado!");
      } catch (error) {
        console.error("❌ Erro ao inicializar o banco de dados:", error);
      }
    }
    setupDatabase();
  }, []);
  async function listarTemas() {
    if (!db) {
      console.error("❌ Banco de dados não carregado.");
      return;
    }
  
    try {
      const temas = await db.getAllAsync("SELECT * FROM temas");
      console.log("📌 Temas cadastrados:", temas);
    } catch (error) {
      console.error("❌ Erro ao listar temas:", error);
    }
  }
  
  async function iniciarQuiz(temaNome, quantidade) {
    if (!db) {
      Alert.alert("Erro", "Banco de dados não está pronto.");
      return;
    }
  
    try {
      console.log(`🔍 Buscando ID do tema: ${temaNome}`);
      
      // Buscando ID do tema pelo nome digitado
      const tema = await db.getFirstAsync("SELECT id FROM temas WHERE nome = ?", [temaNome]);
  
      if (!tema) {
        Alert.alert("Erro", "Tema não encontrado.");
        return;
      }
  
      console.log(`✅ Tema encontrado com ID: ${tema.id}`);
  
      // Agora busca as perguntas
      const perguntas = await db.getAllAsync(
        "SELECT * FROM perguntas WHERE tema_id = ? ORDER BY RANDOM() LIMIT ?",
        [tema.id, quantidade]
      );
  
      if (!perguntas || perguntas.length === 0) {
        Alert.alert("Erro", "Nenhuma pergunta encontrada.");
        return;
      }
  
      // Buscar alternativas para cada pergunta
      for (let i = 0; i < perguntas.length; i++) {
        const alternativas = await db.getAllAsync(
          "SELECT * FROM alternativas WHERE pergunta_id = ?",
          [perguntas[i].id]
        );
        perguntas[i].alternativas = alternativas || [];
      }
  
      console.log("✅ Perguntas carregadas:", perguntas);
  
      setQuizPerguntas(perguntas);
      setAcertos(0);
      setErros(0);
      setIndicePerguntaAtual(0);
      setTela("quiz");
    } catch (error) {
      console.error("❌ Erro ao iniciar quiz:", error);
      Alert.alert("Erro", "Falha ao iniciar o quiz.");
    }
  }
  
  
  

  async function responderPergunta(alternativa_id) {
    if (!db) {
      console.error("❌ Erro: Banco de dados não inicializado!");
      Alert.alert("Erro", "Banco de dados não carregado.");
      return;
    }
  
    try {
      console.log(`🔍 Verificando alternativa ID: ${alternativa_id}`);
  
      const correta = await db.getFirstAsync(
        "SELECT correta FROM alternativas WHERE id = ?",
        [alternativa_id]
      );
  
      if (correta && correta.correta === 1) {
        setAcertos((prev) => prev + 1);
      } else {
        setErros((prev) => prev + 1);
      }
  
      if (indicePerguntaAtual + 1 < quizPerguntas.length) {
        setIndicePerguntaAtual((prev) => prev + 1);
      } else {
        console.log("✅ Quiz finalizado! Redirecionando para tela de resultados.");
        setTela("resultado");
      }
    } catch (error) {
      console.error("❌ Erro ao processar resposta:", error);
      Alert.alert("Erro", "Falha ao processar resposta.");
    }
  }
  

  return (
    <View style={styles.container}>
      {tela === "menu" && <TelaMenu setTela={setTela} db={db} iniciarQuiz={iniciarQuiz} />}
      {tela === "cadastroTema" && <TelaCadastroTema setTela={setTela} db={db} />}
      {tela === "cadastroPergunta" && <TelaCadastroPergunta setTela={setTela} db={db} />}
      
      {tela === "quiz" ? (
        quizPerguntas.length > 0 ? (
          <TelaQuiz
            pergunta={quizPerguntas[indicePerguntaAtual]}
            responder={responderPergunta}
            db={db}
          />
        ) : (
          // 🛑 ❌ **O ALERT FOI MOVIDO PARA FORA DO JSX**
          (() => {
            Alert.alert("Erro", "Nenhuma pergunta disponível para este tema.");
            setTela("menu");
          })()
        )
      ) : null}
      {tela === "listaPerguntas" && <TelaListaPerguntas setTela={setTela} db={db} setPerguntaSelecionada={setPerguntaSelecionada} />}
      {tela === "editarPergunta" && <TelaEditarPergunta setTela={setTela} db={db} perguntaSelecionada={perguntaSelecionada} />}

      {tela === "resultado" && <TelaResultado acertos={acertos} erros={erros} setTela={setTela} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", alignItems: "center", justifyContent: "center", padding: 20 },
  botao: { backgroundColor: "#4CAF50", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, marginTop: 10 },
  textoBotao: { fontSize: 18, fontWeight: "bold", color: "white", textAlign: "center" },
});
