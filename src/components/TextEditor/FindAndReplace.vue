<template>
    <Popover transition="default " @Close="cleanupFindReplace">
        <template #target="{ togglePopover, isOpen }">
            <slot v-bind="{ onClick: () => togglePopover(), isActive: isOpen }"></slot>
        </template>
        <template #body-main>
            <div class="find-popup p-2 bg-white  rounded  w-64">
                <div class="flex items-center  mb-2">
                    <FormControl type="text" label="Find" @input="onFind" v-model="findValue">
                        <template #suffix>
                            <button :class="[
                                'rounded-sm',
                                caseSensitive ? 'bg-[#d6d6d6] ' : 'bg-[#efefef]'
                            ]" @click="toggleCase" title="match case">
                                <textCase />
                            </button>
                        </template>
                    </FormControl>
                    <div class="flex mt-5">
                        <button @click="prevMatch" :disabled="!hasMatches">
                            <chevronUp class="h-5" />
                        </button>
                        <button @click="nextMatch" :disabled="!hasMatches">
                            <chevronDown class="h-5" />
                        </button>
                    </div>
                    <span class="mt-5 text-sm text-ink-gray-5 min-w-[4ch] text-center inline-block">
                        {{ displayIndex }}/{{ totalMatches }}
                    </span>
                </div>
                <FormControl type="text" label="Replace" @input="onFind" v-model="replaceValue" />
                <div class="flex justify-end space-x-2">
                    <Button @click="replaceOne" class="px-2 py-1 border rounded text-sm mt-1">
                        Replace
                    </Button>
                    <Button @click="replaceAll" class="px-2 py-1 border rounded text-sm mt-1">
                        Replace All
                    </Button>
                </div>
            </div>
        </template>

    </Popover>

</template>

<script lang="ts">
import { ref, computed, watch, Ref } from 'vue'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import chevronDown from './icons/chevron-down.vue'
import chevronUp from './icons/chevron-up.vue'
import { Editor } from '@tiptap/core'
import { Button } from '../Button'
import FormControl from '../FormControl.vue'
import textCase from './icons/text-case.vue';

interface Match {
    from: number
    to: number
}

const FindPluginKey = new PluginKey('findReplacePlugin')

export default {
    name: 'FindAndReplace',
    props: {
        editor: {
            type: Object as () => Editor,
            required: true
        },
    },
    components: {
        chevronUp,
        chevronDown
    },

    setup(props: { editor: Editor }) {
        const findValue: Ref<string> = ref('')
        const replaceValue: Ref<string> = ref('')
        const caseSensitive: Ref<boolean> = ref(false)
        const matches: Ref<Match[]> = ref([])
        const currentIndex: Ref<number> = ref(0)
        let decorationPlugin: Plugin | null = null

        function escapeRE(s: string): string {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        }

        function computeMatches(): void {
            const doc = props.editor.state.doc
            const list: Match[] = []

            if (findValue.value) {
                const flags = caseSensitive.value ? 'g' : 'gi'
                const re = new RegExp(escapeRE(findValue.value), flags)

                doc.descendants((node, pos) => {
                    if (node.isText && node.text) {
                        let m: RegExpExecArray | null
                        re.lastIndex = 0
                        while ((m = re.exec(node.text))) {
                            list.push({
                                from: pos + m.index,
                                to: pos + m.index + m[0].length
                            })
                        }
                    }
                })
            }

            matches.value = list
            currentIndex.value = 0
            applyDecorations()
        }
        //highlight the selected text
        function applyDecorations(): void {
            if (decorationPlugin) {
                props.editor.unregisterPlugin(FindPluginKey)
            }

            decorationPlugin = new Plugin({
                key: FindPluginKey,
                props: {
                    decorations(state) {
                        const decos = matches.value.map((match, idx) =>
                            Decoration.inline(
                                match.from,
                                match.to,
                                { class: idx === currentIndex.value ? 'find-current' : 'find-match' }
                            )
                        )
                        return DecorationSet.create(state.doc, decos)
                    }
                }
            })

            props.editor.registerPlugin(decorationPlugin)
            props.editor.view.updateState(props.editor.state)
        }

        function scrollToCurrent(): void {
            if (!matches.value.length) return
            const m = matches.value[currentIndex.value]
            props.editor.commands.setTextSelection({ from: m.from, to: m.to })
            props.editor.commands.focus()
        }

        //highlight the matches 
        function nextMatch(): void {
            if (!matches.value.length) return
            currentIndex.value = (currentIndex.value + 1) % matches.value.length
            scrollToCurrent()
            applyDecorations()
        }
        
        function prevMatch(): void {
            if (!matches.value.length) return
            currentIndex.value = (currentIndex.value - 1 + matches.value.length) % matches.value.length
            scrollToCurrent()
            applyDecorations()
        }
        //replace currently selected text
        function replaceOne(): void {
            if (!matches.value.length) return
            const m = matches.value[currentIndex.value]
            props.editor.commands.insertContentAt({ from: m.from, to: m.to }, replaceValue.value)
            computeMatches()
        }

        function replaceAll(): void {
            if (!matches.value.length) return
            matches.value.slice().reverse().forEach(m => {
                props.editor.commands.insertContentAt({ from: m.from, to: m.to }, replaceValue.value)
            })

            computeMatches()
        }

        //highlight text as its typed
        function onFind(): void {
            computeMatches()
        }

        function toggleCase(): void {
            caseSensitive.value = !caseSensitive.value
            computeMatches()
        }
        watch([findValue, caseSensitive], () => {
            computeMatches()
        })

        //cleanup on popup close
        function cleanupFindReplace(): void {
            findValue.value = ''
            replaceValue.value = ''
            matches.value = []
            currentIndex.value = 0
            if (decorationPlugin) {
                props.editor.unregisterPlugin(FindPluginKey)
                decorationPlugin = null
            }
        }

        return {
            findValue,
            replaceValue,
            caseSensitive,
            matches,
            currentIndex,
            onFind,
            toggleCase,
            nextMatch,
            prevMatch,
            replaceOne,
            replaceAll,
            cleanupFindReplace,
            hasMatches: computed((): boolean => matches.value.length > 0),
            totalMatches: computed((): number => matches.value.length),
            displayIndex: computed((): number => matches.value.length ? currentIndex.value + 1 : 0),
        }
    },
}
</script>

<style>
.find-match {
    background-color: rgba(255, 235, 59, 0.4);
}

.find-current {
    background-color: rgba(255, 152, 0, 0.6);
}
</style>