import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://i.ibb.co/p0JpJ6G/file.jpg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]

  if (chat.bienvenida && m.messageStubType == 27) {
    let bienvenida = `┌─★ *${botname}* \n│「 Bienvenido 」\n└┬★ 「 @${m.messageStubParameters[0].split`@`[0]} 」\n   │✑  Bienvenido a\n   │✑  ${groupMetadata.subject}\n   └───────────────┈ ⳹`
conn.sendMessage(m.chat, { text: bienvenida },
forwardedNewsletterMessageInfo: { 
  newsletterName: 'NOMBRE DEL CANAL', 
  newsletterJid: 'ID DEL CANAL'
}, 
contextInfo: {
mentionedJid: conn.parseMention(bienvenida),
isForwarded: true,
forwardingScore: 999,
externalAdReply: {
title: botname,
body: textbot,
thumbnail: img,
sourceUrl: 'no se w',
mediaType: 1,
renderLargerThumbnail: true
}}, { quoted: m })
  }

  if (chat.bienvenida && m.messageStubType == 28) {
    let bye = `┌─★ *${botname}* \n│「 ADIOS 👋 」\n└┬★ 「 @${m.messageStubParameters[0].split`@`[0]} 」\n   │✑  Se fue\n   │✑ Nunca te quisimos   └───────────────┈ ⳹`
await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal)
  }

  if (chat.bienvenida && m.messageStubType == 32) {
    let kick = `┌─★ *${botname}* \n│「 ADIOS 👋 」\n└┬★ 「 @${m.messageStubParameters[0].split`@`[0]} 」\n   │✑  Se fue\n   │✑ Nunca te quisimos   └───────────────┈ ⳹`
await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal)
}}