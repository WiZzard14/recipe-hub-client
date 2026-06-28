export type Role = 'user' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
  isBlocked?: boolean;
  isPremium: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Recipe {
  _id: string;
  recipeName: string;
  recipeImage: string;
  category: string;
  cuisineType: string;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  preparationTime: string;
  ingredients: string[];
  instructions: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  likes?: string[];
  likesCount: number;
  isFeatured: boolean;
  status: 'active' | 'removed';
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedRecipes {
  data: Recipe[];
  categories: string[];
  pagination: Pagination;
}

export interface RecipeDetailsResponse {
  recipe: Recipe;
  isFavorite: boolean;
  isPurchased: boolean;
}

export interface UserStats {
  totalRecipes: number;
  totalFavorites: number;
  totalLikesReceived: number;
  isPremium: boolean;
  hasPremiumPayment: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalRecipes: number;
  totalPremiumMembers: number;
  totalReports: number;
}

export interface Payment {
  _id: string;
  userEmail: string;
  amount: number;
  currency: string;
  type: 'premium' | 'recipe';
  recipeId?: Recipe | string;
  transactionId: string;
  paymentStatus: string;
  paidAt: string;
}

export interface ReportItem {
  _id: string;
  recipeId?: Recipe;
  reporterEmail: string;
  reason: 'Spam' | 'Offensive Content' | 'Copyright Issue';
  status: 'pending' | 'dismissed' | 'removed';
  createdAt: string;
}

export interface ApiMessage {
  message: string;
}
