import * as types from '../actions/types';

interface Item {
  id: number;
  title: string;
  oldPrice: number;
  waight: string;
  image: string;
  imageTwo: string;
  date: string;
  status: string;
  rating: number;
  newPrice: number;
  location: string;
  brand: string;
  sku: number;
  category: string;
  quantity: number;
}

export interface CompareState {
  compare: Item[];
}

const initialState: CompareState = {
  compare: [
    {
      id: 63,
      title: "Long lasting perfume",
      image: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/50_1.jpg",
      imageTwo: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/50_1.jpg",
      category: "perfume",
      newPrice: 25.0,
      oldPrice: 30.0,
      rating: 4,
      date: "",
      waight: "5 pcs",
      location: "in Store, Online",
      brand: "Bhisma Organice",
      sku: 55555,
      status: "Out Off Stock",
      quantity: 1,
    },
    {
      id: 2,
      title: "Men's stylish printed shirt",
      date: "",
      image: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/32_1.jpg",
      imageTwo: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/32_2.jpg",
      category: "men's wear",
      newPrice: 59.0,
      oldPrice: 87.0,
      location: "Online",
      waight: "1 pcs",
      brand: "Bhisma Organice",
      sku: 24433,
      rating: 4,
      status: "Available",
      quantity: 1,
    },
    {
      id: 1831,
      title: "Blue berry",
      date: "",
      image: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/23_1.jpg",
      imageTwo: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/23_1.jpg",
      category: "Fresh Fruits",
      newPrice: 11.0,
      oldPrice: 12.0,
      location: "Online",
      brand: "Bhisma Organice",
      sku: 23456,
      waight: "500 g",
      rating: 3,
      status: "Out Of Stock",
      quantity: 1,
    },
  ],
};

const compareReducer = (state = initialState, action: any): CompareState => {
  switch (action.type) {
    case types.ADD_COMPARE:
      return {
        ...state,
        compare: [...state.compare, action.payload],
      };

    case types.REMOVE_COMPARE_ITEM:
      return {
        ...state,
        compare: state.compare.filter(item => item.id !== action.payload),
      };

    default:
      return state;
  }
};

export default compareReducer; 