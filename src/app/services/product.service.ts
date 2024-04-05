import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getProductsByCategoryId(categoryId: number): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(productId: number): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async addProduct(formData: any): Promise<any> {
    try {
      // Insert the new product into the 'products' table and then select the inserted row
      const { data: insertedProduct, error } = await this.supabase.from('products').insert([
        {
          productname: formData.productname,
          reference: formData.reference,
          price: formData.price,
          description: formData.description,
          image_product: formData.image_product,
          business_owner_id: formData.business_owner_id,
          ville_id: formData.ville_id,
          commerce_id: formData.commerce_id,
          category_id: formData.category_id
        }
      ]).select('*');
  
      if (error) {
        console.error('Error adding product:', error.message);
        return null;
      }
  
      if (insertedProduct && insertedProduct.length > 0) {
        console.log('Product added successfully:', insertedProduct[0]);
        return insertedProduct[0];
      } else {
        console.error('Failed to add product:', insertedProduct);
        return null;
      }
      
    } catch (error : any) {
      console.error('Error adding product:', error.message);
      return null;
    }
  }

  async updateProduct(productId: number, formData: any): Promise<boolean> {
    try {
      // Attempt to update the product in the database
      const { error } = await this.supabase
        .from('products')
        .update(formData)
        .eq('id', productId);

      if (error) {
        console.error('Error updating product:', error.message);
        return false; // Return false in case of error
      } else {
        console.log('Product updated successfully.');
        return true; // Return true if the update was successful
      }
    } catch (error : any) {
      console.error('Error updating product:', error.message);
      return false; // Return false in case of error
    }
  }

  async deleteProduct(productId: number): Promise<boolean> {
    try {
      // Attempt to delete the product from the database
      const { error } = await this.supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error.message);
        return false; // Return false in case of error
      } else {
        console.log('Product deleted successfully.');
        return true; // Return true if the deletion was successful
      }
    } catch (error : any) {
      console.error('Error deleting product:', error.message);
      return false; // Return false in case of error
    }
  }
  
} 
