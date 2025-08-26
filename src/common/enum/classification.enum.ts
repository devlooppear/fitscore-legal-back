export enum FitScoreClassification {
  FIT_ALTISSIMO = 'FIT_ALTISSIMO',
  FIT_APROVADO = 'FIT_APROVADO',
  FIT_QUESTIONAVEL = 'FIT_QUESTIONAVEL',
  FORA_DO_PERFIL = 'FORA_DO_PERFIL',
}

export const FitScoreDescriptions: Record<FitScoreClassification, string> = {
  [FitScoreClassification.FIT_ALTISSIMO]: 'FitScore Altíssimo',
  [FitScoreClassification.FIT_APROVADO]: 'FitScore Aprovado',
  [FitScoreClassification.FIT_QUESTIONAVEL]: 'FitScore Questionável',
  [FitScoreClassification.FORA_DO_PERFIL]: 'Fora do Perfil',
};
