import { supabase } from "../config/supabase.js";

export const User = {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create({ name, email, password, role = "pelanggan" }) {
    const { data, error } = await supabase
      .from("users")
      .insert({ name, email, password, role })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
