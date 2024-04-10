export interface LoginData {
    email: string
    password: string
}
  
// export interface Seller {
//     _id: string;
//     name: string;
//     email: string;
//     photo: string;
//     itemsSold: number;
//     preferredContact: string;
//   }

  export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    photo: string;
    tagline: string;
    joinedDate: Date;
    itemsSold: number;
    activeListings: number;
    contactInfo: ContactInfo;
    preferredContact: string;
  }
  
  export enum Condition {
    NEW = 'New',
    LIKE_NEW = 'Like New',
    USED = 'Used'
  }

  export interface Product {
    _id: string;
    title: string;
    description: string;
    images: string[];
    category: string;
    featured: boolean;
    price: number;
    condition: Condition;
    location: string;
    seller: User;
    createdAt: Date;
    updatedAt: Date;
    sold: Boolean;
  }
  
  export interface ContactInfo {
    email: string;
    phoneNumber: string;
    whatsapp: string;
    wechat: string;
    telegram: string;
    snapchat: string;
    messenger: string;
  }

  export interface Category {
    _id: string;
    name: string;
  }
