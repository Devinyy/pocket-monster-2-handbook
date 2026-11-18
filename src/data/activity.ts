export interface ForumActivityPost {
  id: string
  title: string
  date: string
  text: string
}

const MONTHLY_ACTIVITY_TITLE = /^\d{4}\.\d{1,2}(?:\s|$)/

export function getLatestMonthlyActivity(posts: ForumActivityPost[]): ForumActivityPost | null {
  return posts.find((post) => MONTHLY_ACTIVITY_TITLE.test(post.title.trim())) ?? null
}

export function getActivityPeriod(text: string): string {
  const match = text.match(/[（(](\d{1,2}\.\d{1,2}\s*~\s*\d{1,2}\.\d{1,2})[）)]/)
  return match?.[1] ?? ''
}
