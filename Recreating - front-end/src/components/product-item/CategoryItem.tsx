import Link from "next/link";
import React from "react";
import { Category } from "@/hooks/useCategories";

interface CategoryItemProps {
  item: Category;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ item }) => {
  return (
    <div className="gi-cat-icon">
      <span className="gi-lbl">{item.persantine}</span>
      <i className={item.icon}></i>
      <div className="gi-cat-detail">
        <Link href={`/shop-left-sidebar-col-3?category=${item.slug}`}>
          <h4 className="gi-cat-title">{item.name}</h4>
        </Link>
        <p className="items">{item.item} Items</p>
      </div>
    </div>
  );
};

export default CategoryItem;
