import { createClient } from '@/lib/supabase/server';

export async function getServices() {
  const sb = await createClient();
  const { data } = await sb.from('services').select('*').eq('is_active', true).order('sort_order');
  return data ?? [];
}
export async function getBookableServices() {
  const sb = await createClient();
  const { data } = await sb.from('services').select('*').eq('is_active', true).eq('bookable', true).order('sort_order');
  return data ?? [];
}
export async function getStylists() {
  const sb = await createClient();
  const { data } = await sb.from('stylists').select('*').eq('is_active', true).order('sort_order');
  return data ?? [];
}
export async function getGallery() {
  const sb = await createClient();
  const { data } = await sb.from('gallery').select('*').eq('is_active', true).order('sort_order');
  return data ?? [];
}
export async function getBusinessHours() {
  const sb = await createClient();
  const { data } = await sb.from('business_hours').select('*').order('day_of_week');
  return data ?? [];
}
