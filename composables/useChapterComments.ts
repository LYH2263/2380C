import { useMemoize } from '@vueuse/core'
import type {
  Comment,
  ParagraphCommentMap,
  SubmitCommentOptions,
  ChapterWithComments,
} from '~/types/comment'

export const useChapterComments = (
  chapterId: MaybeRefOrGetter<number | string | undefined>,
  chapter: Ref<ChapterWithComments | null | undefined>,
  refresh: () => Promise<void>,
) => {
  const toast = useToast()

  const activeParagraph = ref<number | null>(null)
  const newComment = ref('')
  const chapterComment = ref('')
  const paragraphCommentLoading = ref(false)
  const chapterCommentLoading = ref(false)

  const resolveChapterId = () => toValue(chapterId)

  const memoizedGroupByParagraph = useMemoize(
    (comments: readonly Comment[] | undefined): ParagraphCommentMap => {
      if (!comments) return {}
      const grouped: Record<number, Comment[]> = {}
      for (const comment of comments) {
        if (comment.paragraph !== null) {
          if (!grouped[comment.paragraph]) {
            grouped[comment.paragraph] = []
          }
          grouped[comment.paragraph].push(comment)
        }
      }
      return grouped
    },
    { getKey: (comments) => JSON.stringify(comments) },
  )

  const paragraphComments = computed<ParagraphCommentMap>(() => {
    return memoizedGroupByParagraph(chapter.value?.comments)
  })

  const toggleParagraphComment = (index: number) => {
    activeParagraph.value = activeParagraph.value === index ? null : index
  }

  const submitCommentInternal = async (
    options: SubmitCommentOptions,
    loadingRef: Ref<boolean>,
    clearContent: () => void,
  ): Promise<boolean> => {
    const { content, paragraphIndex, onSuccess } = options

    if (!content.trim()) return false

    const cid = resolveChapterId()
    if (!cid) {
      toast.error('无效的章节ID')
      return false
    }

    loadingRef.value = true
    try {
      await $fetch(`/api/chapters/${cid}/comments`, {
        method: 'POST',
        body: {
          content: content.trim(),
          ...(paragraphIndex !== undefined && { paragraph: paragraphIndex }),
        },
      })
      clearContent()
      await refresh()
      if (onSuccess) await onSuccess()
      toast.success('评论成功')
      return true
    } catch (e: unknown) {
      const err = e as { message?: string }
      toast.error(err.message || '评论失败')
      return false
    } finally {
      loadingRef.value = false
    }
  }

  const submitParagraphComment = async (paragraphIndex: number): Promise<boolean> => {
    return submitCommentInternal(
      {
        content: newComment.value,
        paragraphIndex,
      },
      paragraphCommentLoading,
      () => {
        newComment.value = ''
      },
    )
  }

  const submitChapterComment = async (): Promise<boolean> => {
    return submitCommentInternal(
      {
        content: chapterComment.value,
      },
      chapterCommentLoading,
      () => {
        chapterComment.value = ''
      },
    )
  }

  return {
    activeParagraph,
    newComment,
    chapterComment,
    paragraphCommentLoading,
    chapterCommentLoading,
    paragraphComments,
    toggleParagraphComment,
    submitParagraphComment,
    submitChapterComment,
  }
}
