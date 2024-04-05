import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DetailService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getDetailsByProductId(productId: number): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('details')
        .select('*')
        .eq('product_id', productId);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching details by product ID:', error);
      throw error;
    }
  }

  async getDetailById(detailId: number): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('details')
        .select('*')
        .eq('id', detailId)
        .single();

      if (error) {
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching detail by ID:', error);
      throw error;
    }
  }

  async addDetail(detailData: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('details')
        .insert([detailData])
        .select('*');

      if (error) {
        throw error;
      }

      return data[0] || null;
    } catch (error) {
      console.error('Error adding detail:', error);
      throw error;
    }
  }

  async updateDetail(detailId: number, detailData: any): Promise<boolean> {
    try {
      // Attempt to update the detail in the database
      const { error } = await this.supabase
        .from('details')
        .update(detailData)
        .eq('id', detailId);

      if (error) {
        console.error('Error updating detail:', error.message);
        return false; // Return false in case of error
      } else {
        console.log('Detail updated successfully.');
        return true; // Return true if the update was successful
      }
    } catch (error: any) {
      console.error('Error updating detail:', error.message);
      return false; // Return false in case of error
    }
  }

  async deleteDetail(detailId: number): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('details')
        .delete()
        .eq('id', detailId);

      if (error) {
        console.error('Error deleting detail:', error.message);
        return false;
      } else {
        console.log('Detail deleted successfully.');
        return true;
      }
    } catch (error: any) {
      console.error('Error deleting detail:', error.message);
      return false;
    }
  }
  
}
