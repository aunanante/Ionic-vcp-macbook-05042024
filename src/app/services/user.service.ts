import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; // Updated import
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private supabase: SupabaseClient;

  private currentUserEmailKey = 'currentUserEmail';
  constructor(private storage: Storage) {
    this.initStorage(); // Initialize storage when the service is created
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Initialize storage
  async initStorage() {
    await this.storage.create();
  }

  // Set the current user's email in Ionic Storage
  async setCurrentUserEmail(email: string) {
    await this.storage.set(this.currentUserEmailKey, email);
  }

  // Get the current user's email from Ionic Storage
  async getCurrentUserEmail(): Promise<string | null> {
    return await this.storage.get(this.currentUserEmailKey);
  }

  // **************************************************

  // Get business owners associated with a specific email
  async getBusinessOwnersByEmail(email: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('business_owners')
      .select('*')
      .eq('email', email);

    if (error) {
      console.error('Error fetching business owners:', error);
      return [];
    }

    return data || [];
  }

  async getAllBusinessOwners(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('business_owners')
      .select('*');
 
    if (error) {
      console.error('Error fetching business owners:', error);
      return [];
    }

    return data || [];
  }

  // Get business owner by ID
  async getBusinessOwnerById(id: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('business_owners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching business owner by ID:', error);
      return null;
    }

    return data || null;
  }

  async addBusinessOwner(businessOwner: any): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('business_owners')
        .insert([businessOwner]);

      if (error) {
        console.error('Error adding business owner:', error);
        return false;
      }

      return true; // Success
    } catch (error) {
      console.error('Error adding business owner:', error);
      return false;
    }
  }

  // Update an existing business owner
  async updateBusinessOwner(businessOwner: any): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('business_owners')
        .upsert([businessOwner]);

      if (error) {
        console.error('Error updating business owner:', error);
        return false; // Return false if there's an error
      }

      return true; // Return true if the operation is successful
    } catch (error) {
      console.error('Error updating business owner:', error);
      return false; // Return false if there's an error
    }
  }

  // Delete a business owner by ID
  async deleteBusinessOwner(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('business_owners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting business owner:', error);
      return false;
    }

    return true;
  }

  // Get the monthly_fee_paid status for a business owner
  async getMonthlyFeePaidStatus(businessOwnerId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('business_owners')
        .select('monthly_fee_paid')
        .eq('id', businessOwnerId)
        .single();

      if (error) {
        console.error('Error fetching monthly fee paid status:', error);
        return false; // Handle the error as needed
      }

      // If data is not null, return the monthly_fee_paid value
      return data ? data.monthly_fee_paid : false;
    } catch (error) {
      console.error('Error fetching monthly fee paid status:', error);
      return false; // Handle the error as needed
    }
  }

  async getCurrentUserId(): Promise<string | null> {
    const userEmail = await this.getCurrentUserEmail();
    if (userEmail) {
      const { data, error } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (error) {
        console.error('Error fetching user ID:', error.message);
        return null;
      }

      if (data) {
        return data.id;
      }
    }
    return null;
  }

  async uploadImage(file: File): Promise<string | null> {
    try {
      // Upload the blob data to Supabase storage
      const fileName = this.generateFileName();
      const { data, error } = await this.supabase.storage
        .from('imageries')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error.message);
        return null;
      } else {
        // Construct the URL based on the generated file name.
        const imageUrl = `${environment.supabaseUrl}/storage/v1/object/public/imageries/${fileName}`;
        return imageUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  private generateFileName(): string {
    // Generate a unique file name for the image
    return `${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`;
  }

  async deleteBusinessOwnerByEmail(email: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('business_owners')
        .delete()
        .eq('email', email);
  
      if (error) {
        console.error('Error deleting business owner:', error);
        return false; // Return false if there's an error
      }
  
      return true; // Return true if the deletion is successful
    } catch (error) {
      console.error('Error deleting business owner:', error);
      return false; // Return false if there's an error
    }
  } 

  async getBusinessOwnerId(): Promise<string | null> {
    try {
      // Step 1: Get the current user's email
      const userEmail = await this.getCurrentUserEmail();
      
      if (!userEmail) {
        console.error('User email not found.');
        return null;
      }

      // Step 2: Get business owners associated with the user's email
      const businessOwners = await this.getBusinessOwnersByEmail(userEmail);

      if (businessOwners.length === 0) {
        console.error('No business owner found for the user email:', userEmail);
        return null;
      }

      // Step 3: Extract the business owner ID
      const businessOwnerId = businessOwners[0].id;

      return businessOwnerId;
    } catch (error) {
      console.error('Error getting business owner ID:', error);
      return null;
    }
  }
  
}
