import type { ExperimentMessage } from "@/types";
import axios from "axios";
import { url } from "../urls";

export async function getOpenAiChatCompletion(messages: ExperimentMessage[]) {
  const response = await axios.post(
    url('integrationsOpenAiChat'),
    {
      messages
    }
  )
  return response.data
}
