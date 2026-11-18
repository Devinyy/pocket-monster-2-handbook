import assert from 'node:assert/strict'
import forumPosts from '../src/data/forum.json' with { type: 'json' }
import {
  getLatestMonthlyActivity,
  getMonthlyActivities,
  getMissingActivityMonths,
  getActivityPeriod,
} from '../src/data/activity.ts'

const latest = getLatestMonthlyActivity(forumPosts)
assert.equal(latest?.id, '138')
assert.equal(latest?.title, '2026.11 万圣')
assert.equal(getActivityPeriod(latest?.text ?? ''), '11.1 ~ 11.25')

const futurePost = { id: '139', title: '2026.12 圣诞', date: '2026-11-30', text: '圣诞活动（12.1 ~ 12.25）' }
assert.equal(getLatestMonthlyActivity([futurePost, ...forumPosts])?.id, '139')

const targetMonths = ['2026.6', '2026.7', '2026.8', '2026.9', '2026.10', '2026.11']
assert.deepEqual(
  getMonthlyActivities(forumPosts, targetMonths).map((post) => post.title),
  ['2026.11 万圣', '2026.10 国庆', '2026.9 中秋', '2026.8 七夕', '2026.7 盛夏', '2026.6 六一'],
)
assert.deepEqual(getMissingActivityMonths(forumPosts, targetMonths), [])
assert.deepEqual(getMissingActivityMonths(forumPosts, ['2026.6', '2026.12']), ['2026.12'])

assert.equal(getLatestMonthlyActivity([
  { id: '1', title: '普通公告', date: '2026-11-18', text: '暂无月度活动' },
]), null)

console.log('activity data checks passed')
