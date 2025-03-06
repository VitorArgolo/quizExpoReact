# QuizExpoReact

Este projeto é um aplicativo de quiz desenvolvido em **React Native** utilizando **Expo**. Ele permite a criação e participação em quizzes interativos.

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento de aplicativos móveis
- **Expo** - Plataforma para facilitar o desenvolvimento e execução do app
- **React Navigation** - Para gerenciamento de navegação
- **Styled Components** - Para estilização
- **Context API** - Para gerenciamento de estado global
- **AsyncStorage** - Para armazenamento local de dados
- **SQLite** - Banco de dados local para persistência de dados

## 📦 Instalação

### Pré-requisitos
Certifique-se de ter instalado:
- **Node.js** (versão LTS recomendada)
- **Expo CLI**

### Clonando o repositório
```bash
  git clone https://github.com/VitorArgolo/quizExpoReact.git
  cd quizExpoReact
```

### Instalando dependências
```bash
  npm install
  # ou
  yarn install
```

## ▶️ Executando o Projeto

Para rodar o app no modo de desenvolvimento, utilize:
```bash
  expo start
```
Escolha rodar o app no emulador ou no seu dispositivo físico através do Expo Go.

## 🛠️ Estrutura do Projeto

```
quizExpoReact/
│-- src/
│   │-- components/   # Componentes reutilizáveis
│   │-- screens/      # Telas do aplicativo
│   │-- assets/       # Imagens e ícones
│   │-- context/      # Gerenciamento de estado global
│   │-- services/     # Requisições e API
│   │-- database/     # Configuração e manipulação do SQLite
│-- App.js           # Arquivo principal do app
│-- package.json     # Dependências do projeto
│-- README.md        # Documentação do projeto
```

## 📌 Funcionalidades
- Criar quizzes personalizados 📝
- Responder perguntas com diferentes alternativas 🎯
- Sistema de pontuação e feedback ✅❌
- Armazenamento local de progresso 📊
- Persistência de dados com **SQLite** 🗄️
- Cadastro e edição de perguntas e temas ✍️
- Seleção de quantidade de perguntas para cada quiz 📋

## 🛠 Melhorias Futuras
- Integração com banco de dados externo 🔄
- Modo multiplayer 🎮
- Estatísticas avançadas 📈

## 🤝 Contribuição
Sinta-se à vontade para contribuir com melhorias. Faça um **fork** do repositório, crie uma **branch** e envie um **pull request**. 

```bash
  git checkout -b minha-feature
  git commit -m 'Adicionando nova feature'
  git push origin minha-feature
```

## 📜 Licença
Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

💡 **Dúvidas ou sugestões?** Entre em contato ou abra uma issue! 😊

