import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = {
    name: 'Ahnaf An Nafee',
    status: 'Alive'
  }
  return res.status(200).json(data)
}

export default handler
