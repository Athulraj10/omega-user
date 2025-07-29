import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  slug: string;
  description?: string;
  item: number;
  num: number;
  persantine: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
  slug: string;
  item: number;
}

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/categories');
      
      if (response.data?.data) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refreshCategories
  };
};