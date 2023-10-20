## Props

### Row Key

`row-key` is a unique key which is used to identify each row in the list. It is
required to be passed in the `row` object.

### Column

1. `label` & `key` is required in column object.

2. `width` is optional and it is used to set column width in list

   1. If you need a column to be `3` times a default column then add `3`. if
      width is not mentioned default will be `1`
   2. You can also add custom width in px and rem e.g `300px` or `12rem`
   3. Combination of both can also be used.

3. `align` is also optional. You can change the alignment of the content in the
   column by setting it as.

   1. `start` or `left` (default)
   2. `center` or `middle`
   3. `end` or `right`

4. You can add more attributes which can be used to render custom column header
   items.

### Row

1. The row object must contain a unique_key which was mentioned in ListView
   `row-key`
2. Then you can add the row fields as key value pairs and each field can be an
   object or a string (to handle custom rendering)

   ```
   {
   	// unique_key 'id'
   	id: 1,

   	// row fields
   	name: 'John Doe',
   	age: 25,
   	email: 'john@doe.com',
   }
   ```

   E.g field value as an object (to handle custom rendering), but make sure it
   has a `label` attribute which holds the actual value to be shown

   ```
   row: {
   	name: {
   		label: 'John Doe',
   		image: '/johndoe.jpg',
   	},
   	age: 25,
   	status: {
   		label: 'Active',
   		color: 'green'
   	}
   }
   ```

### Options

1. If you want to route using router-link just add a `getRowRoute` function
   which returns a route object

   `getRowRoute: (row) => ({ name: 'User', params: { userId: row.id } })`

2. if you need to do some action add a `onRowClick` event handler

   `onRowClick: (row) => console.log(row.label + ' was clicked')`

3. selectable (Boolean) - if true, checkbox will be shown in header and rows, to
   select/multiselect rows and perform some action on them - default is true
4. showTooltip (Boolean) - if true, tooltip will be shown on hover of row -
   default is true

---

### Selection Banner (Will be shown when selectable (default is true) is true)

**Without custom action buttons:**
<img width="1213" alt="image" src="https://github.com/frappe/frappe-ui/assets/30859809/36fafcf5-45c6-43f0-acde-f64afe38b550">

**With custom action buttons:**
<img width="1212" alt="image" src="https://github.com/frappe/frappe-ui/assets/30859809/55e751b2-df66-4ff0-b852-af463014463f">

```
<ListSelectBanner>
	<template #actions>
	  <div class="flex gap-2">
	    <Button variant="ghost" label="Delete" />
	    <Button variant="ghost" label="Edit" />
	  </div>
	</template>
</ListSelectBanner>
```

You can also make your own custom selection banner

<img width="629" alt="image" src="https://github.com/frappe/frappe-ui/assets/30859809/38dfa834-96a2-4ac5-ad4b-30b3e6871d3f">

```
<ListSelectBanner>
	<div>Custom Banner</div>
</ListSelectBanner>
```
