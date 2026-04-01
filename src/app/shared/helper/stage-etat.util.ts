import { TranslocoService } from '@jsverse/transloco';

export type StageEtat =
  | 'OUVERT'
  | 'EN_TRAITEMENT'
  | 'ENTENTE_ENVOYEE'
  | 'ACCEPTE'
  | 'STAGE_ECHEC'
  | 'ANNULE';

export interface StageEtatUi {
  label: string;
  icon: string;
}
export function formatStatut(value: string): string {
  return `statutStage.${value}`;
}

export function getStageEtatUi(
  etat: string | null | undefined,
  transloco: TranslocoService
): StageEtatUi {
  const map: Record<string, StageEtatUi> = {
    OUVERT: {
      label: transloco.translate('etatStage.OUVERT'),
      icon: '🟡',
    },
    ENTENTE_ENVOYEE: {
      label: transloco.translate('etatStage.ENTENTE_ENVOYEE'),
      icon: '📄',
    },
    ACCEPTE: {
      label: transloco.translate('etatStage.ACCEPTE'),
      icon: '✅',
    },
    EN_TRAITEMENT: {
      label: transloco.translate('etatStage.EN_TRAITEMENT'),
      icon: '⚡',
    },
    STAGE_ECHEC: {
      label: transloco.translate('etatStage.STAGE_ECHEC'),
      icon: '❌',
    },
    ANNULE: {
      label: transloco.translate('etatStage.ANNULE'),
      icon: '❌',
    },
  };

  return (
    map[etat ?? ''] ?? {
      label: etat ?? '-',
      icon: '•',
    }
  );
}