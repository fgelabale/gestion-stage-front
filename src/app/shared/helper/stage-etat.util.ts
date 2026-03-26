export type StageEtat =
  | 'PRE_VALIDE'
  | 'ENTENTE_RECUE'
  | 'ACCEPTE'
  | 'EN_COURS'
  | 'ANNULE';

export interface StageEtatUi {
  label: string;
  icon: string;
  bg: string;
  color: string;
}

export function getStageEtatUi(etat: string | null | undefined): StageEtatUi {
  const map: Record<string, StageEtatUi> = {
    PRE_VALIDE: {
      label: 'Pré-validé',
      icon: '🟡',
      bg: '#FFC107',
      color: '#212121',
    },
    ENTENTE_RECUE: {
      label: 'Entente reçue',
      icon: '📄',
      bg: '#2196F3',
      color: '#FFFFFF',
    },
    ACCEPTE: {
      label: 'Accepté',
      icon: '✅',
      bg: '#4CAF50',
      color: '#FFFFFF',
    },
    EN_COURS: {
      label: 'En cours',
      icon: '⚡',
      bg: '#673AB7',
      color: '#FFFFFF',
    },
    ANNULE: {
      label: 'Annulé',
      icon: '❌',
      bg: '#F44336',
      color: '#FFFFFF',
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