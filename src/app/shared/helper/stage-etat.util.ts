import { TranslocoService } from '@jsverse/transloco';

export type StageEtat =
  | 'OUVERT'
  | 'EN_TRAITEMENT'
  | 'ENTENTE_ENVOYEE'
  | 'ACCEPTE'
  | 'STAGE_ECHEC'
  | 'ANNULE';

export interface StageEtatUi {
  labelKey: string;
  icon: string;
}

export function formatStatut(value: string): string {
  return `statutStage.${value}`;
}

export function getStageEtatUi(
  etat: string | null | undefined,
): StageEtatUi {
  const map: Record<string, StageEtatUi> = {
    OUVERT: {
      labelKey: 'etatStage.OUVERT',
      icon: '🟡',
    },
    ENTENTE_ENVOYEE: {
      labelKey: 'etatStage.ENTENTE_ENVOYEE',
      icon: '📄',
    },
    ACCEPTE: {
      labelKey: 'etatStage.ACCEPTE',
      icon: '✅',
    },
    EN_TRAITEMENT: {
      labelKey: 'etatStage.EN_TRAITEMENT',
      icon: '⚡',
    },
    STAGE_ECHEC: {
      labelKey: 'etatStage.STAGE_ECHEC',
      icon: '❌',
    },
    ANNULE: {
      labelKey: 'etatStage.ANNULE',
      icon: '❌',
    },
  };

  return (
    map[etat ?? ''] ?? {
      labelKey: '',
      icon: '•',
    }
  );
}