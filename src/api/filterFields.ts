import api from './base'
import { url } from './urls'

export async function getFilterableValues(entity: string, field: string) {
  const response = await api.get(url('filterableValues', {}, entity, field))
  return response.data
}
