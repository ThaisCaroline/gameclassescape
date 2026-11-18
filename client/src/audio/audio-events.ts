import type { RoomPublic } from '@game/shared';
import { socket, subscribeRoom } from '../network/index.js';
import { play, startAmbience, stopAmbience } from './player.js';

let previous: RoomPublic | null = null;

/** Compara o estado anterior com o novo e toca o que mudou (ambiente, giz, passos). */
function onRoomChange(room: RoomPublic | null): void {
  const before = previous;
  previous = room;

  if (!room) return stopAmbience();
  const wasRunning = before?.round.phase === 'running';
  const isRunning = room.round.phase === 'running';

  if (isRunning && !wasRunning) startAmbience();
  if (!isRunning && wasRunning) stopAmbience();
  if (!before || !isRunning) return;

  // O professor virou para o quadro: giz arranhando.
  if (room.round.teacherFacing === 'board' && before.round.teacherFacing === 'students') play('chalk');

  // Alguém mudou de carteira: passos (um só por atualização, mesmo que vários andem juntos).
  const moved = room.students.some((s) => {
    const old = before.students.find((o) => o.id === s.id);
    return old !== undefined && old.deskId !== s.deskId;
  });
  // O professor de costas ouve os passos abafados (sem saber quem nem onde); olhando a turma, normais.
  const teacherTurnedAway = room.round.teacherId === socket.id && room.round.teacherFacing === 'board';
  if (moved) play('footstep', 1, teacherTurnedAway);
}

/** Liga os sons às mensagens do servidor e às mudanças da sala. Chamar uma vez na inicialização. */
export function registerAudio(): void {
  socket.on('fx:jumpscare', () => play('jumpscare'));
  socket.on('fx:ruler', () => play('ruler'));
  socket.on('question:update', () => play('whisper'));
  socket.on('answer:result', ({ outcome }) => {
    if (outcome === 'correct') play('correct');
    if (outcome === 'wrong') play('wrong');
    if (outcome === 'caught') play('jumpscare'); // o grito acompanha a cara do susto
  });
  subscribeRoom(onRoomChange);
}
