import type { NextApiRequest, NextApiResponse } from 'next'

interface StatsResponse {
  posts: number
  categories: number
  tags: number
  words: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse>
) {
  res.status(200).json({
    posts: 0,
    categories: 0,
    tags: 0,
    words: 0,
  })
}
