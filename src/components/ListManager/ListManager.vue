<template>
  <div class="h-full flex flex-col">
    <div class="shrink-0">
      <slot :fields="manager.options?.fields" name="header"></slot>
    </div>
    <div 
      ref="body" 
      :class="manager.options?.classes?.body" 
      class="grow overflow-auto" 
      @scroll="onScroll"
    >
      <div 
        ref="rows" 
        v-for="rowData in manager.list" 
        :key="rowData.name"
      >
        <div @click="handleRowClick(rowData)">
          <slot 
            :row="{
              data: rowData, 
              meta: {
                selected: selectedItems[rowData.name]
              }
            }" 
            name="listItem"
          ></slot>
        </div>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ListManager',
  props: ['options'],
  setup(props, context) {
    const options = {
      ...props.options
    }
    const resource = ref(null)
    const newItems = ref([])
    const selectedItems = ref({})
    const manager = ref({
      loading: false,
      resource,
      options,
      selectedItems,
      list: [],
      loadMore: () => {
        manager.value.loading = true
        resource.value.update({
          ...options,
          start: manager.value.list.length,
          limit: options.limit
        })
      },
      update: (newOptions) => {
        clearList()
        if (newOptions.filters) options.filters = newOptions.filters
        if (newOptions.order_by) options.order_by = newOptions.order_by
        resource.value.update({
          ...options,
          start: 0,
          limit: options.limit
        })
      },
    })
    const clearList = () => {
      manager.value.list = []
      newItems.value = []
      selectedItems.value = {}
    }
    context.expose({ manager })
    return {
      manager,
      newItems,
      selectedItems
    }
  },
  mounted() {
    this.manager.resource = this.$resources.list
    this.handleRealtimeUpdate()
  },
  resources: {
    list() {
      return {
        type: 'list',
        doctype: this.options?.doctype,
        fields: [...this.options?.fields, "name"],
        cache: this.options?.cache,
        order_by: this.options?.order_by,
        filters: this.options?.filters,
        start: 0,
        limit: this.options?.limit || 20,
        onSuccess: (data) => {
          /**
           * Remove all the duplicates which might have been added to the
           * current list when new entry was added via socket list_update
           */
          var newItems = this.newItems
          data = data.filter(function(i) {
            return !newItems.find(j => {
              return j === i.name
            });
          });
          
          this.manager.list = [...this.manager.list, ...data]
          this.manager.loading = false
        }
      }
    },
    document() {
      return {
        method: 'frappe.client.get_list',
        onSuccess: (data) => {
          if (data.length > 0) {
            const itemIndex = this.manager.list.findIndex(item => item.name === data[0].name)
            if (itemIndex != -1) {
              this.manager.list[itemIndex] = data[0]
            } else {
              this.manager.list.unshift(data[0])
              this.newItems.push(data[0].name)
            }
            this.manager.loading = false
          }
        }
      }
    }
  },
  methods: {
    handleRowClick(rowData) {
      if (this.manager.options.handle_item_selection) {
        this.selectedItems[rowData.name] = !this.selectedItems[rowData.name]
      }
    },
    onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
			if (scrollTop + clientHeight >= scrollHeight) {
				if (this.manager.options.auto_pagination) {
          this.manager.loadMore()
        }
			}
		},
    handleRealtimeUpdate() {
      this.$socket.on("list_update", (data) => {
        if (data.doctype === this.options.doctype) {
          this.$resources.document.fetch({
            doctype: this.manager.options.doctype,
            filters: {
              ...this.options.filters,
              name: data.name
            },
            fields: this.manager.options.fields,
            limit: 1
          })
        }
      })
    }
  }
}
</script>