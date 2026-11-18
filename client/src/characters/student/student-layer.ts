import type Phaser from 'phaser';
import type { Layout } from '../../scenes/room-layout.js';
import type { SceneCallbacks, ViewState } from '../../scenes/view-state.js';
import { StudentSprite } from './student-sprite.js';

const SLOT_WIDTH = 18;

/** Mantém um boneco por aluno e o posiciona na carteira (vários na mesma carteira ficam lado a lado). */
export class StudentLayer {
  private readonly sprites = new Map<string, StudentSprite>();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly layout: Layout,
    private readonly callbacks: SceneCallbacks,
  ) {}

  update(state: ViewState): void {
    const students = state.room.students;
    for (const [id, sprite] of this.sprites) {
      if (!students.some((s) => s.id === id)) {
        sprite.destroy();
        this.sprites.delete(id);
      }
    }

    const perDesk = new Map<string, number>();
    for (const student of students) perDesk.set(student.deskId, (perDesk.get(student.deskId) ?? 0) + 1);
    const slotOf = new Map<string, number>();

    for (const student of students) {
      const desk = state.room.desks.find((d) => d.id === student.deskId);
      if (!desk) continue;

      let sprite = this.sprites.get(student.id);
      if (!sprite) {
        sprite = new StudentSprite(this.scene, student.id, student.nickname, student.id === state.meId, (id) =>
          this.callbacks.onStudentClick?.(id),
        );
        this.sprites.set(student.id, sprite);
      }

      const count = perDesk.get(student.deskId) ?? 1;
      const slot = slotOf.get(student.deskId) ?? 0;
      slotOf.set(student.deskId, slot + 1);
      const base = this.layout.deskCenter(desk);
      const playing = student.status === 'playing';

      // Vários na mesma cadeira: ficam em duas fileiras, lado a lado, na frente da cadeira.
      const columns = Math.ceil(count / 2);
      sprite.update({
        x: base.x + (Math.floor(slot / 2) - (columns - 1) / 2) * SLOT_WIDTH,
        y: base.y + 16 + (slot % 2) * 9,
        moving: student.moving && playing,
        ghost: student.status === 'ghost',
        isMe: student.id === state.meId,
        clickable: state.canCatch && playing && student.moving,
        // Nome só de quem importa: você, quem está se movendo, ou quem está quase sozinho na cadeira.
        showName: student.id === state.meId || student.moving || count <= 2,
      });
    }
  }

  /** Posição (centro do boneco) do aluno, ou null se não existir. */
  centerOf(studentId: string): { x: number; y: number } | null {
    return this.sprites.get(studentId)?.center() ?? null;
  }

  /** Marca o aluno como pego (pisca vermelho e mostra "CAUGHT!"). */
  flashCaught(studentId: string): void {
    this.sprites.get(studentId)?.flashCaught();
  }

  /** Clique no boneco (mesma regra do mouse). */
  click(studentId: string): boolean {
    const sprite = this.sprites.get(studentId);
    if (!sprite?.clickable) return false;
    this.callbacks.onStudentClick?.(studentId);
    return true;
  }

  all(): StudentSprite[] {
    return [...this.sprites.values()];
  }
}
