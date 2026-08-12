// Tipos simples del objeto perdido
export type LostItem = {
  _id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  reportedBy: string;
  found: boolean;
  createdAt: string;
  updatedAt: string;
};
