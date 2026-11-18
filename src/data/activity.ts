export interface ForumActivityPost {
  id: string
  title: string
  date: string
  text: string
}

export function getActivityMonth(title: string): string | null {
  const match = title.trim().match(/^(\d{4}\.\d{1,2})(?:\s|$)/)
  return match?.[1] ?? null
}

export function getLatestMonthlyActivity(posts: ForumActivityPost[]): ForumActivityPost | null {
  return posts.find((post) => getActivityMonth(post.title) !== null) ?? null
}

export function getMonthlyActivities(posts: ForumActivityPost[], months: string[]): ForumActivityPost[] {
  const requestedMonths = new Set(months)
  return posts.filter((post) => {
    const month = getActivityMonth(post.title)
    return month !== null && requestedMonths.has(month)
  })
}

export function getMissingActivityMonths(posts: ForumActivityPost[], months: string[]): string[] {
  const presentMonths = new Set(getMonthlyActivities(posts, months).map((post) => getActivityMonth(post.title)))
  return months.filter((month) => !presentMonths.has(month))
}

export function getActivityPeriod(text: string): string {
  const match = text.match(/[（(](\d{1,2}\.\d{1,2}\s*~\s*\d{1,2}\.\d{1,2})[）)]/)
  return match?.[1] ?? ''
}
