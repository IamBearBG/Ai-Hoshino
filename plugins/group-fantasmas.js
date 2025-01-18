let handler = async (m, { conn, text, participants }) => {
let member = participants.map(u => u.id)
if(!text) {
var sum = member.length
} else {
var sum = text} 
var total = 0
var sider = []
for(let i = 0; i < sum; i++) {
let users = m.isGroup ? participants.find(u => u.id == member[i]) : {}
if((typeof global.db.data.users[member[i]] == 'undefined' || global.db.data.users[member[i]].chat == 0) && !users.isAdmin && !users.isSuperAdmin) { 
if (typeof global.db.data.users[member[i]] !== 'undefined'){
if(global.db.data.users[member[i]].whitelist == false){
total++
sider.push(member[i])}
}else {
total++
sider.push(member[i])}}}
if(total == 0) return conn.reply(m.chat, `🚩 Este grupo no tiene fantasmas`, m) 
m.reply(`🚩 Revisión inactiva\n\nGrupo: ${await conn.getName(m.chat)} & Miembros: \n${sum}\n\n[ ⇲ Lista de fantasmas ⇱ ]\n${sider.map(v => '  👻 @' + v.replace(/@.+/, '')).join('\n')}\n\nNota: Esto no puede ser 𝟷𝟶𝟶% correcto, El bot inicia el conteo de mensajes desde la activación en este grupo`, null, { mentions: sider })}
handler.help = ['fantasmas']
handler.tags = ['group']
handler.command = /^(verfantasmas|fantasmas|sider)$/i
handler.admin = true
handler.botAdmin = true
handler.register = true
export default handler