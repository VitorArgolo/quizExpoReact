import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ProgressBar } from "react-native-paper"; 

export default function TelaResultado({ acertos = 0, erros = 0, setTela, perguntasRespondidas = [] }) {
    const total = acertos + erros;
    const porcentagem = total > 0 ? ((acertos / total) * 100).toFixed(1) : 0;

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>🏆 Resultado Final</Text>

            <View style={styles.resultadoContainer}>
                <Text style={styles.textoResultado}>✅ Acertos: {acertos}</Text>
                <Text style={styles.textoResultado}>❌ Erros: {erros}</Text>
                <Text style={styles.textoPorcentagem}>📊 Desempenho: {porcentagem}%</Text>
            </View>

            <ProgressBar 
                progress={acertos / total} 
                color="#4CAF50" 
                style={styles.barraProgresso} 
            />

            <Text style={styles.subtitulo}>📜 Resumo das Respostas:</Text>
            
            <ScrollView style={styles.scroll}>
                {perguntasRespondidas.length > 0 ? (
                    perguntasRespondidas.map((item, index) => (
                        <View key={index} style={[styles.perguntaContainer, item.correta ? styles.acerto : styles.erro]}>
                            <Text style={styles.textoPergunta}>
                                {index + 1}. {item.pergunta}
                            </Text>
                            <Text style={styles.textoStatus}>
                                {item.correta ? "✅ Correta" : "❌ Errada"}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.textoSemRespostas}>Nenhuma resposta registrada!</Text>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.botao} onPress={() => setTela("menu")}>
                <Text style={styles.textoBotao}>🏠 Voltar ao Menu</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#121212", padding: 20 },
    titulo: { fontSize: 26, color: "#fff", fontWeight: "bold", marginBottom: 20 },
    resultadoContainer: { 
        width: "90%", 
        backgroundColor: "#1E1E2F", 
        padding: 20, 
        borderRadius: 10, 
        marginBottom: 20, 
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#4CAF50",
    },
    textoResultado: { fontSize: 20, color: "#fff", marginBottom: 8 },
    textoPorcentagem: { fontSize: 22, fontWeight: "bold", color: "#FFD700", marginTop: 10 },
    barraProgresso: { width: "90%", height: 10, borderRadius: 5, marginBottom: 20, backgroundColor: "#333" },
    subtitulo: { fontSize: 20, color: "#fff", fontWeight: "bold", marginBottom: 10 },
    scroll: { width: "100%", maxHeight: 250, marginBottom: 15 },
    perguntaContainer: {
        backgroundColor: "#1E1E2F",
        padding: 12,
        marginVertical: 5,
        borderRadius: 8,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textoPergunta: { fontSize: 16, color: "#fff", flex: 1 },
    textoStatus: { fontSize: 16, fontWeight: "bold", marginLeft: 10 },
    acerto: { borderLeftWidth: 5, borderColor: "#4CAF50" },
    erro: { borderLeftWidth: 5, borderColor: "#D32F2F" },
    textoSemRespostas: { fontSize: 18, color: "#aaa", textAlign: "center", marginTop: 20 },
    botao: { backgroundColor: "#4CAF50", paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, marginTop: 10 },
    textoBotao: { fontSize: 18, fontWeight: "bold", color: "white" },
});
