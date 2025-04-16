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
      categories: {
        Row: {
          category: string | null
          id: number
        }
        Insert: {
          category?: string | null
          id: number
        }
        Update: {
          category?: string | null
          id?: number
        }
        Relationships: []
      }
      math_problems: {
        Row: {
          answer: string | null
          category: number | null
          id: number
          problem_type: number | null
          question: number | null
          tags: Json
          test_form: string | null
        }
        Insert: {
          answer?: string | null
          category?: number | null
          id: number
          problem_type?: number | null
          question?: number | null
          tags?: Json
          test_form?: string | null
        }
        Update: {
          answer?: string | null
          category?: number | null
          id?: number
          problem_type?: number | null
          question?: number | null
          tags?: Json
          test_form?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "math_problems_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "math_problems_problem_type_fkey"
            columns: ["problem_type"]
            isOneToOne: false
            referencedRelation: "problem_types"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          created_at: string
          id: number
          status: string
          student_id: number
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          status?: string
          student_id: number
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          status?: string
          student_id?: number
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_types: {
        Row: {
          id: number
          problem_type: string | null
        }
        Insert: {
          id: number
          problem_type?: string | null
        }
        Update: {
          id?: number
          problem_type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: number
          instructor_id: number | null
          last_name: string | null
          name: string | null
          role: string | null
          uid: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          instructor_id?: number | null
          last_name?: string | null
          name?: string | null
          role?: string | null
          uid?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          instructor_id?: number | null
          last_name?: string | null
          name?: string | null
          role?: string | null
          uid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      question_feedback: {
        Row: {
          comment: string | null
          created_at: string
          difficulty_rating: number | null
          guessed: boolean | null
          id: number
          image_url: string | null
          instructor_id: number
          question_id: number
          session_id: number
          student_id: number | null
          tags: number[]
        }
        Insert: {
          comment?: string | null
          created_at?: string
          difficulty_rating?: number | null
          guessed?: boolean | null
          id?: number
          image_url?: string | null
          instructor_id: number
          question_id: number
          session_id?: number
          student_id?: number | null
          tags?: number[]
        }
        Update: {
          comment?: string | null
          created_at?: string
          difficulty_rating?: number | null
          guessed?: boolean | null
          id?: number
          image_url?: string | null
          instructor_id?: number
          question_id?: number
          session_id?: number
          student_id?: number | null
          tags?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "question_feedback_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_feedback_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "math_problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_responses: {
        Row: {
          created_at: string
          feedback_id: number | null
          id: number
          question_id: number
          response: string
          session_id: number
          student_id: number
          time_taken: number | null
        }
        Insert: {
          created_at?: string
          feedback_id?: number | null
          id?: number
          question_id: number
          response: string
          session_id: number
          student_id: number
          time_taken?: number | null
        }
        Update: {
          created_at?: string
          feedback_id?: number | null
          id?: number
          question_id?: number
          response?: string
          session_id?: number
          student_id?: number
          time_taken?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_responses_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "question_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "math_problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_responses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          tag_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          tag_name: string
        }
        Update: {
          created_at?: string
          id?: number
          tag_name?: string
        }
        Relationships: []
      }
      tutors: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_read_profile: {
        Args: {
          user_id: string
          profile_uid: string
        }
        Returns: boolean
      }
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_admin_user: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
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
