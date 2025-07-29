interface Category {
  name: string;
  persantine: string;
  icon: string;
  image: string;
  item: number;
  num: number;
}

// Empty array as fallback - categories are now fetched dynamically from backend
const category: Category[] = [];

export default category;
