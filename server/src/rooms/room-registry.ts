import type { Difficulty } from '@game/shared';
import { config } from '../config.js';
import { createDesks } from './desk-layout.js';
import { generateRoomCode } from './room-code.js';
import type { Room } from './room.js';

const rooms = new Map<string, Room>();

/** Cria uma sala nova (com a grade de carteiras já montada, para a escolha na sala de espera); null se o servidor está cheio. */
export function createRoom(teacherId: string, difficulty: Difficulty): Room | null {
  if (rooms.size >= config.maxRooms) return null;

  const room: Room = {
    code: generateRoomCode((c) => rooms.has(c)),
    difficulty,
    desks: createDesks(),
    students: [],
    round: {
      phase: 'lobby',
      endsAt: null,
      teacherId,
      teacherFacing: 'board',
      winner: null,
    },
    questions: [],
    pendingJumps: new Map(),
    whisperReadyAt: new Map(),
    solo: null,
    cleanups: [],
  };
  rooms.set(room.code, room);
  return room;
}

export function deleteRoom(code: string): void {
  rooms.delete(code);
}

export function findRoom(code: string): Room | undefined {
  return rooms.get(code);
}
