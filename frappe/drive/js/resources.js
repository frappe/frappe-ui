import { createResource } from '../../../src'
export const getTeams = createResource({
  url: 'drive.api.permissions.get_teams',
  params: {
    details: 1,
  },
  method: 'GET',
  cache: 'teams',
})

// Share dialog resources

export const usersWithAccess = createResource({
  url: 'drive.api.permissions.get_shared_with_list',
  makeParams: (params) => params,
})

export const updateAccess = createResource({
  url: 'drive.api.files.call_controller_method',
  makeParams: (params) => ({ ...params, method: params.method || 'share' }),
  onError: (error) => toast({ type: 'error', title: error.messages[0] }),
})

export const allUsers = createResource({
  url: 'drive.api.product.get_all_users',
  transform: (data) => {
    data.map((item) => {
      item.value = item.email
      item.label = item.full_name.trimEnd()
    })
  },
})
