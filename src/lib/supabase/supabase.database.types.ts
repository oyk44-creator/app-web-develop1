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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          context: string
          created_at: string
          environment: string | null
          error_code: string | null
          error_message: string
          error_type: string
          id: string
          ip_address: unknown
          request_path: string | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          context: string
          created_at?: string
          environment?: string | null
          error_code?: string | null
          error_message: string
          error_type: string
          id?: string
          ip_address?: unknown
          request_path?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          context?: string
          created_at?: string
          environment?: string | null
          error_code?: string | null
          error_message?: string
          error_type?: string
          id?: string
          ip_address?: unknown
          request_path?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      file_uploads: {
        Row: {
          completed_at: string | null
          created_at: string
          deleted_at: string | null
          error_message: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          processed_records: number | null
          storage_path: string | null
          total_records: number | null
          upload_status: string
          user_id: string
          vehicle_type: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          deleted_at?: string | null
          error_message?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          processed_records?: number | null
          storage_path?: string | null
          total_records?: number | null
          upload_status?: string
          user_id: string
          vehicle_type?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          deleted_at?: string | null
          error_message?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          processed_records?: number | null
          storage_path?: string | null
          total_records?: number | null
          upload_status?: string
          user_id?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      tesla_data: {
        Row: {
          acc_set_speed_kph: number | null
          accel_pedal_pct: number | null
          ap_state: number | null
          brake_pedal_pct: number | null
          can_id_hex: string | null
          created_at: string | null
          deleted_at: string | null
          gear: number | null
          id: string
          kpi_01_speed_norm: number | null
          kpi_02_steer_abs: number | null
          kpi_03_accel_load: number | null
          kpi_04_brake_intensity: number | null
          kpi_05_torque_abs: number | null
          kpi_06_autopilot_flag: number | null
          kpi_07_cruise_delta: number | null
          kpi_08_speed_gradient: number | null
          kpi_09_steer_rate: number | null
          kpi_10_accel_change: number | null
          kpi_11_brake_event: number | null
          kpi_12_torque_change: number | null
          kpi_13_load_index: number | null
          kpi_14_stability_index: number | null
          kpi_15_risk_score: number | null
          lateral_torque_request_nm: number | null
          steering_angle_deg: number | null
          time_s: number
          timestamp: string | null
          updated_at: string | null
          upload_id: string | null
          user_id: string
          vehicle_speed_kph: number | null
        }
        Insert: {
          acc_set_speed_kph?: number | null
          accel_pedal_pct?: number | null
          ap_state?: number | null
          brake_pedal_pct?: number | null
          can_id_hex?: string | null
          created_at?: string | null
          deleted_at?: string | null
          gear?: number | null
          id?: string
          kpi_01_speed_norm?: number | null
          kpi_02_steer_abs?: number | null
          kpi_03_accel_load?: number | null
          kpi_04_brake_intensity?: number | null
          kpi_05_torque_abs?: number | null
          kpi_06_autopilot_flag?: number | null
          kpi_07_cruise_delta?: number | null
          kpi_08_speed_gradient?: number | null
          kpi_09_steer_rate?: number | null
          kpi_10_accel_change?: number | null
          kpi_11_brake_event?: number | null
          kpi_12_torque_change?: number | null
          kpi_13_load_index?: number | null
          kpi_14_stability_index?: number | null
          kpi_15_risk_score?: number | null
          lateral_torque_request_nm?: number | null
          steering_angle_deg?: number | null
          time_s: number
          timestamp?: string | null
          updated_at?: string | null
          upload_id?: string | null
          user_id: string
          vehicle_speed_kph?: number | null
        }
        Update: {
          acc_set_speed_kph?: number | null
          accel_pedal_pct?: number | null
          ap_state?: number | null
          brake_pedal_pct?: number | null
          can_id_hex?: string | null
          created_at?: string | null
          deleted_at?: string | null
          gear?: number | null
          id?: string
          kpi_01_speed_norm?: number | null
          kpi_02_steer_abs?: number | null
          kpi_03_accel_load?: number | null
          kpi_04_brake_intensity?: number | null
          kpi_05_torque_abs?: number | null
          kpi_06_autopilot_flag?: number | null
          kpi_07_cruise_delta?: number | null
          kpi_08_speed_gradient?: number | null
          kpi_09_steer_rate?: number | null
          kpi_10_accel_change?: number | null
          kpi_11_brake_event?: number | null
          kpi_12_torque_change?: number | null
          kpi_13_load_index?: number | null
          kpi_14_stability_index?: number | null
          kpi_15_risk_score?: number | null
          lateral_torque_request_nm?: number | null
          steering_angle_deg?: number | null
          time_s?: number
          timestamp?: string | null
          updated_at?: string | null
          upload_id?: string | null
          user_id?: string
          vehicle_speed_kph?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tesla_data_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "file_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      tesla_kpi_data: {
        Row: {
          accel: number | null
          batt_current: number | null
          batt_voltage: number | null
          bms_max_pack_temp: number | null
          bms_min_pack_temp: number | null
          brick_temp_max: number | null
          brick_temp_min: number | null
          brick_voltage_max: number | null
          brick_voltage_max_num: number | null
          brick_voltage_min: number | null
          brick_voltage_min_num: number | null
          charge_line_voltage: number | null
          coolant_temp_bat_inlet: number | null
          created_at: string | null
          delta_s_km: number | null
          delta_t: number | null
          delta_v: number | null
          di_accel_pedal_pos: number | null
          di_vehicle_speed: number | null
          dif_torque_actual: number | null
          dif_torque_command: number | null
          dir_torque_actual: number | null
          dir_torque_command: number | null
          discharge_wh: number | null
          drive_power: number | null
          energy_wh: number | null
          event_accel: number | null
          event_brake: number | null
          high_current_dist: number | null
          highspeed_dist: number | null
          id: number
          idle_time: number | null
          jerk: number | null
          max_charge_current: number | null
          max_discharge_current: number | null
          max_voltage: number | null
          pack_power: number | null
          regen_power: number | null
          regen_wh: number | null
          risk_score: number | null
          soc_ave: number | null
          soc_max: number | null
          soc_min: number | null
          soc_ui: number | null
          soc_violation: number | null
          speed_mps: number | null
          stop_time: number | null
          timestamps: number
          upload_id: string | null
          user_id: string
        }
        Insert: {
          accel?: number | null
          batt_current?: number | null
          batt_voltage?: number | null
          bms_max_pack_temp?: number | null
          bms_min_pack_temp?: number | null
          brick_temp_max?: number | null
          brick_temp_min?: number | null
          brick_voltage_max?: number | null
          brick_voltage_max_num?: number | null
          brick_voltage_min?: number | null
          brick_voltage_min_num?: number | null
          charge_line_voltage?: number | null
          coolant_temp_bat_inlet?: number | null
          created_at?: string | null
          delta_s_km?: number | null
          delta_t?: number | null
          delta_v?: number | null
          di_accel_pedal_pos?: number | null
          di_vehicle_speed?: number | null
          dif_torque_actual?: number | null
          dif_torque_command?: number | null
          dir_torque_actual?: number | null
          dir_torque_command?: number | null
          discharge_wh?: number | null
          drive_power?: number | null
          energy_wh?: number | null
          event_accel?: number | null
          event_brake?: number | null
          high_current_dist?: number | null
          highspeed_dist?: number | null
          id?: number
          idle_time?: number | null
          jerk?: number | null
          max_charge_current?: number | null
          max_discharge_current?: number | null
          max_voltage?: number | null
          pack_power?: number | null
          regen_power?: number | null
          regen_wh?: number | null
          risk_score?: number | null
          soc_ave?: number | null
          soc_max?: number | null
          soc_min?: number | null
          soc_ui?: number | null
          soc_violation?: number | null
          speed_mps?: number | null
          stop_time?: number | null
          timestamps: number
          upload_id?: string | null
          user_id: string
        }
        Update: {
          accel?: number | null
          batt_current?: number | null
          batt_voltage?: number | null
          bms_max_pack_temp?: number | null
          bms_min_pack_temp?: number | null
          brick_temp_max?: number | null
          brick_temp_min?: number | null
          brick_voltage_max?: number | null
          brick_voltage_max_num?: number | null
          brick_voltage_min?: number | null
          brick_voltage_min_num?: number | null
          charge_line_voltage?: number | null
          coolant_temp_bat_inlet?: number | null
          created_at?: string | null
          delta_s_km?: number | null
          delta_t?: number | null
          delta_v?: number | null
          di_accel_pedal_pos?: number | null
          di_vehicle_speed?: number | null
          dif_torque_actual?: number | null
          dif_torque_command?: number | null
          dir_torque_actual?: number | null
          dir_torque_command?: number | null
          discharge_wh?: number | null
          drive_power?: number | null
          energy_wh?: number | null
          event_accel?: number | null
          event_brake?: number | null
          high_current_dist?: number | null
          highspeed_dist?: number | null
          id?: number
          idle_time?: number | null
          jerk?: number | null
          max_charge_current?: number | null
          max_discharge_current?: number | null
          max_voltage?: number | null
          pack_power?: number | null
          regen_power?: number | null
          regen_wh?: number | null
          risk_score?: number | null
          soc_ave?: number | null
          soc_max?: number | null
          soc_min?: number | null
          soc_ui?: number | null
          soc_violation?: number | null
          speed_mps?: number | null
          stop_time?: number | null
          timestamps?: number
          upload_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tesla_kpi_data_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "file_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      tesla_kpi_summary: {
        Row: {
          accel_rms: number | null
          aggressive_accel_per100: number | null
          aggressive_brake_per100: number | null
          avg_current: number | null
          avg_pack_temp: number | null
          avg_soc: number | null
          avg_speed: number | null
          charging_ratio: number | null
          coasting_ratio: number | null
          created_at: string | null
          delta_soc: number | null
          high_current_ratio: number | null
          high_speed_ratio: number | null
          high_temp_charging_ratio: number | null
          id: number
          idle_per_100km: number | null
          max_discharge_current: number | null
          max_speed: number | null
          regen_ratio: number | null
          risk_score: number | null
          soc_violation_ratio: number | null
          stop_go_ratio: number | null
          total_dist_km: number | null
          total_energy_wh: number | null
          total_regen_wh: number | null
          total_time_s: number | null
          upload_id: string
          user_id: string
          wh_per_100km: number | null
        }
        Insert: {
          accel_rms?: number | null
          aggressive_accel_per100?: number | null
          aggressive_brake_per100?: number | null
          avg_current?: number | null
          avg_pack_temp?: number | null
          avg_soc?: number | null
          avg_speed?: number | null
          charging_ratio?: number | null
          coasting_ratio?: number | null
          created_at?: string | null
          delta_soc?: number | null
          high_current_ratio?: number | null
          high_speed_ratio?: number | null
          high_temp_charging_ratio?: number | null
          id?: number
          idle_per_100km?: number | null
          max_discharge_current?: number | null
          max_speed?: number | null
          regen_ratio?: number | null
          risk_score?: number | null
          soc_violation_ratio?: number | null
          stop_go_ratio?: number | null
          total_dist_km?: number | null
          total_energy_wh?: number | null
          total_regen_wh?: number | null
          total_time_s?: number | null
          upload_id: string
          user_id: string
          wh_per_100km?: number | null
        }
        Update: {
          accel_rms?: number | null
          aggressive_accel_per100?: number | null
          aggressive_brake_per100?: number | null
          avg_current?: number | null
          avg_pack_temp?: number | null
          avg_soc?: number | null
          avg_speed?: number | null
          charging_ratio?: number | null
          coasting_ratio?: number | null
          created_at?: string | null
          delta_soc?: number | null
          high_current_ratio?: number | null
          high_speed_ratio?: number | null
          high_temp_charging_ratio?: number | null
          id?: number
          idle_per_100km?: number | null
          max_discharge_current?: number | null
          max_speed?: number | null
          regen_ratio?: number | null
          risk_score?: number | null
          soc_violation_ratio?: number | null
          stop_go_ratio?: number | null
          total_dist_km?: number | null
          total_energy_wh?: number | null
          total_regen_wh?: number | null
          total_time_s?: number | null
          upload_id?: string
          user_id?: string
          wh_per_100km?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tesla_kpi_summary_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: true
            referencedRelation: "file_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          phone: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["role_enum"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          last_login_at?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["role_enum"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["role_enum"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      error_statistics: {
        Row: {
          context: string | null
          date: string | null
          error_count: number | null
          error_type: string | null
        }
        Relationships: []
      }
      login_statistics: {
        Row: {
          failed_login_count: number | null
          last_login_at: string | null
          last_logout_at: string | null
          login_count: number | null
          logout_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      role_enum: "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      role_enum: ["admin", "user"],
    },
  },
} as const
