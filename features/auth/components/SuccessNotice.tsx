interface SuccessNoticeProps {
  message: string;
}

// Aviso de éxito presentacional y agnóstico (SPEC-010).
// No conoce ningún flujo concreto: recibe el mensaje y lo renderiza
// de forma accesible. Reutilizable para futuros éxitos del sistema.
export function SuccessNotice({ message }: SuccessNoticeProps) {
  return <p role="status">{message}</p>;
}
