export interface MarketCompetitor {
  id: string;
  name: string;
  neighborhood: string;
  prices: Record<string, number>;
}

export interface MarketCompetitorRow {
  id: string;
  nome: string;
  bairro: string;
  precos_json: Record<string, number> | null;
  atualizado_em?: string;
}
