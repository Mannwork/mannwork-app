import { supabase } from "@/common/lib/supabase/supabaseClient";

interface createChatForRequestProps {
  requestId: string;
  clientId: string;
  professionalId: string;
}

export const createChatForRequest = async ({
  requestId,
  clientId,
  professionalId,
}: createChatForRequestProps): Promise<{ chatId: string }> => {

  const { data: existingChat, error: existingChatError } = await supabase
    .from('chats')
    .select('id')
    .match({
      request_id: requestId,
      client_id: clientId,
      professional_id: professionalId,
    })
    .maybeSingle(); 

  if (existingChatError) {
    throw existingChatError;
  }

  if (existingChat) {
    return { chatId: existingChat.id };
  }

  const { data: newChat, error: newChatError } = await supabase
    .from('chats')
    .insert({
      request_id: requestId,
      client_id: clientId,
      professional_id: professionalId,
    })
    .select('id')
    .single();

  if (newChatError) {
    throw newChatError;
  }

  return { chatId: newChat.id };
};