import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async verifyToken(token: string) {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(token);

      if (error || !user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    try {
      const { data: { user }, error } = await this.supabase.auth.admin.getUserById(userId);

      if (error || !user) {
        return false;
      }

      return user.user_metadata?.isAdmin === true;
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
  }
}