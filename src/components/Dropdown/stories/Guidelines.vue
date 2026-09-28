<script setup lang="ts">
// A live Dropdown has to stay open to show any of these — but its menu
// portals to <body> and doesn't reserve layout space, so four of them open at
// once on a static page overlap each other and the captions (the same problem
// Combobox's open-popover guidelines hit). These reproduce Menu's own classes
// one to one (`menuClasses` in Menu/utils.ts, ItemListRow's `sm` row) instead
// of approximating them.
const panelClass =
  'divide-y divide-outline-elevation-2 rounded-6 bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5'
const groupClass = 'flex flex-col p-1.5'
const groupLabelClass =
  'flex h-7 items-center px-2 text-sm font-medium leading-tighter text-ink-gray-4'
const itemClass =
  'flex min-h-7 items-center gap-2 rounded-4 px-2 py-1.5 text-base text-ink-gray-7'
const iconClass = 'size-4 shrink-0 text-ink-gray-6'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Group relevant items (do-only) -->
    <Guideline
      :mark="false"
      caption="Keep the list easy to scan by grouping relevant items."
    >
      <template #do>
        <div :class="panelClass">
          <div :class="groupClass">
            <div :class="itemClass">
              <span class="lucide-list" :class="iconClass" />
              List
            </div>
            <div :class="itemClass">
              <span class="lucide-kanban" :class="iconClass" />
              Kanban
            </div>
            <div :class="itemClass">
              <span class="lucide-list-tree" :class="iconClass" />
              Group by
            </div>
          </div>
          <div :class="groupClass">
            <p :class="groupLabelClass">Saved views</p>
            <div :class="itemClass">
              <span class="lucide-kanban" :class="iconClass" />
              Jan '25 Deals
            </div>
            <div :class="itemClass">
              <span class="lucide-list" :class="iconClass" />
              Deals ready to close
            </div>
            <div :class="itemClass">
              <span class="lucide-list" :class="iconClass" />
              Lost deals
            </div>
          </div>
          <div :class="groupClass">
            <p :class="groupLabelClass">Public views</p>
            <div :class="itemClass">
              <span
                class="inline-flex size-4 shrink-0 items-center justify-center"
                >🙌</span
              >
              My leads
            </div>
            <div :class="itemClass">
              <span class="lucide-list" :class="iconClass" />
              My open leads
            </div>
          </div>
          <div :class="groupClass">
            <div :class="itemClass">
              <span class="lucide-plus" :class="iconClass" />
              Create view
            </div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 2. Search narrows a long list. Dropdown has no built-in search row —
         this is the pattern to reach for once the list gets long, mocked
         because there's no prop that adds it. -->
    <Guideline
      caption="Make use of a search field to narrow down the list once it gets too long."
    >
      <template #do>
        <div :class="[panelClass, 'w-56']">
          <div class="p-1.5">
            <div
              class="mb-1 flex h-7 items-center gap-1.5 rounded-4 border border-outline-gray-2 bg-surface-base px-2 text-base text-ink-gray-5"
            >
              <span class="lucide-search size-4" />
              Search
            </div>
            <div :class="itemClass">Accounting</div>
            <div :class="itemClass">Advertising</div>
            <div :class="itemClass">Aerospace</div>
            <div :class="itemClass">Agriculture</div>
            <div :class="itemClass">Airline</div>
          </div>
        </div>
      </template>
      <template #dont>
        <div :class="[panelClass, 'w-56']">
          <div class="p-1.5">
            <div :class="itemClass">Accounting</div>
            <div :class="itemClass">Advertising</div>
            <div :class="itemClass">Aerospace</div>
            <div :class="itemClass">Agriculture</div>
            <div :class="itemClass">Airline</div>
            <div :class="itemClass">Apparel &amp; Accessories</div>
            <div :class="itemClass">Automotive</div>
            <div :class="itemClass">Banking</div>
            <div :class="[itemClass, 'text-ink-gray-4']">Biotechnology</div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 3. Constrain panel height once options exceed a reasonable count.
         Dropdown has no `maxHeight` either — a consumer clamps it themselves,
         which is exactly what the "do" side illustrates. -->
    <Guideline
      caption="Constrain panel height and scroll internally once options exceed a reasonable count."
    >
      <template #do>
        <div :class="[panelClass, 'w-56']">
          <div class="scrollbar max-h-48 overflow-y-auto p-1.5">
            <div :class="itemClass">Accounting</div>
            <div :class="itemClass">Advertising</div>
            <div :class="itemClass">Aerospace</div>
            <div :class="itemClass">Agriculture</div>
            <div :class="itemClass">Airline</div>
            <div :class="itemClass">Apparel &amp; Accessories</div>
            <div :class="itemClass">Automotive</div>
            <div :class="itemClass">Banking</div>
            <div :class="itemClass">Biotechnology</div>
          </div>
        </div>
      </template>
      <template #dont>
        <div :class="[panelClass, 'w-56']">
          <div class="p-1.5">
            <div :class="itemClass">Accounting</div>
            <div :class="itemClass">Advertising</div>
            <div :class="itemClass">Aerospace</div>
            <div :class="itemClass">Agriculture</div>
            <div :class="itemClass">Airline</div>
            <div :class="itemClass">Apparel &amp; Accessories</div>
            <div :class="itemClass">Automotive</div>
            <div :class="itemClass">Banking</div>
            <div :class="[itemClass, 'text-ink-gray-4']">Biotechnology</div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 4. Submenu stays aligned with its parent row. Reka positions this the
         same way in `do`; `don't` reproduces a submenu whose content isn't
         top-aligned to its trigger, drifting from and overlapping the parent
         menu. -->
    <Guideline
      caption="Keep submenus aligned with the parent menu and avoid overlap for clear navigation."
    >
      <template #do>
        <div class="relative">
          <div :class="[panelClass, 'w-40']">
            <div class="p-1.5">
              <div :class="itemClass">
                <span class="lucide-captions" :class="iconClass" />
                Captions
              </div>
              <div :class="itemClass">
                <span class="lucide-link" :class="iconClass" />
                Edit link
              </div>
              <div :class="[itemClass, 'bg-surface-gray-3']">
                <span class="lucide-align-left" :class="iconClass" />
                Align
                <span
                  class="lucide-chevron-right ml-auto size-4 shrink-0 text-ink-gray-6"
                />
              </div>
              <div :class="itemClass">
                <span class="lucide-download" :class="iconClass" />
                Download
              </div>
            </div>
          </div>
          <div :class="[panelClass, 'absolute left-[9.5rem] top-11 w-32']">
            <div class="p-1.5">
              <div :class="itemClass">
                <span class="lucide-align-left" :class="iconClass" />
                Left
              </div>
              <div :class="itemClass">
                <span class="lucide-align-center" :class="iconClass" />
                Center
              </div>
              <div :class="itemClass">
                <span class="lucide-align-right" :class="iconClass" />
                Right
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="relative">
          <div :class="[panelClass, 'w-40']">
            <div class="p-1.5">
              <div :class="itemClass">
                <span class="lucide-captions" :class="iconClass" />
                Captions
              </div>
              <div :class="itemClass">
                <span class="lucide-link" :class="iconClass" />
                Edit link
              </div>
              <div :class="[itemClass, 'bg-surface-gray-3']">
                <span class="lucide-align-left" :class="iconClass" />
                Align
                <span
                  class="lucide-chevron-right ml-auto size-4 shrink-0 text-ink-gray-6"
                />
              </div>
              <div :class="itemClass">
                <span class="lucide-download" :class="iconClass" />
                Download
              </div>
            </div>
          </div>
          <div :class="[panelClass, 'absolute left-32 top-20 w-32']">
            <div class="p-1.5">
              <div :class="itemClass">
                <span class="lucide-align-left" :class="iconClass" />
                Left
              </div>
              <div :class="itemClass">
                <span class="lucide-align-center" :class="iconClass" />
                Center
              </div>
              <div :class="itemClass">
                <span class="lucide-align-right" :class="iconClass" />
                Right
              </div>
            </div>
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
