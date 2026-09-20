import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env'

if (!process.env.SANITY_API_WRITE_TOKEN) {
  throw new Error(
    'SANITY_API_WRITE_TOKEN이 설정되지 않았습니다.'
  );
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});