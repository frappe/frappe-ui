import { inject, ref, type InjectionKey, type Ref } from 'vue'

/**
 * The Charts page's "Empty state" switch: on, every card on the page draws
 * the state a chart takes with nothing to plot. The page provides it; a card
 * reads it, and outside the page it is off.
 */
export const CHARTS_EMPTY: InjectionKey<Readonly<Ref<boolean>>> =
  Symbol('chartsEmpty')

export const useChartsEmpty = () => inject(CHARTS_EMPTY, ref(false))
