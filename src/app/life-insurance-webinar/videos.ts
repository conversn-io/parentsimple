export type WebinarVideo = {
  n: number
  title: string
  src: string
}

export const WEBINAR_VIDEOS: WebinarVideo[] = [1, 2, 3, 4, 5].map((n) => ({
  n,
  title: `Part ${n}`,
  src: `/life-insurance-webinar/${encodeURIComponent(
    `Life Insurance Webinar Series Video ${n}.mp4`,
  )}`,
}))

export const WEBINAR_TOTAL = WEBINAR_VIDEOS.length
