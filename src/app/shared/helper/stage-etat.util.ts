export type StageEtat =
  | 'PRE_VALIDE'
  | 'ENTENTE_RECUE'
  | 'ACCEPTE'
  | 'EN_COURS'
  | 'ANNULE';

export interface StageEtatUi {
  label: string;
  icon: string;
}

export function getStageEtatUi(etat: string | null | undefined): StageEtatUi {
  const map: Record<string, StageEtatUi> = {
    PRE_VALIDE: {
      label: 'Pré-validé',
      icon: '🟡',
    },
    ENTENTE_RECUE: {
      label: 'Entente reçue',
      icon: '📄',
    },
    ACCEPTE: {
      label: 'Accepté',
      icon: '✅',
    },
    EN_COURS: {
      label: 'En cours',
      icon: '⚡',
    },
    ANNULE: {
      label: 'Annulé',
      icon: '❌',
    },
  };

  return (
    map[etat ?? ''] ?? {
      label: etat ?? '-',
      icon: '•',
      bg: '#9E9E9E',
      color: '#FFFFFF',
    }
  );
}