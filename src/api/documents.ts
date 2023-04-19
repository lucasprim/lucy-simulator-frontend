import type { Document, DocumentCollection, DocumentLibrary, DocumentVersion } from '@/types'
import api from './base'
import { url } from './urls'

export async function createLibrary(data: { name: string }) {
  return (await api.post(url('createLibrary'), data)).data as DocumentLibrary
}

export async function getLibraries() {
  return (await api.get(url('getLibraries'))).data as DocumentLibrary[]
}

export async function createCollection(data: { document_library_id: number; name: string }) {
  return (await api.post(url('createCollection'), data)).data
}

export async function getCollections(libraryId: number) {
  return (await api.get(url('getCollections', {}, libraryId))).data as {
    collections: DocumentCollection[]
    documents: Document[]
  }
}

export async function createDocument(data: { document_collection_id: number; name: string }) {
  return (await api.post(url('createDocument'), data)).data
}

export async function getDocument(documentId: number) {
  return (await api.get(url('getDocument', {}, documentId))).data as {
    document: Document
    versions: DocumentVersion[]
    currentVersion: DocumentVersion
  }
}

export async function updateDocument(documentId: number, data: { name: string }) {
  return (await api.put(url('updateDocument', {}, documentId), data)).data
}

export async function getDocumentVersion(documentId: number, documentVersion: number) {
  return (await api.get(url('getDocumentVersion', {}, documentId, documentVersion))).data as DocumentVersion
}

export async function createDocumentVersion(documentId: number, data: { content: string }) {
  return (await api.post(url('createDocumentVersion', {}, documentId), data)).data
}

export async function getDocumentProcessors() {
  return (await api.get(url('getDocumentProcessors'))).data
}

export async function processDocument(documentVersionId: number, processor: string) {
  return (await api.post(url('processDocument', {}, documentVersionId, processor))).data
}

export async function getDocumentFragments(documentVersionId: number) {
  return (await api.get(url('getDocumentFragments', {}, documentVersionId))).data
}
