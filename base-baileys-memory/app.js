const { createBot, createProvider, createFlow, addKeyword, addAction } = require('@bot-whatsapp/bot');

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

const axios = require('axios');
const express = require('express');
const APIChat = require('./APIclass');

const apiChat = new APIChat();

const { AsyncQueue } = require('./AsyncQueue'); // Import AsyncQueue class from a separate file
const messageQueue = new AsyncQueue(); 

const flowChatLoop = addKeyword(['gpt3'])
    .addAnswer(
        '¡Hola! ¿En qué puedo ayudarte hoy?',
        { capture: true },
    async (ctx, { fallBack, provider }) => {
      if (true) {
        // Process the messages in an async queue
        messageQueue.add(async () => {
          const jid = ctx.key.remoteJid;
          const refProvider = await provider.getInstance();
          await refProvider.presenceSubscribe(jid);
          await delay(100);
          await refProvider.sendPresenceUpdate('composing', jid);
          const user = ctx.from;
          await processMessage(ctx.body, jid, fallBack, refProvider);
        });
      }
    }
  );
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processMessage(message, jid, fallBack, refProvider) {
  try {
    const response = await axios.post('http://localhost:5000/process_message', {
      message: message
    });

    const textFromAI = response.data.response;

    if (textFromAI) {
      await fallBack(textFromAI);
    } else {
      console.error('Error: No response from the AI.');
    }
  } catch (error) {
    console.error(error);
  }
}
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal, flowChatLoop]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])

    .addAnswer('Bienvenido a ChessCluster')
    .addAnswer(
        [
            'Selecciona el modo con el que quieres iniciar',
            '👉 *gpt3* para iniciar una conversación con gpt3',
        ],
        null,
        null,
        [flowChatLoop]
    );



main();

