export interface LoginData {
    email: string
    password: string
}
  
export interface Seller {
    _id: string;
    name: string;
    email: string;
    photo: string;
    itemsSold: number;
    preferredContact: string;
  }
  
  export enum Condition {
    NEW = 'New',
    LIKE_NEW = 'Like New',
    USED = 'Used'
  }

  export interface Product {
    title: string;
    description: string;
    images: string[];
    category: string;
    featured: boolean;
    price: number;
    condition: Condition;
    location: string;
    seller: Seller;
    createdAt: Date;
    updatedAt: Date;
  }
  