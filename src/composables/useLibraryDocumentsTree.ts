import { createCollection, createDocument, getCollections } from '@/api/documents'
import type { Document, DocumentCollection } from '@/types'
import { ref, watch } from 'vue'

export function useLibraryDocumentsTree(props: { libraryId: number }) {
  type DocumentCollectionView = DocumentCollection & { open: boolean }

  const collections = ref<DocumentCollectionView[]>([])
  const documents = ref<Document[]>([])
  const selectedDocumentId = ref<number>()

  const loadCollections = async () => {
    if (!props.libraryId) {
      collections.value = []
      return
    }
    const response = await getCollections(props.libraryId)
    collections.value = response.collections.map((c) => ({
      ...c,
      open: true
    }))
    documents.value = response.documents
    selectedDocumentId.value = documents.value.length > 0 ? documents.value[0].id : undefined
  }

  watch(() => props.libraryId, loadCollections, { immediate: true })

  const createCollectionAction = async () => {
    const name = prompt('Nome da nova collection')

    if (!name || name === '' || !props.libraryId) {
      return
    }

    await createCollection({ name, document_library_id: props.libraryId })
    await loadCollections()
  }

  const createDocumentAction = async (collectionId: number) => {
    const name = prompt('Nome do novo documento')

    if (!name || name === '' || !collectionId) {
      return
    }

    await createDocument({ name, document_collection_id: collectionId })
    await loadCollections()
  }

  const documentsForCollection = (collectionId: number) => {
    return documents.value.filter((d) => d.document_collection_id === collectionId)
  }

  const updateDocumentName = (newName: string) => {
    documents.value = documents.value.map((d) => {
      if (d.id === selectedDocumentId.value) {
        return { ...d, name: newName }
      }
      return d
    })
  }

  return {
    collections,
    documents,
    selectedDocumentId,
    createCollectionAction,
    createDocumentAction,
    documentsForCollection,
    updateDocumentName
  }
}
