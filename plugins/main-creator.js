let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Ai-Hoshino⁩;;\nFN:Ai-Hoshino\nORG:Ai-Hoshino\nTITLE:\nitem1.TEL;waid=51939658716:51939658716\nitem1.X-ABLabel:⁩Ai-Hoshino\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Ai-Hoshino\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: '⁩Ai-Hoshino', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño'] 

export default handler