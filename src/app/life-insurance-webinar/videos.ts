export type WebinarVideo = {
  n: number
  title: string
  vimeoId: string
}

export const WEBINAR_VIDEOS: WebinarVideo[] = [
  { n: 1, title: 'Part 1', vimeoId: '1213427906' },
  { n: 2, title: 'Part 2', vimeoId: '1213427907' },
  { n: 3, title: 'Part 3', vimeoId: '1213427951' },
  { n: 4, title: 'Part 4', vimeoId: '1213427908' },
  { n: 5, title: 'Part 5', vimeoId: '1213427905' },
]

export const WEBINAR_TOTAL = WEBINAR_VIDEOS.length

export const vimeoEmbedUrl = (id: string) =>
  `https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=0&app_id=58479`
