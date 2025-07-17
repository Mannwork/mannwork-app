import { supabase } from "@/common/lib/supabase/supabaseClient";

interface createChatForRequestProps {
  requestId: string
  clientId: string
  professionalId: string
}

export const createChatForRequest = async ({
  requestId,
  clientId,
  professionalId,
}: createChatForRequestProps): Promise<{ chatId: string }> => {
  // 1. Check if a chat already exists between the two users
  const { data: existingChat, error: existingChatError } = await supabase
    .from('chats')
    .select('id')
    .or(`and(client_id.eq.${clientId},professional_id.eq.${professionalId}),and(client_id.eq.${professionalId},professional_id.eq.${clientId})`)
    .maybeSingle()

  if (existingChatError) {
    throw existingChatError
  }

  // 2. If a chat exists, return its ID
  if (existingChat) {
    return { chatId: existingChat.id }
  }

  // 3. If no chat exists, create a new one
  const { data: newChat, error: newChatError } = await supabase
    .from('chats')
    .insert({
      request_id: requestId,
      client_id: clientId,
      professional_id: professionalId,
    })
    .select('id')
    .single()

  if (newChatError) {
    throw newChatError
  }

  return { chatId: newChat.id }
}