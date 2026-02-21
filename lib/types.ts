export interface Habit {
  id: number;
  title: string;
  description?: string | null;
  tracking_ui?: "hex" | "grid" | "counter" |"reading"|"meditation";
  tracking_type: "daily" | "hourly" | "count";
  target_value?: number | null;
}