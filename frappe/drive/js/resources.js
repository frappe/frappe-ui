import { createResource, toast } from '../../../src'
import { prettyData } from '../../../../frontend/src/utils/files'
export const getTeams = createResource({
  url: 'drive.api.permissions.get_teams',
  params: {
    details: 1,
  },
  method: 'GET',
  cache: 'teams',
})

const COMMON_OPTIONS = {
  debounce: 500,
  transform(data) {
    return prettyData(data.filter((k) => !k.title.startsWith('.')))
  },
}

export const updateMoved = (team, new_parent, special) => {
  if (!special) {
    // All details are repetetively provided (check Folder.vue) because if this is run first
    // No further mutation of the resource object can take place
    createResource({
      ...COMMON_OPTIONS,
      url: 'drive.api.list.files',
      makeParams: (params) => ({
        ...params,
        entity_name: new_parent,
        personal: -2,
        team,
      }),
      cache: ['folder', new_parent],
    }).fetch()
  } else {
    ;(move.params.is_private ? getPersonal : getTeam).fetch({ team })
  }
}

export const move = createResource({
  url: 'drive.api.files.move',
  onSuccess(data) {
    toast.success('Moved to ' + data.title, {
      action: {
        label: 'Go',
        onClick: () => {
          if (!data.special)
            openEntity({
              name: data.name,
              is_group: true,
            })
          else router.push({ name: data.title })
        },
      },
    })

    // Update moved-into folder
    updateMoved(data.team, data.name, data.special)
  },
  onError() {
    toast.error('Could not move this file.')
  },
})

// Share dialog resources
export const usersWithAccess = createResource({
  url: 'drive.api.permissions.get_shared_with_list',
  makeParams: (params) => params,
})

export const updateAccess = createResource({
  url: 'drive.api.files.call_controller_method',
  makeParams: (params) => ({ ...params, method: params.method || 'share' }),
  onError: (error) => toast.error(error.messages[0]),
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

export const getTeam = createResource({
  ...COMMON_OPTIONS,
  url: 'drive.api.list.files',
  makeParams: (params) => {
    return {
      ...params,
      personal: 0,
    }
  },
  cache: 'team-folder-contents',
})
