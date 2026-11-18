import assert from 'node:assert/strict'
import forumPosts from '../src/data/forum.json' with { type: 'json' }
import { getLatestMonthlyActivity, getActivityPeriod } from '../src/data/activity.ts'

const latest = getLatestMonthlyActivity(forumPosts)
assert.equal(latest?.id, '138')
assert.equal(latest?.title, '2026.11 万圣')
assert.equal(getActivityPeriod(latest?.text ?? ''), '11.1 ~ 11.25')

const futurePost = { id: '139', title: '2026.12 圣诞', date: '2026-11-30', text: '圣诞活动（12.1 ~ 12.25）' }
assert.equal(getLatestMonthlyActivity([futurePost, ...forumPosts])?.id, '139')

assert.equal(getLatestMonthlyActivity([
  { id: '1', title: '普通公告', date: '2026-11-18', text: '暂无月度活动' },
]), null)

console.log('activity data checks passed')
