export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          business_id: string | null
          client_id: string | null
          created_at: string
          end_time: string
          id: string
          notes: string | null
          service_id: string | null
          staff_id: string | null
          start_time: string
          status: string | null
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          client_id?: string | null
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          service_id?: string | null
          staff_id?: string | null
          start_time: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          client_id?: string | null
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          service_id?: string | null
          staff_id?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_holder_name: string | null
          account_number: string
          account_type: string | null
          bank_name: string | null
          business_id: string | null
          created_at: string
          id: string
          routing_number: string
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number: string
          account_type?: string | null
          bank_name?: string | null
          business_id?: string | null
          created_at?: string
          id?: string
          routing_number: string
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string
          account_type?: string | null
          bank_name?: string | null
          business_id?: string | null
          created_at?: string
          id?: string
          routing_number?: string
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_links: {
        Row: {
          active: boolean | null
          business_id: string | null
          created_at: string
          id: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          business_id?: string | null
          created_at?: string
          id?: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          business_id?: string | null
          created_at?: string
          id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_links_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          business_id: string | null
          close_time: string | null
          created_at: string
          day_of_week: number | null
          id: string
          is_open: boolean | null
          open_time: string | null
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          close_time?: string | null
          created_at?: string
          day_of_week?: number | null
          id?: string
          is_open?: boolean | null
          open_time?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          close_time?: string | null
          created_at?: string
          day_of_week?: number | null
          id?: string
          is_open?: boolean | null
          open_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          address_verified: boolean | null
          created_at: string
          id: string
          name: string | null
          owner_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          address_verified?: boolean | null
          created_at?: string
          id?: string
          name?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          address_verified?: boolean | null
          created_at?: string
          id?: string
          name?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_metrics: {
        Row: {
          campaign_id: string | null
          created_at: string
          id: string
          percent_clicked: number | null
          percent_opened: number | null
          percent_unsubscribed: number | null
          revenue_lift: number | null
          updated_at: string
          users_clicked: number | null
          users_engaged: number | null
          users_opened: number | null
          users_targeted: number | null
          users_unsubscribed: number | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          percent_clicked?: number | null
          percent_opened?: number | null
          percent_unsubscribed?: number | null
          revenue_lift?: number | null
          updated_at?: string
          users_clicked?: number | null
          users_engaged?: number | null
          users_opened?: number | null
          users_targeted?: number | null
          users_unsubscribed?: number | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          percent_clicked?: number | null
          percent_opened?: number | null
          percent_unsubscribed?: number | null
          revenue_lift?: number | null
          updated_at?: string
          users_clicked?: number | null
          users_engaged?: number | null
          users_opened?: number | null
          users_targeted?: number | null
          users_unsubscribed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          business_id: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          business_id: string | null
          campaign_type: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          campaign_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          campaign_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          completed_onboarding: boolean | null
          created_at: string
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          phone_verified: boolean | null
          updated_at: string
        }
        Insert: {
          completed_onboarding?: boolean | null
          created_at?: string
          email_verified?: boolean | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          updated_at?: string
        }
        Update: {
          completed_onboarding?: boolean | null
          created_at?: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          business_id: string | null
          cancellation_hours: number | null
          created_at: string
          deposit_amount: number | null
          deposit_type: string | null
          description: string | null
          forfeit_deposit: boolean | null
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          cancellation_hours?: number | null
          created_at?: string
          deposit_amount?: number | null
          deposit_type?: string | null
          description?: string | null
          forfeit_deposit?: boolean | null
          id?: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          cancellation_hours?: number | null
          created_at?: string
          deposit_amount?: number | null
          deposit_type?: string | null
          description?: string | null
          forfeit_deposit?: boolean | null
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_members: {
        Row: {
          bio: string | null
          business_id: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          profile_image_url: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          business_id?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          profile_image_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          business_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          profile_image_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_unassigned_appointments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_email_exists: {
        Args: {
          email_to_check: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
