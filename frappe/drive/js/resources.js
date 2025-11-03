import { createResource } from '../../../src'
export const getTeams = createResource({
  url: '/api/method/drive.api.permissions.get_teams',
  params: {
    details: 1,
  },
  method: 'GET',
  cache: 'teams',
})
