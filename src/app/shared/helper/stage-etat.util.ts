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
  cssClass:string;
  iconTitle:string;
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
      iconTitle: 'edit_note',
      cssClass: 'stage-pill-open',
    },
    ENTENTE_ENVOYEE: {
      labelKey: 'etatStage.ENTENTE_ENVOYEE',
      icon: '📄',
      iconTitle: 'mail',
      cssClass: 'stage-pill-sent',
    },
    ACCEPTE: {
      labelKey: 'etatStage.ACCEPTE',
      icon: '✅',
      iconTitle: 'check_circle',
      cssClass: 'stage-pill-accepted', 
    },
    EN_TRAITEMENT: {
      labelKey: 'etatStage.EN_TRAITEMENT',
      icon: '⚡',
      iconTitle: 'hourglass_top',
      cssClass: 'stage-pill-processing',
    },
    STAGE_ECHEC: {
      labelKey: 'etatStage.STAGE_ECHEC',
      icon: '❌',
      iconTitle: 'warning',
      cssClass: 'stage-pill-failed',
    },
    ANNULE: {
      labelKey: 'etatStage.ANNULE',
      icon: '❌',
      iconTitle: 'cancel',
      cssClass: 'stage-pill-cancelled',
    },
  };

  return (
    map[etat ?? ''] ?? {
      labelKey: '',
      icon: '•',
    }
  );
}