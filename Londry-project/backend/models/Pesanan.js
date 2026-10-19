import { supabase } from "../config/supabase.js";

export const Pesanan = {
  async create(payload) {
    const { data, error } = await supabase
      .from("pesanan")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async findByUser(userId) {
    const { data, error } = await supabase
      .from("pesanan")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });
    if (error) throw error;
    return data;
  },

  async findAll() {
    const { data, error } = await supabase
      .from("pesanan")
      .select("*")
      .order("createdAt", { ascending: false });
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("pesanan")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from("pesanan")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
