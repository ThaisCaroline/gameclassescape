import type { Difficulty, SoloRole } from '@game/shared';
import { BOT_TEACHER_ID, PROFILES, botName, botStudentId } from '../bots/index.js';
import { buildSampleQuestions } from '../questions/index.js';
import { addStudent, closeRoom, createRoom, type Room } from '../rooms/index.js';

export interface SoloOptions {
  humanId: string;
  nickname: string;
  role: SoloRole;
  difficulty: Difficulty;
}

/**
 * Monta a sala solo no lobby: perguntas do banco embutido e os outros papéis como robôs. A rodada só começa quando
 * o jogador toca em "Start" (ver `startSoloRound`), depois de ler a explicação.
 * Devolve null se o servidor está cheio.
 */
export function createSoloRoom({ humanId, nickname, role, difficulty }: SoloOptions): Room | null {
  const room = createRoom(role === 'teacher' ? humanId : BOT_TEACHER_ID, difficulty);
  if (!room) return null;

  room.questions = buildSampleQuestions();
  room.solo = { humanId, role, difficulty };

  if (role === 'student' && !addStudent(room, humanId, nickname).ok) {
    closeRoom(room);
    return null;
  }
  for (let i = 0; i < PROFILES[difficulty].botCount; i++) addStudent(room, botStudentId(i), botName(i));
  return room;
}
