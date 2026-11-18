export type ErrorCode =
  | 'room_not_found'
  | 'room_full'
  | 'server_busy'
  | 'invalid_state'
  | 'not_allowed'
  | 'invalid_input'
  | 'no_students'
  | 'questions_incomplete'
  | 'student_locked'
  | 'desk_occupied'
  | 'seat_taken'
  | 'seat_forbidden'
  | 'seat_chosen'
  | 'out_of_reach';

/** Resposta de confirmação do servidor a um pedido do cliente. */
export type Ack<T = void> = { ok: true; data: T } | { ok: false; error: ErrorCode };
