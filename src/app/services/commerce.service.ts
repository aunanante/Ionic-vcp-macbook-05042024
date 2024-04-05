import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommerceService {

  private supabase: SupabaseClient;
  private clickedCommerceSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private commercesSubject = new BehaviorSubject<any[]>([]);
  commerces$ = this.commercesSubject.asObservable();


  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getCommercesByBusinessOwnerWithMonthlyFeePaid(businessOwnerId: string): Promise<any[]> {
    try {
      // Fetch the business owner with the given ID
      const { data: businessOwner, error } = await this.supabase
        .from('business_owners')
        .select('*')
        .eq('id', businessOwnerId)
        .single();

      if (error) {
        throw error;
      }

      // Check if the business owner has paid the monthly fee
      if (businessOwner && businessOwner.monthly_fee_paid) {
        // Fetch the commerces owned by this business owner
        const { data: commerces, error: commerceError } = await this.supabase
          .from('commerces')
          .select('*')
          .eq('business_owner_id', businessOwnerId);
        if (commerceError) {
          throw commerceError;
        }

        return commerces || [];
      } else {
        // Business owner has not paid the monthly fee, return empty array
        return [];
      }
    } catch (error) {
      throw error;
    }
  }

  // Fetch all villes from the villes table
  async getAllVilles(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('villes')
        .select('*');

      if (error) {
        console.error('Error fetching all villes:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async addCommerce(commerceData: any): Promise<any | null> {
    try {
      // Perform the insertion and select the newly inserted record
      const { data, error } = await this.supabase
        .from('commerces')
        .insert([commerceData])
        .select('*');

      if (error) {
        console.error('Error adding commerce:', error.message);
        return null;
      }

      if (data && data.length > 0) {
        console.log('Commerce added successfully:', data[0]);
        return data[0];
      } else {
        console.error('Error adding commerce: No data returned');
        return null;
      }
    } catch (error) {
      console.error('Error adding commerce:', error);
      return null;
    }
  }

  // Fetch ville name by ville ID
  async getVilleNameByVilleId(villeId: number): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('villes')
        .select('villename')
        .eq('id', villeId)
        .single();

      if (error) {
        console.error('Error fetching ville name by ID:', error.message);
        return null;
      }

      return data ? data.villename : null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async updateCommerce(commerceData: any): Promise<boolean> {
    try {
      const { id, commercename, image_commerce, services, ville_id } = commerceData;

      // Check if all required fields are provided
      if (!id || !commercename || !services || !ville_id) {
        console.error('Required fields are missing for updating commerce.');
        return false;
      }

      // Perform the update operation
      const { error } = await this.supabase
        .from('commerces')
        .update({
          commercename,
          image_commerce,
          services,
          ville_id
        })
        .eq('id', id); // Update the commerce with the provided ID

      if (error) {
        console.error('Error updating commerce:', error.message);
        return false;
      }

      console.log('Commerce updated successfully.');
      return true;
    } catch (error) {
      console.error('Error updating commerce:', error);
      return false;
    }
  }

  async deleteCommerce(commerceId: number): Promise<boolean> {
    try {
      // Delete commerce with the provided ID
      const { error } = await this.supabase
        .from('commerces')
        .delete()
        .eq('id', commerceId);

      if (error) {
        console.error('Error deleting commerce:', error.message);
        return false; // Return false if there's an error
      }

      return true; // Return true if deletion is successful
    } catch (error) {
      console.error('Error deleting commerce:', (error as Error).message);
      return false; // Return false if there's an error
    }
  }

  async getCommerceById(commerceId: number) {
    try {
      // Fetch commerce with the given ID from the database
      const { data, error } = await this.supabase
        .from('commerces')
        .select('*')
        .eq('id', commerceId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching commerce by ID:', error.message);
      throw error;
    }
  }

  async getCommercesByVilleId(villeId: number): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('commerces')
        .select(`
          id,
          commercename,
          services,
          image_commerce,
          business_owner_id,
          ville_id,
          created_at,
          business_owners (
            id,
            email,
            name,
            adresse,
            telephone1,
            telephone2,
            monthly_fee_paid
          )
        `)
        .eq('ville_id', villeId)
        .order('commercename', { ascending: true });

      if (error) {
        console.error('Error fetching commerces by villeId:', error.message);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async searchCommerces(query: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('commerces')
        .select(`
          id,
          commercename,
          services,
          image_commerce,
          business_owner_id,
          ville_id,
          created_at,
          business_owners (
            id,
            email,
            name,
            adresse,
            telephone1,
            telephone2,
            monthly_fee_paid
          )
        `)
        .or(`commercename.ilike.%${query}%, services.ilike.%${query}%`) // Add search on services field
        .order('commercename', { ascending: true });

      if (error) {
        console.error('Error searching commerces:', error.message);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getAllCommercesBelongingOwnersWithMonthlyFeePaid(): Promise<any[]> {
    try {
      // Fetch all business owners
      const { data: allBusinessOwners, error: businessOwnersError } = await this.supabase
        .from('business_owners')
        .select('*');

      if (businessOwnersError) {
        throw businessOwnersError;
      }

      // Filter business owners who have paid the monthly fee
      const businessOwnersWithFeePaid = allBusinessOwners.filter(owner => owner.monthly_fee_paid);

      // Fetch commerces owned by business owners who have paid the monthly fee
      const allCommerces = await Promise.all(businessOwnersWithFeePaid.map(async owner => {
        const { data: commerces, error: commerceError } = await this.supabase
          .from('commerces')
          .select('*')
          .eq('business_owner_id', owner.id);

        if (commerceError) {
          throw commerceError;
        }

        return commerces || [];
      }));

      // Flatten the array of arrays into a single array
      const allCommercesFlat = allCommerces.flat();

      return allCommercesFlat;
    } catch (error) {
      throw error;
    }
  }


  // Method to set the clicked commerce
  setClickedCommerce(commerce: any) {
    this.clickedCommerceSubject.next(commerce);
  }

  // Method to get the clicked commerce as an Observable
  getClickedCommerce() {
    return this.clickedCommerceSubject.asObservable();
  }

  setCommerces(commerces: any[]) {
    this.commercesSubject.next(commerces);
  }

  // Method to fetch all commerces from Supabase
  async fetchCommerces() {
    try {
      const response = await this.supabase.from('commerces').select('*');
      if (response.error) {
        console.error('Error fetching commerces:', response.error.message);
        return [];
      }
      this.commercesSubject.next(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching commerces:', error.message);
      return [];
    }
  }

  // Method to search commerces based on commercename or services
  async searchingCommerces(searchTerm: string) {
    searchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase
    try {
      // Fetch all commerces belonging to owners with monthly fees paid
      const allCommerces = await this.getAllCommercesBelongingOwnersWithMonthlyFeePaid();

      // Filter commerces based on search term
      const filteredCommerces = allCommerces.filter((commerce) => {
        return (
          commerce.commercename.toLowerCase().includes(searchTerm) ||
          commerce.services.toLowerCase().includes(searchTerm)
        );
      });

      this.commercesSubject.next(filteredCommerces);
      return filteredCommerces;
    } catch (error: any) {
      console.error('Error searching commerces:', error.message);
      return [];
    }
  }


  getVillesFromCommerces(commerces: any[]): { id: number, villename: string }[] {
    // Initialize an empty array to store unique ville objects
    const villesList: { id: number, villename: string }[] = [];

    // Iterate over the commerces array
    for (const commerce of commerces) {
      // Check if the commerce has ville_id and villeName properties
      if (commerce.ville_id && commerce.villeName) {
        // Check if the ville_id is not already in the villesList
        if (!villesList.some(ville => ville.id === commerce.ville_id)) {
          // Add the ville_id and villeName to the villesList array
          villesList.push({ id: commerce.ville_id, villename: commerce.villeName });
        }
      }
    }

    // Return the list of unique ville objects
    return villesList;
  }

  async getCommercesByVilleId1(villeId: number): Promise<any[]> {
    try {
        // Fetch all commerces belonging to owners with monthly fees paid
        const allCommerces = await this.getAllCommercesBelongingOwnersWithMonthlyFeePaid();

        // Filter commerces by villeId
        const commercesByVilleId = allCommerces.filter(commerce => commerce.ville_id === villeId);

        return commercesByVilleId;
    } catch (error: any) {
        console.error('Error fetching commerces by villeId:', error.message);
        throw error;
    }
}



}
