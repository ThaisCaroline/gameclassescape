import type { Ack, QuestionInput, TeacherFacing } from '@game/shared';
import { socket } from './socket.js';

export function setQuestions(questions: QuestionInput[]): Promise<Ack> {
  return new Promise((resolve) => socket.emit('teacher:set_questions', { questions }, resolve));
}

export function startRound(): Promise<Ack> {
  return new Promise((resolve) => socket.emit('teacher:start_round', resolve));
}

export function turn(facing: TeacherFacing): void {
  socket.emit('teacher:turn', { facing });
}

export function catchStudent(studentId: string): void {
  socket.emit('teacher:catch', { studentId });
}
