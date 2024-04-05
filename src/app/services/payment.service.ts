import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserService } from './user.service'; // Import UserService
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private supabase: SupabaseClient;

  constructor(private userService: UserService) {
    // Initialize Supabase client
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Simulated function to approve payment
  private async simulateMomoApproval(): Promise<boolean> {
    // Simulate an asynchronous process (e.g., API call to Momo)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate a successful payment approval (change to 'false' to simulate a failed approval)
        const isApproved = true;
        resolve(isApproved);
      }, 2000); // Simulating a 2-second delay for the approval process
    });
  }

  async makePayment(
    paymentDataRecord: any
  ): Promise<string | null | undefined> {
    try {
      // Simulate Momo approval
      const isMomoApproved = await this.simulateMomoApproval();

      if (!isMomoApproved) {
        console.error('Momo payment approval failed.');
        return null;
      }

      console.log('Continue with the payment creation and insertion');
      console.log('paymentDataRecord : ', paymentDataRecord);

      // Step 1: Insert paymentDataRecord into the payments table and retrieve the inserted record
      const { data, error } = await this.supabase
        .from('payments')
        .insert([
          {
            amount: paymentDataRecord.amount,
            duration_months: paymentDataRecord.duration_months,
            payment_date: paymentDataRecord.payment_date,
            expiry_date: paymentDataRecord.expiry_date,
          },
        ])
        .select(); // Use .select() to retrieve the inserted record
 
      if (error) {
        console.error('Error inserting payment record:', error);
        return undefined;
      }

      // Step 2: Retrieve the ID of the inserted record
      const insertedPaymentId = data[0]?.payment_id;

      return insertedPaymentId || null;
    } catch (error) {
      console.error('Error:', error);
      return undefined;
    }
  }

  async getLatestPayment(businessOwnerId: string): Promise<any | null> {
    try {
      // Step 1: Retrieve the latest payment_id associated with the businessOwnerId
      const { data: latestPayment, error: latestPaymentError } = await this.supabase
        .from('business_owners_payments')
        .select('payment_id')
        .eq('business_owner_id', businessOwnerId)
        .order('payment_id', { ascending: false })
        .limit(1);
  
      if (latestPaymentError) {
        console.error('Error fetching latest payment:', latestPaymentError);
        return null;
      }
  
      if (!latestPayment || latestPayment.length === 0) {
        console.log('No payments found for this business owner.');
        return null;
      }
  
      const latestPaymentId = latestPayment[0].payment_id;
  
      // Step 2: Retrieve the payment record associated with the latestPaymentId
      const { data: paymentRecord, error: paymentRecordError } = await this.supabase
        .from('payments')
        .select('*')
        .eq('payment_id', latestPaymentId)
        .single();
  
      if (paymentRecordError) {
        console.error('Error fetching payment record:', paymentRecordError);
        return null;
      }
  
      return paymentRecord || null;
    } catch (error) {
      console.error('Error fetching latest payment:', error);
      return null;
    }
  }


  async createBusinessOwnersPayments(businessOwnerId: string, paymentId: string): Promise<boolean> {
    try {
      // Step 1: Insert business owner and payment relationship into business_owners_payments table
      const { error } = await this.supabase
        .from('business_owners_payments')
        .insert([
          {
            business_owner_id: businessOwnerId,
            payment_id: paymentId,
          },
        ]);
  
      if (error) {
        console.error('Error inserting business owners payments data:', error.message);
        return false;
      }
  
      console.log('Business owners payments data successfully inserted.');
  
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  async updateBusinessOwnersPayments(businessOwnerId: string, latestPaymentId: string): Promise<boolean> {
    try {
      // Step 1: Update the record in the business_owners_payments table
      const { error } = await this.supabase
        .from('business_owners_payments')
        .update({
          payment_id: latestPaymentId,
        })
        .eq('business_owner_id', businessOwnerId);
  
      if (error) {
        console.error('Error updating business owners payments data:', error.message);
        return false;
      }
  
      console.log('Business owners payments data successfully updated.');
  
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  async createAccessControl(businessOwnerId: string): Promise<boolean> {
    try {
      // Step 1: Insert data into the access_control table
      const { error } = await this.supabase
        .from('access_control')
        .insert([
          {
            business_owner_id: businessOwnerId,
            access_allowed: true,
          },
        ]);
  
      if (error) {
        console.error('Error inserting access control data:', error.message);
        return false;
      }
  
      console.log('Access control data successfully inserted.');
  
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  async updateAccessControl(businessOwnerId: string): Promise<boolean> {
    try {
      // Step 1: Check if the business owner exists
      const businessOwnerExists = await this.supabase
        .from('business_owners')
        .select('id')
        .eq('id', businessOwnerId)
        .single();
  
      if (!businessOwnerExists.data) {
        console.error('Business owner does not exist.');
        return false;
      }
  
      // Step 2: Update access_control table for the specified businessOwnerId
      const { error } = await this.supabase
        .from('access_control')
        .update({ access_allowed: true })
        .eq('business_owner_id', businessOwnerId);
  
      if (error) {
        console.error('Error updating access control:', error);
        return false;
      }
  
      console.log('Access control updated successfully.');
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  async updateBusinessOwners(businessOwnerId: string): Promise<boolean> {
    try {
      // Step 1: Update the record in the business_owners table
      const { error } = await this.supabase
        .from('business_owners')
        .update({
          monthly_fee_paid: true,
        })
        .eq('id', businessOwnerId);
  
      if (error) {
        console.error('Error updating business owners data:', error.message);
        return false;
      }
  
      console.log('Business owners data successfully updated.');
  
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }


}
