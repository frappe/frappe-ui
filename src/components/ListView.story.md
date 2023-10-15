**Column:**

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

**Row**

1. The row object must contain a unique_key which was mentioned in ListView
   `row-key`
2. You can either add all row fields in a separate `row` object or just add them
   in directly if the fieldnames doesn't conflict with `route` or `onClick` E.g.
   1

   ```
   {
   	// unique_key 'id'
   	id: 1,

   	// row fields
   	name: 'John Doe',
   	age: 25,
   	email: 'john@doe.com',

   	// if you need to route
   	route: { label: 'User', { params: { userId: 1 } }

   	// if you need to perform action
   	onClick: () => console.log('John Doe was clicked')

   	// you can add more options after this which you can use to render custom row items
   }
   ```

   E.g. 2

   ```
   {
   	// unique_key 'id'
   	id: 1,

   	// row fields in separate row object
   	row: {
   	name: 'John Doe',
   	age: 25,
   	email: 'john@doe.com',
   	route: '', // used separate row to avoid this conflict
   	}

   	// if you need to route
   	route: { label: 'User', { params: { userId: 1 } }

   	// if you need to perform action
   	onClick: () => console.log('John Doe was clicked')

   	// you can add more options after this which you can use to render custom row items
   }
   ```

3. You can also add an object for the field value but make sure it has a `label`
   attribute which holds the actual value to be shown
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
4. Click action: Add route or onClick event in row object
   1. If you want to route using router-link just add a
      `route: { name: 'User', params: { userId: 2 } }`
   2. if you need to do some action or open a dialog add a click event instead
      of a route `onClick: () => console.log('John Doe was clicked')`

**Selection Banner:**

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
