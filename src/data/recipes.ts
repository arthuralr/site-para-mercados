export interface RecipeIngredient {
  productId: string;
  quantity: number;
  amountLabel: string;
}

export interface StoreRecipe {
  id: string;
  title: string;
  description: string;
  category: string;
  preparationTime: string;
  servings: number;
  image: string;
  ingredients: RecipeIngredient[];
  steps: string[];
}

export const STORE_RECIPES: StoreRecipe[] = [
  {
    id: "churrasco-pratico",
    title: "Churrasco prático de fim de semana",
    description:
      "Uma combinação de cortes selecionados e acompanhamentos para reunir a família sem complicação.",
    category: "Açougue",
    preparationTime: "50 min",
    servings: 4,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      { productId: "prod-1", quantity: 1, amountLabel: "1 kg" },
      { productId: "prod-11", quantity: 1, amountLabel: "1 pacote" },
      { productId: "prod-12", quantity: 1, amountLabel: "1 bandeja" },
      { productId: "prod-16", quantity: 1, amountLabel: "1 pacote" },
    ],
    steps: [
      "Tempere a carne e a linguiça a gosto e deixe descansar por alguns minutos.",
      "Grelhe as carnes até o ponto desejado, virando para dourar por igual.",
      "Asse o pão de alho na grelha e prepare o arroz conforme as instruções da embalagem.",
      "Sirva tudo ainda quente.",
    ],
  },
  {
    id: "salada-avocado",
    title: "Salada fresca de avocado e tomate",
    description:
      "Leve, colorida e fácil de preparar com ingredientes frescos do hortifrúti.",
    category: "Hortifrúti",
    preparationTime: "15 min",
    servings: 2,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      { productId: "prod-6", quantity: 0.5, amountLabel: "500 g" },
      { productId: "prod-8", quantity: 0.4, amountLabel: "400 g" },
      { productId: "prod-3", quantity: 1, amountLabel: "1 bandeja" },
      { productId: "prod-2", quantity: 1, amountLabel: "azeite a gosto" },
    ],
    steps: [
      "Lave e corte os tomates e os morangos em pedaços.",
      "Corte o avocado próximo da hora de servir para preservar a cor e a textura.",
      "Misture delicadamente e tempere com azeite, sal e pimenta a gosto.",
      "Sirva como acompanhamento ou entrada.",
    ],
  },
  {
    id: "linguica-pao-alho",
    title: "Linguiça assada com pão de alho",
    description:
      "Uma receita rápida para compartilhar, com acompanhamentos que já estão no nosso catálogo.",
    category: "Receita rápida",
    preparationTime: "30 min",
    servings: 3,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      { productId: "prod-11", quantity: 1, amountLabel: "1 pacote" },
      { productId: "prod-12", quantity: 1, amountLabel: "1 bandeja" },
      { productId: "prod-8", quantity: 0.3, amountLabel: "300 g" },
      { productId: "prod-15", quantity: 1, amountLabel: "1 garrafa" },
    ],
    steps: [
      "Preaqueça o forno ou a churrasqueira.",
      "Asse a linguiça até dourar e cozinhar por completo.",
      "Acrescente o pão de alho nos minutos finais, seguindo o tempo indicado na embalagem.",
      "Sirva com tomate temperado e suco gelado.",
    ],
  },
];
