import { url } from "./urls";
import dayjs from "dayjs";
import type { PromptExperiment, PromptExperimentSnapshot, PromptExperimentMessage } from "@/types";
import api from "./base";

export async function getPromptExperiments() {
  const response = await api.get(url('promptExperiments'))

  return response.data.map((e: any) => ({
    ...e,
    created_at: dayjs(e.created_at),
    updated_at: dayjs(e.updated_at)
  })) as PromptExperiment[]
}

export async function getPromptExperimentSnapshots(experimentId: number) {
  const response = await api.get(url('promptExperimentSnapshots', {}, experimentId))

  return response.data.map((e: any) => ({
    ...e,
    created_at: dayjs(e.created_at),
    updated_at: dayjs(e.updated_at)
  })) as PromptExperimentSnapshot[]
}

export async function getPromptExperimentMessages(snapshotId: number) {
  const response = await api.get(url('promptExperimentMessages', {}, snapshotId))

  return response.data as PromptExperimentMessage[]
}

export async function updatePromptExperiment(data: { experiment: PromptExperiment, snapshot: PromptExperimentSnapshot, messages: PromptExperimentMessage[] }) {
  const response = await api.put(url('updatePromptExperiment', {}, data.experiment.id), data)
  return response.data
}

export async function createPromptExperiment(data: { experiment: PromptExperiment, snapshot: PromptExperimentSnapshot, messages: PromptExperimentMessage[] }) {
  const response = await api.post(url('createPromptExperiment'), data)
  return response.data
}
