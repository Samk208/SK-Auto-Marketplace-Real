/**
 * Supabase Database Types
 * Auto-generated type definitions for the SK AutoSphere database
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string | null;
          summary: string | null;
          cover_image: string | null;
          status: "draft" | "published" | "archived";
          author_id: string | null;
          published_at: string | null;
          reading_time: number | null;
          views: number;
          is_featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string | null;
          summary?: string | null;
          cover_image?: string | null;
          status?: "draft" | "published" | "archived";
          author_id?: string | null;
          published_at?: string | null;
          reading_time?: number | null;
          views?: number;
          is_featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string | null;
          summary?: string | null;
          cover_image?: string | null;
          status?: "draft" | "published" | "archived";
          author_id?: string | null;
          published_at?: string | null;
          reading_time?: number | null;
          views?: number;
          is_featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      blog_post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "blog_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_imports: {
        Row: {
          id: string;
          source: string;
          file_name: string;
          posts_imported: number;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source: string;
          file_name: string;
          posts_imported: number;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          source?: string;
          file_name?: string;
          posts_imported?: number;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      blog_views: {
        Row: {
          id: string;
          slug: string;
          count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_condition_reports: {
        Row: {
          id: string;
          listing_id: string;
          overall_score: number;
          condition_grade: string;
          summary: string | null;
          flags: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          overall_score: number;
          condition_grade: string;
          summary?: string | null;
          flags?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          overall_score?: number;
          condition_grade?: string;
          summary?: string | null;
          flags?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_condition_reports_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "car_listings";
            referencedColumns: ["id"];
          },
        ];
      };
      car_listings: {
        Row: {
          id: string;
          dealer_id: string;
          title: string;
          make: string;
          brand: string;
          model: string;
          year: number;
          price: number;
          currency: string;
          mileage: number;
          mileage_unit: string;
          transmission: string;
          fuel_type: string;
          body_type: string;
          exterior_color: string | null;
          interior_color: string | null;
          engine_size: string | null;
          drive_type: string | null;
          vin: string | null;
          description: string | null;
          features: string[] | null;
          images: string[];
          image_urls: string[] | null;
          primary_image_url: string | null;
          status:
            | "draft"
            | "pending"
            | "active"
            | "sold"
            | "archived"
            | "rejected";
          views_count: number;
          views: number;
          inquiries_count: number;
          specifications: Json | null;
          location: string | null;
          destination_port: string | null;
          destination_ports: string[] | null;
          condition: string | null;
          featured: boolean;
          vehicle_condition: "excellent" | "good" | "fair" | "poor" | null;
          previous_owners: number | null;
          horsepower: number | null;
          seating_capacity: number | null;
          service_history: Json | null;
          inspection_report_url: string | null;
          available_for_viewing: boolean;
          location_city: string | null;
          location_country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dealer_id: string;
          title: string;
          make?: string;
          brand?: string;
          model: string;
          year: number;
          price: number;
          currency?: string;
          mileage?: number;
          mileage_unit?: string;
          transmission?: string;
          fuel_type?: string;
          body_type?: string;
          exterior_color?: string | null;
          interior_color?: string | null;
          engine_size?: string | null;
          drive_type?: string | null;
          vin?: string | null;
          description?: string | null;
          features?: string[] | null;
          images?: string[];
          image_urls?: string[] | null;
          primary_image_url?: string | null;
          status?:
            | "draft"
            | "pending"
            | "active"
            | "sold"
            | "archived"
            | "rejected";
          views_count?: number;
          views?: number;
          inquiries_count?: number;
          specifications?: Json | null;
          location?: string | null;
          destination_port?: string | null;
          destination_ports?: string[] | null;
          condition?: string | null;
          featured?: boolean;
          vehicle_condition?: "excellent" | "good" | "fair" | "poor" | null;
          previous_owners?: number | null;
          horsepower?: number | null;
          seating_capacity?: number | null;
          service_history?: Json | null;
          inspection_report_url?: string | null;
          available_for_viewing?: boolean;
          location_city?: string | null;
          location_country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dealer_id?: string;
          title?: string;
          make?: string;
          brand?: string;
          model?: string;
          year?: number;
          price?: number;
          currency?: string;
          mileage?: number;
          mileage_unit?: string;
          transmission?: string;
          fuel_type?: string;
          body_type?: string;
          exterior_color?: string | null;
          interior_color?: string | null;
          engine_size?: string | null;
          drive_type?: string | null;
          vin?: string | null;
          description?: string | null;
          features?: string[] | null;
          images?: string[];
          image_urls?: string[] | null;
          primary_image_url?: string | null;
          status?:
            | "draft"
            | "pending"
            | "active"
            | "sold"
            | "archived"
            | "rejected";
          views_count?: number;
          views?: number;
          inquiries_count?: number;
          specifications?: Json | null;
          location?: string | null;
          destination_port?: string | null;
          destination_ports?: string[] | null;
          condition?: string | null;
          featured?: boolean;
          vehicle_condition?: "excellent" | "good" | "fair" | "poor" | null;
          previous_owners?: number | null;
          horsepower?: number | null;
          seating_capacity?: number | null;
          service_history?: Json | null;
          inspection_report_url?: string | null;
          available_for_viewing?: boolean;
          location_city?: string | null;
          location_country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "car_listings_dealer_id_fkey";
            columns: ["dealer_id"];
            isOneToOne: false;
            referencedRelation: "dealers";
            referencedColumns: ["id"];
          },
        ];
      };
      dealers: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          description: string | null;
          logo_url: string | null;
          rating: number;
          review_count: number;
          verified: boolean;
          trust_score: number | null;
          verification_status:
            | "unverified"
            | "pending"
            | "verified"
            | "rejected"
            | null;
          verification_notes: string | null;
          business_license_url: string | null;
          joined_date: string | null;
          active_listings: number;
          sold_vehicles: number;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          description?: string | null;
          logo_url?: string | null;
          rating?: number;
          review_count?: number;
          verified?: boolean;
          trust_score?: number | null;
          verification_status?:
            | "unverified"
            | "pending"
            | "verified"
            | "rejected"
            | null;
          verification_notes?: string | null;
          business_license_url?: string | null;
          joined_date?: string | null;
          active_listings?: number;
          sold_vehicles?: number;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          description?: string | null;
          logo_url?: string | null;
          rating?: number;
          review_count?: number;
          verified?: boolean;
          trust_score?: number | null;
          verification_status?:
            | "unverified"
            | "pending"
            | "verified"
            | "rejected"
            | null;
          verification_notes?: string | null;
          business_license_url?: string | null;
          joined_date?: string | null;
          active_listings?: number;
          sold_vehicles?: number;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      escrow_transactions: {
        Row: {
          id: string;
          escrow_id: string;
          type: "deposit" | "withdrawal" | "refund";
          amount: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          escrow_id: string;
          type: "deposit" | "withdrawal" | "refund";
          amount: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          escrow_id?: string;
          type?: "deposit" | "withdrawal" | "refund";
          amount?: number;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      listing_translations: {
        Row: {
          id: string;
          listing_id: string;
          field_name: string;
          source_language: string;
          target_language: string;
          translated_text: string;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          field_name: string;
          source_language: string;
          target_language: string;
          translated_text: string;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          field_name?: string;
          source_language?: string;
          target_language?: string;
          translated_text?: string;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      membership_tiers: {
        Row: {
          id: string;
          name: string;
          display_name: string;
          tier_level: number;
          price_monthly: number;
          price_yearly: number;
          features: Json | null;
          benefits: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          display_name: string;
          tier_level?: number;
          price_monthly?: number;
          price_yearly?: number;
          features?: Json | null;
          benefits?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          display_name?: string;
          tier_level?: number;
          price_monthly?: number;
          price_yearly?: number;
          features?: Json | null;
          benefits?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          action_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          action_url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          action_url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      order_tracking_events: {
        Row: {
          id: string;
          escrow_id: string;
          event_type: string;
          event_title: string;
          event_description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          escrow_id: string;
          event_type: string;
          event_title: string;
          event_description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          escrow_id?: string;
          event_type?: string;
          event_title?: string;
          event_description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      order_tracking_stages: {
        Row: {
          id: string;
          escrow_id: string;
          stage_type:
            | "payment"
            | "documentation"
            | "shipping"
            | "customs"
            | "delivery";
          status: "pending" | "in_progress" | "completed" | "failed";
          notes: string | null;
          location_name: string | null;
          eta: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          escrow_id: string;
          stage_type:
            | "payment"
            | "documentation"
            | "shipping"
            | "customs"
            | "delivery";
          status?: "pending" | "in_progress" | "completed" | "failed";
          notes?: string | null;
          location_name?: string | null;
          eta?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          escrow_id?: string;
          stage_type?:
            | "payment"
            | "documentation"
            | "shipping"
            | "customs"
            | "delivery";
          status?: "pending" | "in_progress" | "completed" | "failed";
          notes?: string | null;
          location_name?: string | null;
          eta?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_escrow: {
        Row: {
          id: string;
          order_id: string | null;
          listing_id: string | null;
          buyer_id: string | null;
          dealer_id: string | null;
          amount: number;
          currency: string;
          status: "pending" | "funded" | "held" | "released" | "refunded";
          stripe_payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          listing_id?: string | null;
          buyer_id?: string | null;
          dealer_id?: string | null;
          amount: number;
          currency?: string;
          status?: "pending" | "funded" | "held" | "released" | "refunded";
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          listing_id?: string | null;
          buyer_id?: string | null;
          dealer_id?: string | null;
          amount?: number;
          currency?: string;
          status?: "pending" | "funded" | "held" | "released" | "refunded";
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      parts: {
        Row: {
          id: string;
          name: string;
          part_number: string;
          brand: string;
          category: string;
          subcategory: string | null;
          segment: "new" | "used" | "machine";
          condition: "New" | "Used" | "Remanufactured";
          price_krw: number;
          price_usd: number;
          stock_status: "In Stock" | "Low Stock" | "Out of Stock";
          images: string[];
          image: string | null;
          description: string | null;
          specifications: Json | null;
          compatible_vehicles: string[];
          compatibility: string | null;
          is_new: boolean;
          location: string | null;
          seller_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          part_number: string;
          brand: string;
          category: string;
          subcategory?: string | null;
          segment?: "new" | "used" | "machine";
          condition?: "New" | "Used" | "Remanufactured";
          price_krw: number;
          price_usd?: number;
          stock_status?: "In Stock" | "Low Stock" | "Out of Stock";
          images?: string[];
          image?: string | null;
          description?: string | null;
          specifications?: Json | null;
          compatible_vehicles?: string[];
          compatibility?: string | null;
          is_new?: boolean;
          location?: string | null;
          seller_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          part_number?: string;
          brand?: string;
          category?: string;
          subcategory?: string | null;
          segment?: "new" | "used" | "machine";
          condition?: "New" | "Used" | "Remanufactured";
          price_krw?: number;
          price_usd?: number;
          stock_status?: "In Stock" | "Low Stock" | "Out of Stock";
          images?: string[];
          image?: string | null;
          description?: string | null;
          specifications?: Json | null;
          compatible_vehicles?: string[];
          compatibility?: string | null;
          is_new?: boolean;
          location?: string | null;
          seller_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_vehicles: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          listing_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          dealer_id: string;
          amount: number;
          currency: string;
          stripe_payment_intent_id: string | null;
          stripe_payment_method: string | null;
          status:
            | "pending"
            | "processing"
            | "succeeded"
            | "failed"
            | "refunded";
          buyer_email: string;
          buyer_name: string;
          buyer_phone: string | null;
          buyer_country: string | null;
          shipping_address: Json | null;
          metadata: Json | null;
          created_at: string;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          dealer_id: string;
          amount: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          stripe_payment_method?: string | null;
          status?:
            | "pending"
            | "processing"
            | "succeeded"
            | "failed"
            | "refunded";
          buyer_email: string;
          buyer_name: string;
          buyer_phone?: string | null;
          buyer_country?: string | null;
          shipping_address?: Json | null;
          metadata?: Json | null;
          created_at?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          buyer_id?: string;
          dealer_id?: string;
          amount?: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          stripe_payment_method?: string | null;
          status?:
            | "pending"
            | "processing"
            | "succeeded"
            | "failed"
            | "refunded";
          buyer_email?: string;
          buyer_name?: string;
          buyer_phone?: string | null;
          buyer_country?: string | null;
          shipping_address?: Json | null;
          metadata?: Json | null;
          created_at?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      vehicle_inquiries: {
        Row: {
          id: string;
          listing_id: string;
          dealer_id: string;
          buyer_email: string;
          buyer_name: string;
          buyer_phone: string | null;
          buyer_country: string | null;
          message: string;
          inquiry_type:
            | "general"
            | "price_negotiation"
            | "inspection"
            | "shipping"
            | "financing"
            | "test_drive";
          status: "new" | "read" | "responded" | "closed";
          preferred_contact_method: string | null;
          buyer_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          dealer_id: string;
          buyer_email: string;
          buyer_name: string;
          buyer_phone?: string | null;
          buyer_country?: string | null;
          message: string;
          inquiry_type?:
            | "general"
            | "price_negotiation"
            | "inspection"
            | "shipping"
            | "financing"
            | "test_drive";
          status?: "new" | "read" | "responded" | "closed";
          preferred_contact_method?: string | null;
          buyer_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          dealer_id?: string;
          buyer_email?: string;
          buyer_name?: string;
          buyer_phone?: string | null;
          buyer_country?: string | null;
          message?: string;
          inquiry_type?:
            | "general"
            | "price_negotiation"
            | "inspection"
            | "shipping"
            | "financing"
            | "test_drive";
          status?: "new" | "read" | "responded" | "closed";
          preferred_contact_method?: string | null;
          buyer_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          status: "active" | "unsubscribed";
          subscribed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          status?: "active" | "unsubscribed";
          subscribed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string | null;
          status?: "active" | "unsubscribed";
          subscribed_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      shipping_rates: {
        Row: {
          id: string;
          port_name: string;
          destination_country: string;
          base_rate_sedan: number;
          base_rate_suv: number;
          transit_time_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          port_name: string;
          destination_country: string;
          base_rate_sedan: number;
          base_rate_suv: number;
          transit_time_days: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          port_name?: string;
          destination_country?: string;
          base_rate_sedan?: number;
          base_rate_suv?: number;
          transit_time_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_memberships: {
        Row: {
          id: string;
          user_id: string;
          tier_id: string | null;
          tier: string | null;
          tier_level: number;
          billing_cycle: "free" | "monthly" | "yearly";
          status: "active" | "cancelled" | "expired";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier_id?: string | null;
          tier?: string | null;
          tier_level?: number;
          billing_cycle?: "free" | "monthly" | "yearly";
          status?: "active" | "cancelled" | "expired";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tier_id?: string | null;
          tier?: string | null;
          tier_level?: number;
          billing_cycle?: "free" | "monthly" | "yearly";
          status?: "active" | "cancelled" | "expired";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_view_count: {
        Args: { listing_id: string };
        Returns: undefined;
      };
      increment_listing_views: {
        Args: { listing_id: string };
        Returns: undefined;
      };
      increment_translation_view_count: {
        Args: {
          p_listing_id: string;
          p_field_name: string;
          p_target_lang: string;
        };
        Returns: undefined;
      };
      increment_blog_views: {
        Args: { post_slug: string };
        Returns: undefined;
      };
      increment_blog_view: {
        Args: { view_slug: string };
        Returns: undefined;
      };
      log_audit: {
        Args: {
          p_action: string;
          p_entity_type: string;
          p_entity_id?: string;
          p_details?: Json;
          p_resource_type?: string;
          p_resource_id?: string;
        };
        Returns: undefined;
      };
      get_market_trends: {
        Args: Record<string, never>;
        Returns: Json;
      };
      get_dealer_stats: {
        Args: { p_dealer_id: string };
        Returns: Json;
      };
      get_dealer_stats_enhanced: {
        Args: { p_dealer_id: string };
        Returns: Json;
      };
      search_listings: {
        Args: {
          search_query?: string;
          p_make?: string;
          p_model?: string;
          p_min_price?: number;
          p_max_price?: number;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: Database["public"]["Tables"]["car_listings"]["Row"][];
      };
      search_vehicles_advanced: {
        Args: {
          p_make?: string;
          p_model?: string;
          p_min_year?: number;
          p_max_year?: number;
          p_min_price?: number;
          p_max_price?: number;
          p_condition?: string;
          p_fuel_type?: string;
          p_transmission?: string;
          p_body_type?: string;
          p_location_country?: string;
          p_dealer_id?: string;
          p_vin?: string;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: Json;
      };
      record_vehicle_view: {
        Args: {
          p_listing_id: string;
          p_viewer_country?: string | null;
          p_viewer_ip?: string | null;
          p_user_agent?: string | null;
          p_referrer?: string | null;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Insertable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updatable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
