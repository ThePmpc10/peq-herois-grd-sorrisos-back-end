const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const nlp = require("compromise");

app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    if (origin && origin.startsWith("https://thepmpc10.github.io")) {
      callback(null, true); // Permitir o acesso
    } else {
      callback(new Error("Not allowed by CORS")); // Bloquear se não for permitido
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Variável global para rastrear tentativas consecutivas de mensagens não compreendidas
let misunderstoodCount = 0;

// Calls & endpoints
app.post("/chat", (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    let reply;

    // Processa o texto com NLP
    const doc = nlp(userMessage);

    // Reconhece intenções
    if (doc.has("como posso doar brinquedos") || doc.has("doar brinquedos") || doc.has("doação brinquedos") || doc.has("entregar brinquedos")
     || doc.has("deixar brinquedos") || doc.has("brinquedo") || doc.has("brinquedos") || doc.has("largar brinquedos") || doc.has("toys")
     || doc.has("donate toys") || doc.has("local para doar brinquedos") || doc.has("sítio para doar brinquedos") || doc.has("recolha brinquedos")
     || doc.has("recolher brinquedos")) {
        reply = "Para fazer a doação de brinquedos, pode entrar em contacto diretamente conosco através do nosso instagram ou email, ou fazer a doação diretamente no Chousa Park.";
        misunderstoodCount = 0;
    } else if (doc.has("sítio do chousa park") || doc.has("onde fica o chousa park") || doc.has("local do chousa park") || doc.has("onde é o chousa park")
     || doc.has("chousa park") || doc.has("chousa")) {
        reply = "O Chousa Park fica localizado na seguinte morada: Rua da Chousa 16, 3750-811 Valongo do Vouga";
        misunderstoodCount = 0;
    } else if (doc.has("sítio do chousa park") || doc.has("onde fica o chousa park") || doc.has("local do chousa park") || doc.has("onde é o chousa park")
     || doc.has("o que é o chousa park") || doc.has("o que é o chousa")) {
        reply = "O Chousa Park é um parque de diversões e espaço para festas e convívios.";
        misunderstoodCount = 0;
    } else if (doc.has("doar dinheiro") || doc.has("dar dinheiro") || doc.has("dinheiro") || doc.has("doação monetária") || doc.has("monetária") || doc.has("valor monetário")
     || doc.has("onde posso doar dinheiro")  || doc.has("mandar dinheiro")) {
        reply = "PAra fazeres doações monetárias pode efetua-las para o nosso IBAN ou através do nosso GoFundMe.";
        misunderstoodCount = 0;
    } else if (doc.has("iban")) {
        reply = "O nosso IBAN é: PT50 0010 0000 4534928002 47";
        misunderstoodCount = 0;
    } else if (doc.has("ola") || doc.has("bom dia") || doc.has("boa tarde") || doc.has("boa noite")) {
            reply = "Olá!";
            misunderstoodCount = 0;
    } else if (doc.has("gofundme")) {
        reply = "Pode aceder ao nosso GoFundMe através do seguinte link - <a href=\"https://www.gofundme.com/f/pequenos-herois-grandes-sorrisos\" target=\"_blank\" rel=\"noopener noreferrer\">GoFundMe - Pequenos Heróis, Grandes Sorrisos</a>";
        misunderstoodCount = 0;
    } else if (doc.has("contacto") || doc.has("entrar em contato") || doc.has("email") || doc.has("mail") || doc.has("insta") || doc.has("instagram") || doc.has("quais sao")) {
        reply = "Pode entrar em contacto conosco através do nosso email - info@pequenosheroisgrandessorrisos.org, ou através do nosso instagram oficial - @pequenosheroisgrandessorrisos.";
        misunderstoodCount = 0;
    } else if (doc.has("tipo de brinquedos") || doc.has("quais brinquedos")) {
        reply = "Pode doar qualquer tipo de brinquedos, desde que sejam novos e embalados, pois devido à fragilidade das crianças no hospital devido ao seu estado de saúde, os hospitais não podem correr riscos de contaminações.";
        misunderstoodCount = 0;
    } else if (doc.has("brinquedos novos") || doc.has("brinquedos velhos") || doc.has("brinquedos usados") || doc.has("nao embalados") || doc.has("brinquedos pouco uso") || doc.has("brinquedo novo") || doc.has("brinquedo velho")) {
        reply = "Devido à situação clínica das crianças apenas aceitamos doações de brinquedos novos e embalados, pedimos desculpa pelo transtorno.";
        misunderstoodCount = 0;
    } else {
        misunderstoodCount += 1;
        if (misunderstoodCount >= 3) {
            reply = "Estou com dificuldades em entender a pergunta. Poderia entrar em contacto conosco diretamente através dos nossos meios de contactos? Obrigado!";
            misunderstoodCount = 0; // Reinicia o contador após sugerir o contato direto
            res.json({ reply, disableChat: true });
        } else {
            reply = "Desculpa, não entendi o que quiseste dizer. Podes reformular?";
            res.json({ reply, disableChat: false });
        }
    }
    res.json({ reply });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

