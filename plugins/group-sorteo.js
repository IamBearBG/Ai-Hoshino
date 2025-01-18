import fs from 'fs';

let giveawayData = JSON.parse(fs.readFileSync('./sorteo.json', 'utf-8') || '{}');

let saveGiveawayData = () => {
    fs.writeFileSync('./sorteo.json', JSON.stringify(giveawayData, null, 2));
};

let parseCustomTime = (timeString) => {
    let timeUnits = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000
    };

    let totalMs = 0;
    let regex = /(\d+)([smj])/g;
    let match;

    while ((match = regex.exec(timeString)) !== null) {
        let value = parseInt(match[1]);
        let unit = match[2];
        if (timeUnits[unit]) {
            totalMs += value * timeUnits[unit];
        }
    }

    return totalMs;
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (command === 'reclamar') {
        if (!text) throw `Formato incompleto!\n\nEjemplo:\n${usedPrefix + command} premio|participantes|tiempo\n\nUso:\n${usedPrefix + command} iPhone 14|50|1h30m2s`;

        let [price, maxParticipants, time] = text.split('|');
        if (!price || !maxParticipants || !time) throw `Por favor, introduzca todos los parámetros correctamente!`;

        maxParticipants = parseInt(maxParticipants);
        if (isNaN(maxParticipants) || maxParticipants <= 0) throw `Los participantes no pueden quedar en 0!`;

        let duration = parseCustomTime(time);
        if (duration <= 0) throw `Duracion no valida, usa el ejemplo!`;
        let endTime = Date.now() + duration;

        let giveawayId = m.quoted?.id || m.key.id;
        let groupId = m.chat;

        giveawayData[groupId] = {
            giveawayId,
            host: m.sender,
            price,
            maxParticipants,
            duration,
            endTime,
            participants: [],
            isEnded: false
        };

        saveGiveawayData();

        conn.reply(m.chat,
            `乂  S O R T E O\n\n` +
            `» Premio: ${price}\n` +
            `» Maximo de participantes: ${maxParticipants}\n` +
            `» Duración: ${time}\n` +
            `» Termina en: ${new Date(endTime).toLocaleString()}\n` +
            `» Anfitrión: @${m.sender.split('@')[0]}\n` +
            `» ID de reclamo: ${giveawayId}\n\n` +
            `» Nota: escribe .enter para entrar al sorteo`,
            m, { mentions: [m.sender] }
        );

        setTimeout(() => endGiveaway(groupId, conn, 'timeout'), duration);
    }

    if (command === 'enter') {
        if (!m.quoted || !m.quoted.text) throw `Responde al mensaje del sorteo!`;

        let quotedText = m.quoted.text;
        let giveawayIdMatch = quotedText.match(/ID de reclamo: (\S+)/);
        if (!giveawayIdMatch) throw `Ingresa la id correcta y responde el mensaje!`;

        let giveawayId = giveawayIdMatch[1];
        let groupId = m.chat;
        let giveaway = giveawayData[groupId];

        if (!giveaway || giveaway.giveawayId !== giveawayId) throw `No hay sorteos aún!`;
        if (giveaway.isEnded) throw `El sorteo ya acabó!`;
        if (giveaway.participants.includes(m.sender)) throw `Ya reclamaste esto!`;

        giveaway.participants.push(m.sender);
        saveGiveawayData();

        conn.reply(m.chat, `Llegaste al sorteo!`, m);

        if (giveaway.participants.length >= giveaway.maxParticipants) {
            endGiveaway(groupId, conn, 'participants');
        }
    }
};

let endGiveaway = (groupId, conn, reason) => {
    let giveaway = giveawayData[groupId];
    if (!giveaway || giveaway.isEnded) return;

    giveaway.isEnded = true;

    if (giveaway.participants.length > 0) {
        let winner = giveaway.participants[Math.floor(Math.random() * giveaway.participants.length)];
        saveGiveawayData();

        conn.reply(groupId,
            `乂  S O R T E O - T E R M I N A D O\n\n` +
            `» Ganador: @${winner.split('@')[0]}\n` +
            `» Premio: ${giveaway.price}\n` +
            `» Anfitrión: @${giveaway.host.split('@')[0]}\n\n` +
            `» Nota: ¡Felicitaciones al ganador! Ponte en contacto con el anfitrión para reclamar la recompensa.`,
            null, { mentions: [winner, giveaway.host] }
        );
    } else if (reason === 'timeout') {
        conn.reply(groupId,
            `乂  T I E M P O - A C A B A D O\n\n` +
            `» Premio: ${giveaway.price}\n` +
            `» Anfitrión: @${giveaway.host.split('@')[0]}\n\n` +
            `» Nota: El sorteo ha finalizado debido a que el tiempo se acaba. No hay ganadores.`,
            null, { mentions: [giveaway.host] }
        );
    }

    saveGiveawayData();
};

handler.group = true
handler.admin = true
handler.help = ['sorteo']
handler.tags = ['group']
handler.command = /^(sorteo|enter)$/i;

export default handler;