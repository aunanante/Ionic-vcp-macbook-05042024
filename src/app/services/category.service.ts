import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getCategoriesByCommerceId(commerceId: number): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('commerce_id', commerceId)
        .order('id', { ascending: false }); // Order by ID in descending order
  
      if (error) {
        throw error;
      }
       
      return data || [];
    } catch (error: any) {
      console.error('Error fetching categories by commerce ID:', error.message);
      throw error;
    }
  }
  

  async addCategory(categoryData: any): Promise<boolean> {
    try {
      // Insert the category data into the categories table
      const { error } = await this.supabase
        .from('categories')
        .insert(categoryData);
      
      if (error) {
        console.error('Error adding category:', error.message);
        return false; // Return false in case of error
      }
      
      return true; // Return true if category added successfully
    } catch (error: any) {
      console.error('Error adding category:', error.message);
      return false; // Return false in case of error
    }
  }

  async updateCategory(categoryId: number, categoryData: any): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('categories')
        .update(categoryData)
        .eq('id', categoryId);
      
      if (error) {
        console.error('Error updating category:', error.message);
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error updating category:', error.message);
      return false;
    }
  }

  async deleteCategory(categoryId: number): Promise<boolean> {
    try {
      // Delete the category with the specified ID
      const { error } = await this.supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) {
        console.error('Error deleting category:', error.message);
        return false; // Return false in case of error
      }

      return true; // Return true if category deleted successfully
    } catch (error: any) {
      console.error('Error deleting category:', error.message);
      return false; // Return false in case of error
    }
  }

  async getCategoryByCategoryId(categoryId: number) {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
      
      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  async getCommerceIdByCategoryId(categoryId: number): Promise<number | null> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('commerce_id')
        .eq('id', categoryId)
        .single();
  
      if (error) {
        throw error;
      }
  
      return data ? data.commerce_id : null;
    } catch (error) {
      console.error('Error fetching commerceId by categoryId:', error);
      throw error;
    }
  }
  
  
}
