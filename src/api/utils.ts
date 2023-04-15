import type { PageData } from "@/types";
import type { AxiosResponse } from "axios";

export function getPageData(response: AxiosResponse): PageData {
  return {
    total: response.data.total,
    currentPage: response.data.currentPage,
    pageSize: response.data.pageSize,
    totalPages: response.data.totalPages
  }
}
