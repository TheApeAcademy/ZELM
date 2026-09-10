export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          avatar_path: string | null
          bio: string | null
          cover_path: string | null
          created_at: string
          display_name: string
          headline: string | null
          id: string
          kind: Database["public"]["Enums"]["account_kind"]
          location_city: string | null
          location_country: string | null
          onboarding_completed: boolean
          updated_at: string
          username: string
          website_url: string | null
        }
        Insert: {
          avatar_path?: string | null
          bio?: string | null
          cover_path?: string | null
          created_at?: string
          display_name: string
          headline?: string | null
          id: string
          kind: Database["public"]["Enums"]["account_kind"]
          location_city?: string | null
          location_country?: string | null
          onboarding_completed?: boolean
          updated_at?: string
          username: string
          website_url?: string | null
        }
        Update: {
          avatar_path?: string | null
          bio?: string | null
          cover_path?: string | null
          created_at?: string
          display_name?: string
          headline?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["account_kind"]
          location_city?: string | null
          location_country?: string | null
          onboarding_completed?: boolean
          updated_at?: string
          username?: string
          website_url?: string | null
        }
        Relationships: []
      }
      activity_events: {
        Row: {
          customer_id: string | null
          event_type: string
          id: number
          metadata: Json
          occurred_at: string
          path: string | null
          project_id: string | null
          session_id: string | null
        }
        Insert: {
          customer_id?: string | null
          event_type: string
          id?: never
          metadata?: Json
          occurred_at?: string
          path?: string | null
          project_id?: string | null
          session_id?: string | null
        }
        Update: {
          customer_id?: string | null
          event_type?: string
          id?: never
          metadata?: Json
          occurred_at?: string
          path?: string | null
          project_id?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_overview"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "activity_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "activity_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      audience_stats: {
        Row: {
          account_id: string
          engagement_rate: number | null
          followers: number | null
          platform: Database["public"]["Enums"]["social_platform"]
        }
        Insert: {
          account_id: string
          engagement_rate?: number | null
          followers?: number | null
          platform: Database["public"]["Enums"]["social_platform"]
        }
        Update: {
          account_id?: string
          engagement_rate?: number | null
          followers?: number | null
          platform?: Database["public"]["Enums"]["social_platform"]
        }
        Relationships: [
          {
            foreignKeyName: "audience_stats_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor: string
          corrects_entry_id: number | null
          details: Json
          entity_id: string | null
          entity_type: string
          id: number
          occurred_at: string
          reason: string | null
        }
        Insert: {
          action: string
          actor: string
          corrects_entry_id?: number | null
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: never
          occurred_at?: string
          reason?: string | null
        }
        Update: {
          action?: string
          actor?: string
          corrects_entry_id?: number | null
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: never
          occurred_at?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_corrects_entry_id_fkey"
            columns: ["corrects_entry_id"]
            isOneToOne: false
            referencedRelation: "audit_log"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_days: {
        Row: {
          account_id: string
          day: string
          status: Database["public"]["Enums"]["availability_status"]
        }
        Insert: {
          account_id: string
          day: string
          status: Database["public"]["Enums"]["availability_status"]
        }
        Update: {
          account_id?: string
          day?: string
          status?: Database["public"]["Enums"]["availability_status"]
        }
        Relationships: [
          {
            foreignKeyName: "availability_days_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transfer_receiving_accounts: {
        Row: {
          active: boolean
          beneficiary_name: string
          currency: string
          details: Json
          id: string
          provider: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          active?: boolean
          beneficiary_name: string
          currency: string
          details?: Json
          id?: string
          provider?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          active?: boolean
          beneficiary_name?: string
          currency?: string
          details?: Json
          id?: string
          provider?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          brand_account_id: string
          campaign_id: string | null
          created_at: string
          created_by: string
          ends_on: string | null
          id: string
          person_account_id: string
          rate_amount: number | null
          rate_currency: string | null
          starts_on: string | null
          status: Database["public"]["Enums"]["booking_status"]
          title: string
        }
        Insert: {
          brand_account_id: string
          campaign_id?: string | null
          created_at?: string
          created_by: string
          ends_on?: string | null
          id?: string
          person_account_id: string
          rate_amount?: number | null
          rate_currency?: string | null
          starts_on?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          title: string
        }
        Update: {
          brand_account_id?: string
          campaign_id?: string | null
          created_at?: string
          created_by?: string
          ends_on?: string | null
          id?: string
          person_account_id?: string
          rate_amount?: number | null
          rate_currency?: string | null
          starts_on?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_brand_account_id_fkey"
            columns: ["brand_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_person_account_id_fkey"
            columns: ["person_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_collections: {
        Row: {
          brand_account_id: string
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          brand_account_id: string
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          brand_account_id?: string
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "brand_collections_brand_account_id_fkey"
            columns: ["brand_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_profiles: {
        Row: {
          account_id: string
          brand_story: string | null
          category: string | null
          founded_year: number | null
          updated_at: string
        }
        Insert: {
          account_id: string
          brand_story?: string | null
          category?: string | null
          founded_year?: number | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          brand_story?: string | null
          category?: string | null
          founded_year?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_profiles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_applications: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          message: string | null
          person_account_id: string
          rate_amount: number | null
          rate_currency: string | null
          status: Database["public"]["Enums"]["application_status"]
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          message?: string | null
          person_account_id: string
          rate_amount?: number | null
          rate_currency?: string | null
          status?: Database["public"]["Enums"]["application_status"]
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          message?: string | null
          person_account_id?: string
          rate_amount?: number | null
          rate_currency?: string | null
          status?: Database["public"]["Enums"]["application_status"]
        }
        Relationships: [
          {
            foreignKeyName: "campaign_applications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_applications_person_account_id_fkey"
            columns: ["person_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_invitations: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          message: string | null
          person_account_id: string
          status: Database["public"]["Enums"]["invitation_status"]
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          message?: string | null
          person_account_id: string
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          message?: string | null
          person_account_id?: string
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Relationships: [
          {
            foreignKeyName: "campaign_invitations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_invitations_person_account_id_fkey"
            columns: ["person_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          application_deadline: string | null
          brand_account_id: string
          budget_amount: number | null
          budget_currency: string
          created_at: string
          deliverables: string | null
          description: string | null
          ends_on: string | null
          id: string
          location: string | null
          requirements: string | null
          starts_on: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          style: string | null
          talent_types: Database["public"]["Enums"]["professional_role"][]
          title: string
          travel_required: boolean
          updated_at: string
          usage_rights: string | null
        }
        Insert: {
          application_deadline?: string | null
          brand_account_id: string
          budget_amount?: number | null
          budget_currency?: string
          created_at?: string
          deliverables?: string | null
          description?: string | null
          ends_on?: string | null
          id?: string
          location?: string | null
          requirements?: string | null
          starts_on?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          style?: string | null
          talent_types?: Database["public"]["Enums"]["professional_role"][]
          title: string
          travel_required?: boolean
          updated_at?: string
          usage_rights?: string | null
        }
        Update: {
          application_deadline?: string | null
          brand_account_id?: string
          budget_amount?: number | null
          budget_currency?: string
          created_at?: string
          deliverables?: string | null
          description?: string | null
          ends_on?: string | null
          id?: string
          location?: string | null
          requirements?: string | null
          starts_on?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          style?: string | null
          talent_types?: Database["public"]["Enums"]["professional_role"][]
          title?: string
          travel_required?: boolean
          updated_at?: string
          usage_rights?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_account_id_fkey"
            columns: ["brand_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      card_settings: {
        Row: {
          account_id: string
          primary_media_id: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          primary_media_id?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          primary_media_id?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_settings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_settings_primary_media_id_fkey"
            columns: ["primary_media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogue_options: {
        Row: {
          description: string | null
          id: string
          included: boolean
          label: string
          multiplier: number | null
          option_key: string
          option_order: number
          price: number | null
          requires: string[] | null
          step_id: string
          unit: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          included?: boolean
          label: string
          multiplier?: number | null
          option_key: string
          option_order: number
          price?: number | null
          requires?: string[] | null
          step_id: string
          unit?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          included?: boolean
          label?: string
          multiplier?: number | null
          option_key?: string
          option_order?: number
          price?: number | null
          requires?: string[] | null
          step_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogue_options_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "catalogue_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogue_project_types: {
        Row: {
          base_price: number | null
          helper: string
          id: string
          label: string
          type_id: string
          type_order: number
          version_id: string
        }
        Insert: {
          base_price?: number | null
          helper: string
          id?: string
          label: string
          type_id: string
          type_order: number
          version_id: string
        }
        Update: {
          base_price?: number | null
          helper?: string
          id?: string
          label?: string
          type_id?: string
          type_order?: number
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalogue_project_types_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "catalogue_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogue_steps: {
        Row: {
          helper: string | null
          id: string
          included_units: number | null
          max_value: number | null
          min_value: number | null
          optional: boolean
          price_per_unit: number | null
          project_type_id: string
          question: string
          role: string
          show_if: Json | null
          step_key: string
          step_order: number
          step_type: string
          version_id: string
        }
        Insert: {
          helper?: string | null
          id?: string
          included_units?: number | null
          max_value?: number | null
          min_value?: number | null
          optional?: boolean
          price_per_unit?: number | null
          project_type_id: string
          question: string
          role?: string
          show_if?: Json | null
          step_key: string
          step_order: number
          step_type: string
          version_id: string
        }
        Update: {
          helper?: string | null
          id?: string
          included_units?: number | null
          max_value?: number | null
          min_value?: number | null
          optional?: boolean
          price_per_unit?: number | null
          project_type_id?: string
          question?: string
          role?: string
          show_if?: Json | null
          step_key?: string
          step_order?: number
          step_type?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalogue_steps_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "catalogue_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalogue_steps_version_id_project_type_id_fkey"
            columns: ["version_id", "project_type_id"]
            isOneToOne: false
            referencedRelation: "catalogue_project_types"
            referencedColumns: ["version_id", "type_id"]
          },
        ]
      }
      catalogue_versions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          notes: string | null
          published_at: string | null
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          notes?: string | null
          published_at?: string | null
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          published_at?: string | null
          version_number?: number
        }
        Relationships: []
      }
      collaboration_media: {
        Row: {
          collaboration_id: string
          media_id: string
          sort_order: number
        }
        Insert: {
          collaboration_id: string
          media_id: string
          sort_order?: number
        }
        Update: {
          collaboration_id?: string
          media_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_media_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "collaborations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborations: {
        Row: {
          brand_account_id: string
          created_at: string
          created_by: string
          description: string | null
          ends_on: string | null
          id: string
          location: string | null
          person_account_id: string
          role: string | null
          starts_on: string | null
          status: Database["public"]["Enums"]["collab_status"]
          title: string
          verified_at: string | null
        }
        Insert: {
          brand_account_id: string
          created_at?: string
          created_by: string
          description?: string | null
          ends_on?: string | null
          id?: string
          location?: string | null
          person_account_id: string
          role?: string | null
          starts_on?: string | null
          status?: Database["public"]["Enums"]["collab_status"]
          title: string
          verified_at?: string | null
        }
        Update: {
          brand_account_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          ends_on?: string | null
          id?: string
          location?: string | null
          person_account_id?: string
          role?: string | null
          starts_on?: string | null
          status?: Database["public"]["Enums"]["collab_status"]
          title?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_brand_account_id_fkey"
            columns: ["brand_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_person_account_id_fkey"
            columns: ["person_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborator_applications: {
        Row: {
          attachments: Json
          collaborator_id: string | null
          created_at: string
          email: string | null
          experience: string
          id: string
          name: string
          phone: string | null
          pitch: string
          portfolio_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          attachments?: Json
          collaborator_id?: string | null
          created_at?: string
          email?: string | null
          experience: string
          id?: string
          name: string
          phone?: string | null
          pitch: string
          portfolio_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          attachments?: Json
          collaborator_id?: string | null
          created_at?: string
          email?: string | null
          experience?: string
          id?: string
          name?: string
          phone?: string | null
          pitch?: string
          portfolio_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborator_applications_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborators: {
        Row: {
          access_code: string
          active: boolean
          bank_details: Json
          commission_rate: number
          created_at: string
          email: string | null
          id: string
          name: string
          term_end: string | null
          term_start: string
        }
        Insert: {
          access_code?: string
          active?: boolean
          bank_details?: Json
          commission_rate?: number
          created_at?: string
          email?: string | null
          id?: string
          name: string
          term_end?: string | null
          term_start: string
        }
        Update: {
          access_code?: string
          active?: boolean
          bank_details?: Json
          commission_rate?: number
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          term_end?: string | null
          term_start?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          account_id: string
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "collections_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_entries: {
        Row: {
          adjustment_for: string | null
          amount: number
          collaborator_id: string
          created_at: string
          currency: string
          id: string
          payment_id: string
          payout_id: string | null
          status: string
          week_of: string
        }
        Insert: {
          adjustment_for?: string | null
          amount: number
          collaborator_id: string
          created_at?: string
          currency: string
          id?: string
          payment_id: string
          payout_id?: string | null
          status?: string
          week_of: string
        }
        Update: {
          adjustment_for?: string | null
          amount?: number
          collaborator_id?: string
          created_at?: string
          currency?: string
          id?: string
          payment_id?: string
          payout_id?: string | null
          status?: string
          week_of?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_entries_adjustment_for_fkey"
            columns: ["adjustment_for"]
            isOneToOne: false
            referencedRelation: "collaborator_ledger"
            referencedColumns: ["entry_id"]
          },
          {
            foreignKeyName: "commission_entries_adjustment_for_fkey"
            columns: ["adjustment_for"]
            isOneToOne: false
            referencedRelation: "commission_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_entries_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_entries_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_entries_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "collaborator_payouts"
            referencedColumns: ["payout_id"]
          },
          {
            foreignKeyName: "commission_entries_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_info: {
        Row: {
          account_id: string
          email: string | null
          is_public: boolean
          phone: string | null
          whatsapp: string | null
        }
        Insert: {
          account_id: string
          email?: string | null
          is_public?: boolean
          phone?: string | null
          whatsapp?: string | null
        }
        Update: {
          account_id?: string
          email?: string | null
          is_public?: boolean
          phone?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_info_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          booking_id: string
          brand_accepted_at: string | null
          cancellation_terms: string | null
          created_at: string
          deadline: string | null
          deliverables: string | null
          id: string
          payment_amount: number | null
          payment_currency: string | null
          person_accepted_at: string | null
          usage_rights: string | null
        }
        Insert: {
          booking_id: string
          brand_accepted_at?: string | null
          cancellation_terms?: string | null
          created_at?: string
          deadline?: string | null
          deliverables?: string | null
          id?: string
          payment_amount?: number | null
          payment_currency?: string | null
          person_accepted_at?: string | null
          usage_rights?: string | null
        }
        Update: {
          booking_id?: string
          brand_accepted_at?: string | null
          cancellation_terms?: string | null
          created_at?: string
          deadline?: string | null
          deliverables?: string | null
          id?: string
          payment_amount?: number | null
          payment_currency?: string | null
          person_accepted_at?: string | null
          usage_rights?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          account_id: string
          conversation_id: string
          last_read_at: string | null
        }
        Insert: {
          account_id: string
          conversation_id: string
          last_read_at?: string | null
        }
        Update: {
          account_id?: string
          conversation_id?: string
          last_read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          campaign_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          company: string | null
          country: string | null
          email: string | null
          first_seen_at: string
          full_name: string | null
          id: string
          last_activity_at: string
          merged_into_id: string | null
          notes: string | null
          phone: string | null
          source: string
        }
        Insert: {
          company?: string | null
          country?: string | null
          email?: string | null
          first_seen_at?: string
          full_name?: string | null
          id?: string
          last_activity_at?: string
          merged_into_id?: string | null
          notes?: string | null
          phone?: string | null
          source?: string
        }
        Update: {
          company?: string | null
          country?: string | null
          email?: string | null
          first_seen_at?: string
          full_name?: string | null
          id?: string
          last_activity_at?: string
          merged_into_id?: string | null
          notes?: string | null
          phone?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "customer_overview"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customers_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_by: string
          currency: string
          id: string
          invoice_number: string | null
          issued_at: string
          line_items: Json
          payment_id: string | null
          pdf_storage_path: string | null
          project_id: string
          subtotal: number
          total: number
        }
        Insert: {
          created_by: string
          currency: string
          id?: string
          invoice_number?: string | null
          issued_at?: string
          line_items: Json
          payment_id?: string | null
          pdf_storage_path?: string | null
          project_id: string
          subtotal: number
          total: number
        }
        Update: {
          created_by?: string
          currency?: string
          id?: string
          invoice_number?: string | null
          issued_at?: string
          line_items?: Json
          payment_id?: string | null
          pdf_storage_path?: string | null
          project_id?: string
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      lookbook_items: {
        Row: {
          lookbook_id: string
          media_id: string
          sort_order: number
        }
        Insert: {
          lookbook_id: string
          media_id: string
          sort_order?: number
        }
        Update: {
          lookbook_id?: string
          media_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "lookbook_items_lookbook_id_fkey"
            columns: ["lookbook_id"]
            isOneToOne: false
            referencedRelation: "lookbooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lookbook_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
        ]
      }
      lookbooks: {
        Row: {
          account_id: string
          created_at: string
          description: string | null
          id: string
          share_slug: string
          title: string
        }
        Insert: {
          account_id: string
          created_at?: string
          description?: string | null
          id?: string
          share_slug: string
          title: string
        }
        Update: {
          account_id?: string
          created_at?: string
          description?: string | null
          id?: string
          share_slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lookbooks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      media_items: {
        Row: {
          account_id: string
          caption: string | null
          collection_id: string | null
          created_at: string
          id: string
          is_portfolio: boolean
          kind: Database["public"]["Enums"]["media_kind"]
          sort_order: number
          storage_path: string
          visibility: Database["public"]["Enums"]["visibility_level"]
        }
        Insert: {
          account_id: string
          caption?: string | null
          collection_id?: string | null
          created_at?: string
          id?: string
          is_portfolio?: boolean
          kind?: Database["public"]["Enums"]["media_kind"]
          sort_order?: number
          storage_path: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Update: {
          account_id?: string
          caption?: string | null
          collection_id?: string | null
          created_at?: string
          id?: string
          is_portfolio?: boolean
          kind?: Database["public"]["Enums"]["media_kind"]
          sort_order?: number
          storage_path?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Relationships: [
          {
            foreignKeyName: "media_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      media_product_tags: {
        Row: {
          id: string
          media_id: string
          product_id: string
          x_position: number
          y_position: number
        }
        Insert: {
          id?: string
          media_id: string
          product_id: string
          x_position?: number
          y_position?: number
        }
        Update: {
          id?: string
          media_id?: string
          product_id?: string
          x_position?: number
          y_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "media_product_tags_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          sender_account_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_account_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_account_id_fkey"
            columns: ["sender_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          archived_at: string | null
          body: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          read_at: string | null
          recipient: string
          title: string
          type: string
        }
        Insert: {
          archived_at?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          read_at?: string | null
          recipient?: string
          title: string
          type: string
        }
        Update: {
          archived_at?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          read_at?: string | null
          recipient?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      payment_disputes: {
        Row: {
          gateway_dispute_id: string | null
          id: string
          opened_at: string
          payment_id: string
          reason: string
          resolution: string | null
          resolved_at: string | null
          status: string
        }
        Insert: {
          gateway_dispute_id?: string | null
          id?: string
          opened_at?: string
          payment_id: string
          reason: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string
        }
        Update: {
          gateway_dispute_id?: string | null
          id?: string
          opened_at?: string
          payment_id?: string
          reason?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_disputes_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_requests: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          currency: string
          id: string
          marked_paid_at: string | null
          requested_by: string
          status: Database["public"]["Enums"]["payment_request_status"]
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          currency?: string
          id?: string
          marked_paid_at?: string | null
          requested_by: string
          status?: Database["public"]["Enums"]["payment_request_status"]
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string
          id?: string
          marked_paid_at?: string | null
          requested_by?: string
          status?: Database["public"]["Enums"]["payment_request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          gateway: string | null
          gateway_fee: number | null
          gateway_ref: string | null
          gross_amount: number | null
          id: string
          method: string | null
          net_amount: number | null
          payment_status: string
          project_id: string
          received_at: string
          recorded_by: string | null
          refunded_amount: number
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          gateway?: string | null
          gateway_fee?: number | null
          gateway_ref?: string | null
          gross_amount?: number | null
          id?: string
          method?: string | null
          net_amount?: number | null
          payment_status?: string
          project_id: string
          received_at?: string
          recorded_by?: string | null
          refunded_amount?: number
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          gateway?: string | null
          gateway_fee?: number | null
          gateway_ref?: string | null
          gross_amount?: number | null
          id?: string
          method?: string | null
          net_amount?: number | null
          payment_status?: string
          project_id?: string
          received_at?: string
          recorded_by?: string | null
          refunded_amount?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          collaborator_id: string
          created_at: string
          currency: string
          exchange_rate: number
          id: string
          paid_at: string
          paid_by: string
          total_amount: number
          week_of: string
        }
        Insert: {
          collaborator_id: string
          created_at?: string
          currency?: string
          exchange_rate?: number
          id?: string
          paid_at?: string
          paid_by: string
          total_amount: number
          week_of: string
        }
        Update: {
          collaborator_id?: string
          created_at?: string
          currency?: string
          exchange_rate?: number
          id?: string
          paid_at?: string
          paid_by?: string
          total_amount?: number
          week_of?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      person_measurements: {
        Row: {
          account_id: string
          age: number | null
          clothing_size: string | null
          complexion: string | null
          eye_color: string | null
          gender: string | null
          hair_color: string | null
          height_cm: number | null
          shoe_size: string | null
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_level"]
          weight_kg: number | null
        }
        Insert: {
          account_id: string
          age?: number | null
          clothing_size?: string | null
          complexion?: string | null
          eye_color?: string | null
          gender?: string | null
          hair_color?: string | null
          height_cm?: number | null
          shoe_size?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
          weight_kg?: number | null
        }
        Update: {
          account_id?: string
          age?: number | null
          clothing_size?: string | null
          complexion?: string | null
          eye_color?: string | null
          gender?: string | null
          hair_color?: string | null
          height_cm?: number | null
          shoe_size?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "person_measurements_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      person_profiles: {
        Row: {
          account_id: string
          availability: Database["public"]["Enums"]["availability_status"]
          languages: string[]
          open_to: string[]
          rate_note: string | null
          roles: Database["public"]["Enums"]["professional_role"][]
          travel_availability: boolean
          updated_at: string
        }
        Insert: {
          account_id: string
          availability?: Database["public"]["Enums"]["availability_status"]
          languages?: string[]
          open_to?: string[]
          rate_note?: string | null
          roles?: Database["public"]["Enums"]["professional_role"][]
          travel_availability?: boolean
          updated_at?: string
        }
        Update: {
          account_id?: string
          availability?: Database["public"]["Enums"]["availability_status"]
          languages?: string[]
          open_to?: string[]
          rate_note?: string | null
          roles?: Database["public"]["Enums"]["professional_role"][]
          travel_availability?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "person_profiles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_settings: {
        Row: {
          account_id: string
          enabled_apps: string[]
          updated_at: string
          wallpaper: string
        }
        Insert: {
          account_id: string
          enabled_apps?: string[]
          updated_at?: string
          wallpaper?: string
        }
        Update: {
          account_id?: string
          enabled_apps?: string[]
          updated_at?: string
          wallpaper?: string
        }
        Relationships: [
          {
            foreignKeyName: "phone_settings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_account_id: string
          brand_collection_id: string | null
          colors: string[]
          created_at: string
          description: string | null
          id: string
          image_paths: string[]
          is_available: boolean
          name: string
          price_amount: number | null
          price_currency: string
          purchase_url: string | null
          sizes: string[]
          sort_order: number
        }
        Insert: {
          brand_account_id: string
          brand_collection_id?: string | null
          colors?: string[]
          created_at?: string
          description?: string | null
          id?: string
          image_paths?: string[]
          is_available?: boolean
          name: string
          price_amount?: number | null
          price_currency?: string
          purchase_url?: string | null
          sizes?: string[]
          sort_order?: number
        }
        Update: {
          brand_account_id?: string
          brand_collection_id?: string | null
          colors?: string[]
          created_at?: string
          description?: string | null
          id?: string
          image_paths?: string[]
          is_available?: boolean
          name?: string
          price_amount?: number | null
          price_currency?: string
          purchase_url?: string | null
          sizes?: string[]
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_account_id_fkey"
            columns: ["brand_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_brand_collection_id_fkey"
            columns: ["brand_collection_id"]
            isOneToOne: false
            referencedRelation: "brand_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          collaborator_id: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          collaborator_id?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role: string
        }
        Update: {
          collaborator_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          category: string
          file_name: string
          file_size: number | null
          id: string
          project_id: string
          storage_path: string
          superseded_by: string | null
          uploaded_at: string
          uploaded_by: string
          version: number
        }
        Insert: {
          category: string
          file_name: string
          file_size?: number | null
          id?: string
          project_id: string
          storage_path: string
          superseded_by?: string | null
          uploaded_at?: string
          uploaded_by: string
          version?: number
        }
        Update: {
          category?: string
          file_name?: string
          file_size?: number | null
          id?: string
          project_id?: string
          storage_path?: string
          superseded_by?: string | null
          uploaded_at?: string
          uploaded_by?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_documents_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "project_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      project_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          project_id: string
          read_at: string | null
          sender_label: string
          sender_type: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          project_id: string
          read_at?: string | null
          sender_label: string
          sender_type: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          project_id?: string
          read_at?: string | null
          sender_label?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_price_snapshots: {
        Row: {
          captured_at: string
          catalogue_source: string
          complexity_multiplier: number
          currency: string
          delivery_multiplier: number
          id: string
          lines: Json
          project_id: string
          subtotal: number
          total: number
        }
        Insert: {
          captured_at?: string
          catalogue_source: string
          complexity_multiplier?: number
          currency: string
          delivery_multiplier?: number
          id?: string
          lines: Json
          project_id: string
          subtotal: number
          total: number
        }
        Update: {
          captured_at?: string
          catalogue_source?: string
          complexity_multiplier?: number
          currency?: string
          delivery_multiplier?: number
          id?: string
          lines?: Json
          project_id?: string
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_price_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_price_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stage_history: {
        Row: {
          actor: string
          id: number
          new_status: string
          occurred_at: string
          prev_status: string
          project_id: string
          reason: string | null
          stage_key: string
        }
        Insert: {
          actor: string
          id?: never
          new_status: string
          occurred_at?: string
          prev_status: string
          project_id: string
          reason?: string | null
          stage_key: string
        }
        Update: {
          actor?: string
          id?: never
          new_status?: string
          occurred_at?: string
          prev_status?: string
          project_id?: string
          reason?: string | null
          stage_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_stage_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_stage_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stage_templates: {
        Row: {
          id: string
          maps_to_status: string
          project_type: string
          stage_key: string
          stage_label: string
          stage_order: number
        }
        Insert: {
          id?: string
          maps_to_status: string
          project_type: string
          stage_key: string
          stage_label: string
          stage_order: number
        }
        Update: {
          id?: string
          maps_to_status?: string
          project_type?: string
          stage_key?: string
          stage_label?: string
          stage_order?: number
        }
        Relationships: []
      }
      project_stages: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          id: string
          project_id: string
          stage_key: string
          stage_label: string
          stage_order: number
          status: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          id?: string
          project_id: string
          stage_key: string
          stage_label: string
          stage_order: number
          status?: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          id?: string
          project_id?: string
          stage_key?: string
          stage_label?: string
          stage_order?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_stages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_progress"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_stages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          access_token: string | null
          client_contact: string | null
          client_name: string
          configuration: Json | null
          created_at: string
          customer_id: string | null
          hold_state: string | null
          id: string
          introduced_by: string | null
          project_code: string
          project_type: string | null
          quoted_currency: string | null
          quoted_price: number | null
          status: string
        }
        Insert: {
          access_token?: string | null
          client_contact?: string | null
          client_name: string
          configuration?: Json | null
          created_at?: string
          customer_id?: string | null
          hold_state?: string | null
          id?: string
          introduced_by?: string | null
          project_code: string
          project_type?: string | null
          quoted_currency?: string | null
          quoted_price?: number | null
          status?: string
        }
        Update: {
          access_token?: string | null
          client_contact?: string | null
          client_name?: string
          configuration?: Json | null
          created_at?: string
          customer_id?: string | null
          hold_state?: string | null
          id?: string
          introduced_by?: string | null
          project_code?: string
          project_type?: string | null
          quoted_currency?: string | null
          quoted_price?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_overview"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_introduced_by_fkey"
            columns: ["introduced_by"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_counters: {
        Row: {
          attempts: number
          rate_key: string
          window_start: string
        }
        Insert: {
          attempts?: number
          rate_key: string
          window_start: string
        }
        Update: {
          attempts?: number
          rate_key?: string
          window_start?: string
        }
        Relationships: []
      }
      rates: {
        Row: {
          account_id: string
          amount: number | null
          currency: string
          id: string
          is_request_only: boolean
          service: string
          sort_order: number
        }
        Insert: {
          account_id: string
          amount?: number | null
          currency?: string
          id?: string
          is_request_only?: boolean
          service: string
          sort_order?: number
        }
        Update: {
          account_id?: string
          amount?: number | null
          currency?: string
          id?: string
          is_request_only?: boolean
          service?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "rates_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_goals: {
        Row: {
          created_at: string
          created_by: string
          currency: string
          id: string
          period: string
          target_amount: number
        }
        Insert: {
          created_at?: string
          created_by: string
          currency?: string
          id?: string
          period: string
          target_amount: number
        }
        Update: {
          created_at?: string
          created_by?: string
          currency?: string
          id?: string
          period?: string
          target_amount?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          collaboration_id: string
          comment: string | null
          communication: number | null
          created_at: string
          id: string
          professionalism: number | null
          rating: number
          reliability: number | null
          reviewee_account_id: string
          reviewer_account_id: string
        }
        Insert: {
          collaboration_id: string
          comment?: string | null
          communication?: number | null
          created_at?: string
          id?: string
          professionalism?: number | null
          rating: number
          reliability?: number | null
          reviewee_account_id: string
          reviewer_account_id: string
        }
        Update: {
          collaboration_id?: string
          comment?: string | null
          communication?: number | null
          created_at?: string
          id?: string
          professionalism?: number | null
          rating?: number
          reliability?: number | null
          reviewee_account_id?: string
          reviewer_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "collaborations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_account_id_fkey"
            columns: ["reviewee_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_account_id_fkey"
            columns: ["reviewer_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          account_id: string
          id: string
          is_public: boolean
          platform: Database["public"]["Enums"]["social_platform"]
          sort_order: number
          url: string
        }
        Insert: {
          account_id: string
          id?: string
          is_public?: boolean
          platform: Database["public"]["Enums"]["social_platform"]
          sort_order?: number
          url: string
        }
        Update: {
          account_id?: string
          id?: string
          is_public?: boolean
          platform?: Database["public"]["Enums"]["social_platform"]
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      system_events: {
        Row: {
          context: Json
          id: number
          message: string
          occurred_at: string
          severity: string
          source: string
        }
        Insert: {
          context?: Json
          id?: never
          message: string
          occurred_at?: string
          severity: string
          source: string
        }
        Update: {
          context?: Json
          id?: never
          message?: string
          occurred_at?: string
          severity?: string
          source?: string
        }
        Relationships: []
      }
      view_events: {
        Row: {
          created_at: string
          id: number
          subject_account_id: string
          subject_id: string | null
          subject_type: Database["public"]["Enums"]["view_subject"]
          viewer_account_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          subject_account_id: string
          subject_id?: string | null
          subject_type: Database["public"]["Enums"]["view_subject"]
          viewer_account_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          subject_account_id?: string
          subject_id?: string | null
          subject_type?: Database["public"]["Enums"]["view_subject"]
          viewer_account_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "view_events_subject_account_id_fkey"
            columns: ["subject_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_events_viewer_account_id_fkey"
            columns: ["viewer_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      collaborator_ledger: {
        Row: {
          collaborator_id: string | null
          commission_amount: number | null
          commission_currency: string | null
          entry_id: string | null
          payment_amount: number | null
          payment_currency: string | null
          payment_type: string | null
          project_code: string | null
          received_at: string | null
          status: string | null
          week_of: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_entries_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborator_payouts: {
        Row: {
          collaborator_id: string | null
          currency: string | null
          paid_at: string | null
          payout_id: string | null
          total_amount: number | null
          week_of: string | null
        }
        Insert: {
          collaborator_id?: string | null
          currency?: string | null
          paid_at?: string | null
          payout_id?: string | null
          total_amount?: number | null
          week_of?: string | null
        }
        Update: {
          collaborator_id?: string | null
          currency?: string | null
          paid_at?: string | null
          payout_id?: string | null
          total_amount?: number | null
          week_of?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_overview: {
        Row: {
          country: string | null
          customer_id: string | null
          email: string | null
          first_seen_at: string | null
          full_name: string | null
          last_activity_at: string | null
          last_payment_at: string | null
          phone: string | null
          project_count: number | null
          spent_by_currency: Json | null
        }
        Relationships: []
      }
      kpi_commission_totals: {
        Row: {
          count: number | null
          currency: string | null
          status: string | null
          total: number | null
        }
        Relationships: []
      }
      kpi_payment_status_counts: {
        Row: {
          count: number | null
          payment_status: string | null
        }
        Relationships: []
      }
      kpi_project_status_counts: {
        Row: {
          count: number | null
          status: string | null
        }
        Relationships: []
      }
      project_progress: {
        Row: {
          completed_stages: number | null
          current_stage_key: string | null
          current_stage_label: string | null
          derived_status: string | null
          hold_state: string | null
          percent_complete: number | null
          project_code: string | null
          project_id: string | null
          project_type: string | null
          total_stages: number | null
        }
        Relationships: []
      }
      revenue_by_collaborator: {
        Row: {
          currency: string | null
          label: string | null
          revenue: number | null
        }
        Relationships: []
      }
      revenue_by_country: {
        Row: {
          currency: string | null
          label: string | null
          revenue: number | null
        }
        Relationships: []
      }
      revenue_by_currency: {
        Row: {
          currency: string | null
          label: string | null
          revenue: number | null
        }
        Relationships: []
      }
      revenue_by_payment_method: {
        Row: {
          currency: string | null
          label: string | null
          revenue: number | null
        }
        Relationships: []
      }
      revenue_by_project_status: {
        Row: {
          currency: string | null
          label: string | null
          revenue: number | null
        }
        Relationships: []
      }
      revenue_by_service: {
        Row: {
          currency: string | null
          label: string | null
          revenue: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      activity_heatmap: {
        Args: never
        Returns: {
          day_of_week: number
          event_count: number
          hour_of_day: number
        }[]
      }
      advance_project_stage: {
        Args: { p_actor: string; p_project_id: string; p_stage_key: string }
        Returns: {
          completed_at: string | null
          completed_by: string | null
          id: string
          project_id: string
          stage_key: string
          stage_label: string
          stage_order: number
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "project_stages"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      archive_notification: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      check_rate_limit: {
        Args: {
          p_key: string
          p_max_attempts: number
          p_window_seconds: number
        }
        Returns: boolean
      }
      cleanup_rate_limit_counters: { Args: never; Returns: undefined }
      confirm_bank_transfer: {
        Args: { p_actor: string; p_payment_id: string }
        Returns: {
          amount: number
          created_at: string
          currency: string
          gateway: string | null
          gateway_fee: number | null
          gateway_ref: string | null
          gross_amount: number | null
          id: string
          method: string | null
          net_amount: number | null
          payment_status: string
          project_id: string
          received_at: string
          recorded_by: string | null
          refunded_amount: number
          type: string
        }
        SetofOptions: {
          from: "*"
          to: "payments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_bank_transfer_intent: {
        Args: { p_access_token: string }
        Returns: {
          amount: number
          currency: string
          payment_id: string
          project_code: string
        }[]
      }
      create_catalogue_version: {
        Args: { p_actor: string; p_notes: string }
        Returns: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          notes: string | null
          published_at: string | null
          version_number: number
        }
        SetofOptions: {
          from: "*"
          to: "catalogue_versions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_collaborator_record: {
        Args: {
          p_actor: string
          p_bank_details?: Json
          p_commission_rate: number
          p_email: string
          p_name: string
          p_term_end?: string
          p_term_start: string
        }
        Returns: {
          access_code: string
          active: boolean
          bank_details: Json
          commission_rate: number
          created_at: string
          email: string | null
          id: string
          name: string
          term_end: string | null
          term_start: string
        }
        SetofOptions: {
          from: "*"
          to: "collaborators"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_invoice: {
        Args: {
          p_actor: string
          p_currency: string
          p_line_items: Json
          p_payment_id: string
          p_project_id: string
          p_subtotal: number
          p_total: number
        }
        Returns: {
          created_by: string
          currency: string
          id: string
          invoice_number: string | null
          issued_at: string
          line_items: Json
          payment_id: string | null
          pdf_storage_path: string | null
          project_id: string
          subtotal: number
          total: number
        }
        SetofOptions: {
          from: "*"
          to: "invoices"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_notification: {
        Args: {
          p_body: string
          p_entity_id: string
          p_entity_type: string
          p_title: string
          p_type: string
        }
        Returns: undefined
      }
      create_project_by_admin: {
        Args: {
          p_actor: string
          p_client_contact: string
          p_client_name: string
          p_customer_id: string
        }
        Returns: {
          access_token: string | null
          client_contact: string | null
          client_name: string
          configuration: Json | null
          created_at: string
          customer_id: string | null
          hold_state: string | null
          id: string
          introduced_by: string | null
          project_code: string
          project_type: string | null
          quoted_currency: string | null
          quoted_price: number | null
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "projects"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      current_collaborator_id: { Args: never; Returns: string }
      detect_scheduled_notifications: { Args: never; Returns: undefined }
      exclude_payment: {
        Args: {
          p_actor: string
          p_new_status: string
          p_payment_id: string
          p_reason: string
        }
        Returns: undefined
      }
      find_or_create_customer: {
        Args: { p_contact?: string; p_email: string; p_name: string }
        Returns: string
      }
      funnel_summary: {
        Args: never
        Returns: {
          event_count: number
          pct_of_previous_stage: number
          stage_label: string
          stage_order: number
        }[]
      }
      get_bank_transfer_instructions: {
        Args: { p_currency: string }
        Returns: {
          beneficiary_name: string
          details: Json
          provider: string
        }[]
      }
      get_collaborator_by_code: {
        Args: { p_code: string }
        Returns: {
          active: boolean
          commission_rate: number
          id: string
          name: string
          term_end: string
          term_start: string
        }[]
      }
      get_collaborator_ledger_by_code: {
        Args: { p_code: string }
        Returns: {
          collaborator_id: string
          commission_amount: number
          commission_currency: string
          entry_id: string
          payment_amount: number
          payment_currency: string
          payment_type: string
          project_code: string
          received_at: string
          status: string
          week_of: string
        }[]
      }
      get_collaborator_payouts_by_code: {
        Args: { p_code: string }
        Returns: {
          collaborator_id: string
          currency: string
          paid_at: string
          payout_id: string
          total_amount: number
          week_of: string
        }[]
      }
      get_project_by_token: {
        Args: { p_access_token: string }
        Returns: {
          access_token: string | null
          client_contact: string | null
          client_name: string
          configuration: Json | null
          created_at: string
          customer_id: string | null
          hold_state: string | null
          id: string
          introduced_by: string | null
          project_code: string
          project_type: string | null
          quoted_currency: string | null
          quoted_price: number | null
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "projects"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_project_messages: {
        Args: { p_access_token: string }
        Returns: {
          body: string
          created_at: string
          id: string
          sender_label: string
          sender_type: string
        }[]
      }
      get_project_tracker: {
        Args: { p_access_token: string }
        Returns: {
          completed_stages: number
          created_at: string
          current_stage_key: string
          current_stage_label: string
          derived_status: string
          hold_state: string
          percent_complete: number
          project_code: string
          project_type: string
          stages: Json
          status: string
          total_stages: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_privileged_caller: { Args: never; Returns: boolean }
      kpi_revenue_by_period: {
        Args: { p_granularity?: string; p_periods?: number }
        Returns: {
          currency: string
          period_start: string
          revenue: number
        }[]
      }
      kpi_summary: {
        Args: never
        Returns: {
          active_projects: number
          open_disputes: number
          overdue_projects: number
          pending_commission_total: Json
          revenue_this_month: Json
        }[]
      }
      link_collaborator_login: {
        Args: {
          p_actor: string
          p_collaborator_id: string
          p_email: string
          p_full_name: string
          p_profile_id: string
        }
        Returns: undefined
      }
      list_my_sessions: {
        Args: never
        Returns: {
          aal: string
          created_at: string
          id: string
          ip: unknown
          is_current: boolean
          refreshed_at: string
          updated_at: string
          user_agent: string
        }[]
      }
      log_activity_event: {
        Args: {
          p_customer_id?: string
          p_event_type: string
          p_metadata?: Json
          p_path?: string
          p_project_id?: string
          p_session_id: string
        }
        Returns: undefined
      }
      log_system_event: {
        Args: {
          p_context?: Json
          p_message: string
          p_severity: string
          p_source: string
        }
        Returns: undefined
      }
      looks_like_email: { Args: { p_text: string }; Returns: boolean }
      mark_messages_read: { Args: { p_project_id: string }; Returns: undefined }
      mark_notification_read: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      mark_payout_paid: {
        Args: {
          p_actor: string
          p_collaborator_id: string
          p_currency: string
          p_exchange_rate: number
          p_week_of: string
        }
        Returns: {
          collaborator_id: string
          created_at: string
          currency: string
          exchange_rate: number
          id: string
          paid_at: string
          paid_by: string
          total_amount: number
          week_of: string
        }
        SetofOptions: {
          from: "*"
          to: "payouts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      open_dispute: {
        Args: {
          p_actor: string
          p_gateway_dispute_id: string
          p_payment_id: string
          p_reason: string
        }
        Returns: {
          gateway_dispute_id: string | null
          id: string
          opened_at: string
          payment_id: string
          reason: string
          resolution: string | null
          resolved_at: string | null
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "payment_disputes"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      publish_catalogue_version: {
        Args: { p_actor: string; p_version_id: string }
        Returns: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          notes: string | null
          published_at: string | null
          version_number: number
        }
        SetofOptions: {
          from: "*"
          to: "catalogue_versions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      record_gateway_payment: {
        Args: {
          p_actor: string
          p_amount: number
          p_currency: string
          p_gateway: string
          p_gateway_ref: string
          p_project_id: string
        }
        Returns: Record<string, unknown>
      }
      record_partial_refund: {
        Args: {
          p_actor: string
          p_payment_id: string
          p_reason?: string
          p_refund_amount: number
        }
        Returns: undefined
      }
      record_payment: {
        Args: {
          p_actor: string
          p_amount: number
          p_currency: string
          p_method: string
          p_project_id: string
          p_received_at: string
          p_type: string
        }
        Returns: {
          amount: number
          created_at: string
          currency: string
          gateway: string | null
          gateway_fee: number | null
          gateway_ref: string | null
          gross_amount: number | null
          id: string
          method: string | null
          net_amount: number | null
          payment_status: string
          project_id: string
          received_at: string
          recorded_by: string | null
          refunded_amount: number
          type: string
        }
        SetofOptions: {
          from: "*"
          to: "payments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      record_price_snapshot: {
        Args: {
          p_catalogue_source: string
          p_complexity_multiplier: number
          p_currency: string
          p_delivery_multiplier: number
          p_lines: Json
          p_project_id: string
          p_subtotal: number
          p_total: number
        }
        Returns: {
          captured_at: string
          catalogue_source: string
          complexity_multiplier: number
          currency: string
          delivery_multiplier: number
          id: string
          lines: Json
          project_id: string
          subtotal: number
          total: number
        }
        SetofOptions: {
          from: "*"
          to: "project_price_snapshots"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      reject_bank_transfer: {
        Args: { p_actor: string; p_payment_id: string; p_reason: string }
        Returns: {
          amount: number
          created_at: string
          currency: string
          gateway: string | null
          gateway_fee: number | null
          gateway_ref: string | null
          gross_amount: number | null
          id: string
          method: string | null
          net_amount: number | null
          payment_status: string
          project_id: string
          received_at: string
          recorded_by: string | null
          refunded_amount: number
          type: string
        }
        SetofOptions: {
          from: "*"
          to: "payments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      resolve_dispute: {
        Args: {
          p_actor: string
          p_dispute_id: string
          p_outcome: string
          p_resolution: string
        }
        Returns: {
          gateway_dispute_id: string | null
          id: string
          opened_at: string
          payment_id: string
          reason: string
          resolution: string | null
          resolved_at: string | null
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "payment_disputes"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      revert_project_stage: {
        Args: {
          p_actor: string
          p_project_id: string
          p_reason: string
          p_stage_key: string
        }
        Returns: undefined
      }
      revoke_my_session: { Args: { p_session_id: string }; Returns: undefined }
      save_project_configuration: {
        Args: {
          p_access_token: string
          p_client_contact: string
          p_client_name: string
          p_configuration: Json
          p_currency?: string
          p_project_type: string
          p_quoted_price: number
        }
        Returns: {
          access_token: string
          project_code: string
          project_id: string
          status: string
        }[]
      }
      send_admin_message: {
        Args: { p_actor: string; p_body: string; p_project_id: string }
        Returns: {
          body: string
          created_at: string
          id: string
          project_id: string
          read_at: string | null
          sender_label: string
          sender_type: string
        }
        SetofOptions: {
          from: "*"
          to: "project_messages"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      send_client_message: {
        Args: { p_access_token: string; p_body: string }
        Returns: {
          body: string
          created_at: string
          id: string
          project_id: string
          read_at: string | null
          sender_label: string
          sender_type: string
        }
        SetofOptions: {
          from: "*"
          to: "project_messages"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_invoice_pdf: {
        Args: { p_invoice_id: string; p_pdf_storage_path: string }
        Returns: undefined
      }
      set_payment_fees: {
        Args: {
          p_actor: string
          p_gateway_fee: number
          p_gross_amount: number
          p_net_amount: number
          p_payment_id: string
        }
        Returns: {
          amount: number
          created_at: string
          currency: string
          gateway: string | null
          gateway_fee: number | null
          gateway_ref: string | null
          gross_amount: number | null
          id: string
          method: string | null
          net_amount: number | null
          payment_status: string
          project_id: string
          received_at: string
          recorded_by: string | null
          refunded_amount: number
          type: string
        }
        SetofOptions: {
          from: "*"
          to: "payments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_project_hold: {
        Args: {
          p_actor: string
          p_hold_state: string
          p_project_id: string
          p_reason: string
        }
        Returns: undefined
      }
      set_project_type: {
        Args: { p_actor: string; p_project_id: string; p_project_type: string }
        Returns: {
          access_token: string | null
          client_contact: string | null
          client_name: string
          configuration: Json | null
          created_at: string
          customer_id: string | null
          hold_state: string | null
          id: string
          introduced_by: string | null
          project_code: string
          project_type: string | null
          quoted_currency: string | null
          quoted_price: number | null
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "projects"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      submit_collaborator_application: {
        Args: {
          p_attachments?: Json
          p_email: string
          p_experience: string
          p_name: string
          p_phone: string
          p_pitch: string
          p_portfolio_url?: string
        }
        Returns: string
      }
      submit_project_intake: {
        Args: {
          p_client_contact: string
          p_client_name: string
          p_introduced_by?: string
        }
        Returns: string
      }
      top_services_breakdown: {
        Args: never
        Returns: {
          aov: Json
          growth_pct: number
          label: string
          project_type: string
          requested_count: number
          revenue: Json
        }[]
      }
      update_collaborator_record: {
        Args: {
          p_active: boolean
          p_actor: string
          p_commission_rate?: number
          p_id: string
          p_term_end?: string
          p_term_start: string
        }
        Returns: {
          access_code: string
          active: boolean
          bank_details: Json
          commission_rate: number
          created_at: string
          email: string | null
          id: string
          name: string
          term_end: string | null
          term_start: string
        }
        SetofOptions: {
          from: "*"
          to: "collaborators"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_project_status: {
        Args: { p_actor: string; p_project_id: string; p_status: string }
        Returns: {
          access_token: string | null
          client_contact: string | null
          client_name: string
          configuration: Json | null
          created_at: string
          customer_id: string | null
          hold_state: string | null
          id: string
          introduced_by: string | null
          project_code: string
          project_type: string | null
          quoted_currency: string | null
          quoted_price: number | null
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "projects"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      upsert_bank_transfer_account: {
        Args: {
          p_active: boolean
          p_actor: string
          p_beneficiary_name: string
          p_currency: string
          p_details: Json
          p_provider: string
        }
        Returns: {
          active: boolean
          beneficiary_name: string
          currency: string
          details: Json
          id: string
          provider: string
          updated_at: string
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "bank_transfer_receiving_accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      account_kind: "person" | "brand"
      application_status: "pending" | "accepted" | "declined" | "withdrawn"
      availability_status: "available" | "limited" | "unavailable"
      booking_status: "proposed" | "confirmed" | "completed" | "cancelled"
      campaign_status: "draft" | "open" | "closed"
      collab_status: "claimed" | "verified"
      invitation_status: "pending" | "accepted" | "declined"
      media_kind: "image" | "video"
      payment_request_status: "pending" | "marked_paid" | "disputed"
      professional_role:
        | "model"
        | "influencer"
        | "creator"
        | "photographer"
        | "videographer"
        | "stylist"
        | "makeup_artist"
        | "hair_artist"
        | "designer"
        | "other"
      social_platform:
        | "instagram"
        | "tiktok"
        | "youtube"
        | "x"
        | "linkedin"
        | "behance"
        | "website"
        | "whatsapp"
        | "other"
      view_subject: "profile" | "card" | "catalog" | "product" | "campaign"
      visibility_level: "public" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_kind: ["person", "brand"],
      application_status: ["pending", "accepted", "declined", "withdrawn"],
      availability_status: ["available", "limited", "unavailable"],
      booking_status: ["proposed", "confirmed", "completed", "cancelled"],
      campaign_status: ["draft", "open", "closed"],
      collab_status: ["claimed", "verified"],
      invitation_status: ["pending", "accepted", "declined"],
      media_kind: ["image", "video"],
      payment_request_status: ["pending", "marked_paid", "disputed"],
      professional_role: [
        "model",
        "influencer",
        "creator",
        "photographer",
        "videographer",
        "stylist",
        "makeup_artist",
        "hair_artist",
        "designer",
        "other",
      ],
      social_platform: [
        "instagram",
        "tiktok",
        "youtube",
        "x",
        "linkedin",
        "behance",
        "website",
        "whatsapp",
        "other",
      ],
      view_subject: ["profile", "card", "catalog", "product", "campaign"],
      visibility_level: ["public", "private"],
    },
  },
} as const
