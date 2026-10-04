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
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          label: string
          line1: string
          line2: string | null
          phone: string
          postal_code: string
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          label?: string
          line1: string
          line2?: string | null
          phone: string
          postal_code: string
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string
          line1?: string
          line2?: string | null
          phone?: string
          postal_code?: string
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string
          best_seller: boolean
          category_id: string | null
          category_slug: string
          cover_image: string | null
          created_at: string
          description: string | null
          digital_available: boolean
          digital_file_path: string | null
          discount_price: number | null
          featured: boolean
          gallery_images: string[]
          genre: string | null
          id: string
          is_active: boolean
          isbn: string | null
          language: string
          new_arrival: boolean
          pages: number | null
          physical_available: boolean
          preview_url: string | null
          price: number
          publication_date: string | null
          publisher: string | null
          rating: number
          review_count: number
          search_vector: unknown
          short_description: string | null
          slug: string
          stock: number
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          best_seller?: boolean
          category_id?: string | null
          category_slug: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          digital_available?: boolean
          digital_file_path?: string | null
          discount_price?: number | null
          featured?: boolean
          gallery_images?: string[]
          genre?: string | null
          id?: string
          is_active?: boolean
          isbn?: string | null
          language?: string
          new_arrival?: boolean
          pages?: number | null
          physical_available?: boolean
          preview_url?: string | null
          price: number
          publication_date?: string | null
          publisher?: string | null
          rating?: number
          review_count?: number
          search_vector?: unknown
          short_description?: string | null
          slug: string
          stock?: number
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          best_seller?: boolean
          category_id?: string | null
          category_slug?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          digital_available?: boolean
          digital_file_path?: string | null
          discount_price?: number | null
          featured?: boolean
          gallery_images?: string[]
          genre?: string | null
          id?: string
          is_active?: boolean
          isbn?: string | null
          language?: string
          new_arrival?: boolean
          pages?: number | null
          physical_available?: boolean
          preview_url?: string | null
          price?: number
          publication_date?: string | null
          publisher?: string | null
          rating?: number
          review_count?: number
          search_vector?: unknown
          short_description?: string | null
          slug?: string
          stock?: number
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          book_id: string
          created_at: string
          format: Database["public"]["Enums"]["book_format"]
          id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          format?: Database["public"]["Enums"]["book_format"]
          id?: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          format?: Database["public"]["Enums"]["book_format"]
          id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          accent: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          accent?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          accent?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      digital_access: {
        Row: {
          book_id: string
          granted_at: string
          id: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          granted_at?: string
          id?: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          granted_at?: string
          id?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "digital_access_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_access_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          author: string | null
          book_id: string | null
          cover_image: string | null
          format: Database["public"]["Enums"]["book_format"]
          id: string
          line_total: number
          order_id: string
          quantity: number
          title: string
          unit_price: number
        }
        Insert: {
          author?: string | null
          book_id?: string | null
          cover_image?: string | null
          format: Database["public"]["Enums"]["book_format"]
          id?: string
          line_total: number
          order_id: string
          quantity: number
          title: string
          unit_price: number
        }
        Update: {
          author?: string | null
          book_id?: string | null
          cover_image?: string | null
          format?: Database["public"]["Enums"]["book_format"]
          id?: string
          line_total?: number
          order_id?: string
          quantity?: number
          title?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          discount: number
          estimated_delivery: string | null
          has_digital: boolean
          has_physical: boolean
          id: string
          notes: string | null
          order_number: string
          order_status: Database["public"]["Enums"]["order_status"]
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          shipping_address: Json | null
          shipping_fee: number
          shipping_method: string | null
          subtotal: number
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount?: number
          estimated_delivery?: string | null
          has_digital?: boolean
          has_physical?: boolean
          id?: string
          notes?: string | null
          order_number?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipping_address?: Json | null
          shipping_fee?: number
          shipping_method?: string | null
          subtotal: number
          total: number
          tracking_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount?: number
          estimated_delivery?: string | null
          has_digital?: boolean
          has_physical?: boolean
          id?: string
          notes?: string | null
          order_number?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipping_address?: Json | null
          shipping_fee?: number
          shipping_method?: string | null
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          provider: string | null
          provider_ref: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          provider?: string | null
          provider_ref?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          order_id?: string
          provider?: string | null
          provider_ref?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string | null
          book_id: string
          created_at: string
          id: string
          is_approved: boolean
          rating: number
          reviewer_name: string | null
          title: string | null
          updated_at: string
          user_id: string
          verified_purchase: boolean
        }
        Insert: {
          body?: string | null
          book_id: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating: number
          reviewer_name?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          verified_purchase?: boolean
        }
        Update: {
          body?: string | null
          book_id?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating?: number
          reviewer_name?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          verified_purchase?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          book_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_dashboard_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "customer"
      book_format: "physical" | "digital" | "both"
      order_status:
        | "PENDING"
        | "CONFIRMED"
        | "PROCESSING"
        | "PACKED"
        | "SHIPPED"
        | "OUT_FOR_DELIVERY"
        | "DELIVERED"
        | "CANCELLED"
        | "RETURNED"
      payment_method: "cod" | "card"
      payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
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
      app_role: ["admin", "customer"],
      book_format: ["physical", "digital", "both"],
      order_status: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "PACKED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "RETURNED",
      ],
      payment_method: ["cod", "card"],
      payment_status: ["PENDING", "PAID", "FAILED", "REFUNDED"],
    },
  },
} as const
