export interface AppointmentTypes {
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
    }
  ]
}