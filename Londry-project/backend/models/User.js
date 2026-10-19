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

<<<<<<< Updated upstream
  async create({ name, email, password, role = "pelanggan" }) {
    const { data, error } = await supabase
      .from("users")
      .insert({ name, email, password, role })
      .select()
      .single();
    if (error) throw error;
    return data;
=======
  create({ name, email, password, role = "customer", outletName }) {
    const users = readUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error("Email sudah terdaftar");
    }

    const user = {
      id: String(Date.now()),
      name,
      email,
      password,
      role,
      outletName: outletName || null,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    writeUsers(users);

    return withoutPassword(user);
>>>>>>> Stashed changes
  },
};
