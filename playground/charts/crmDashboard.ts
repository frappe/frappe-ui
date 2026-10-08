// The numbers and names behind the second dashboard: Frappe Charts
// 1555:35858, "sales agent dashboard" — a CRM's home page for one agent, as
// the file draws it. Every row is the file's own; the people and companies
// take the playground's existing pictures and logos.
import mason from '../v2/assets/600/avatar-mason-smith.png'
import liam from '../v2/assets/600/avatar-liam-green.png'
import sophia from '../v2/assets/600/avatar-sophia-blue.png'
import faris from '../v2/assets/600/avatar-faris-ansari.png'
import sandeep from '../v2/assets/600/avatar-sandeep-prabhakaran.png'
import olivia from '../v2/assets/600/avatar-olivia-garcia.png'
import ava from '../v2/assets/600/avatar-ava-rodriguez.png'
import evelyn from '../v2/assets/600/avatar-evelyn-brown.png'
import samantha from '../v2/assets/600/avatar-samantha-lee.png'
import adobe from '../v2/assets/kanban/logo-adobe.png'
import airbnb from '../v2/assets/kanban/logo-airbnb.png'
import dropbox from '../v2/assets/kanban/logo-dropbox.png'
import evergreen from '../v2/assets/kanban/logo-evergreen.png'
import facebook from '../v2/assets/kanban/logo-facebook.png'
import gumroad from '../v2/assets/kanban/logo-gumroad.png'
import spotify from '../v2/assets/kanban/logo-spotify.png'
import squarespace from '../v2/assets/kanban/logo-squarespace.png'
import stripe from '../v2/assets/kanban/logo-stripe.png'

export const crmTasks = [
  {
    title: "Evaluating a product's performance.",
    due: 'Overdue',
    overdue: true,
    contact: 'Noah',
    avatar: mason,
  },
  {
    title: 'Phases of assessing product quality.',
    due: 'Today',
    contact: 'Ethan',
    avatar: liam,
  },
  {
    title: 'Stages involved in product evaluation.',
    due: 'Today',
    contact: 'Sophia Johnson',
    avatar: sophia,
  },
  {
    title: 'Key steps in reviewing a product.',
    due: '22 Jul',
    contact: 'Lucas',
    avatar: faris,
  },
  {
    title: 'Stages of product assessment.',
    due: '25 Jul',
    contact: 'Aiden',
    avatar: sandeep,
  },
  {
    title: 'Phases of product review and analysis.',
    due: '25 Jul',
    contact: 'Mia Thompson',
    avatar: olivia,
  },
]

/**
 * The day's meetings, each with the file's own colour down its edge — brown,
 * blue, pink and teal — and who is coming.
 */
export const crmMeetings = [
  {
    time: '2:45PM - 4:15PM',
    title: 'Sales Performance',
    tone: 'orange',
    people: [liam, faris],
    count: 2,
  },
  {
    time: '2:30 - 4:00 PM',
    title: 'Customer Relationship Review',
    tone: 'blue',
    people: [ava],
  },
  {
    time: '2:45PM - 4:15PM',
    title: 'Sales Performance',
    tone: 'pink',
    people: [evelyn],
  },
  {
    time: '4:15PM - 5:45PM',
    title: 'Quarterly Strategy Session',
    tone: 'teal',
    people: [samantha],
    count: 3,
  },
] as const

export const crmFollowUps = [
  {
    title: 'Send revised proposal with updated pricing',
    updated: '20 hr ago',
    org: 'Gumroad',
    logo: gumroad,
    type: 'Lead',
  },
  {
    title: 'Follow-up on demo feedback',
    updated: '1 days ago',
    org: 'Evergreen',
    logo: evergreen,
    type: 'Lead',
  },
  {
    title: 'Confirm budget allocation and approval stage',
    updated: '2 days ago',
    org: 'Facebook',
    logo: facebook,
    type: 'Deal',
  },
  {
    title: 'Discuss potential for team-wide rollout',
    updated: '2 days ago',
    org: 'Stripe',
    logo: stripe,
    type: 'Lead',
  },
  {
    title: 'Call to check decision timeline',
    updated: '3 days ago',
    org: 'Dropbox',
    logo: dropbox,
    type: 'Deal',
  },
] as const

export const crmNewLeads = [
  { org: 'Spotify', person: 'Jordan Mitchell', logo: spotify },
  { org: 'Gumroad', person: 'Taylor Johnson', logo: gumroad },
  { org: 'Squarespace', person: 'Morgan Lee', logo: squarespace },
  { org: 'Stripe', person: 'Casey Brown', logo: stripe },
]

/**
 * The pipeline's stages and what each holds. `share` is how wide the file
 * draws each piece of the bar over them, which is its own and not the values'.
 */
export const crmStages = [
  { stage: 'Prospecting', value: 12000, share: 178 },
  { stage: 'Demo', value: 7000, share: 202 },
  { stage: 'Negotiation', value: 3000, share: 96 },
  { stage: 'Ready to close', value: 6000, share: 76 },
]

export const crmTopDeals = [
  { org: 'Evergreen', value: 125000, logo: evergreen },
  { org: 'Facebook', value: 98000, logo: facebook },
  { org: 'Adobe express', value: 77000, logo: adobe },
  { org: 'Airbnb', value: 52500, logo: airbnb },
  { org: 'Gumroad', value: 24000, logo: gumroad },
]

export const crmFunnel = [
  { stage: 'Leads', count: 385 },
  { stage: 'Qualified', count: 291 },
  { stage: 'Quotation', count: 191 },
  { stage: 'Ready to close', count: 101 },
  { stage: 'Won leads', count: 39 },
]
/**
 * How tall the file stands each step, as a share of the plot under the
 * names: 158, 126, 89.5, 62 and 39 of a 158 plot, read off 1555:35858. The
 * counts would close the last step to a tenth; the file keeps it a step.
 */
export const CRM_FUNNEL_HEIGHTS = [1, 0.797, 0.566, 0.392, 0.247]

export const crmClosure = { won: 19200, target: 24000 }

/**
 * Forecast against actual, in thousands of dollars, three readings a month:
 * the file's two lines read at each of their 17 vertices over January to June
 * (1555:35858), and a year's worth before them for the 1Y view — the same
 * shape a step lower, as a year ago would read.
 */
const SIX_FORECAST = [
  0.4, 3.8, 18.3, 20, 9.8, 24.4, 26.3, 53.5, 60.8, 63.8, 51.2, 62.7, 68.5, 88.8,
  84.6, 90, 105.5,
]
const SIX_ACTUAL = [
  21.9, 31.5, 28.7, 43.8, 43.1, 47.9, 80, 56.9, 47.7, 83.1, 97.3, 115.8, 102.6,
  124.3, 126.5, 140.1, 150,
]
const MONTHS = [
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
]
const earlier = (v: number, i: number) =>
  Math.round((v * 0.45 + (i % 3) * 2.5) * 10) / 10
/** a year: July to June, the last six months being the file's own */
const YEAR = [
  ...SIX_FORECAST.slice(0, 18).map((f, i) => ({
    forecast: earlier(f, i),
    actual: earlier(SIX_ACTUAL[i], i + 1),
  })),
  ...SIX_FORECAST.map((forecast, i) => ({ forecast, actual: SIX_ACTUAL[i] })),
].map((row, i) => ({
  ...row,
  at: `${MONTHS[Math.min(11, Math.floor(i / 3))]} ${(i % 3) + 1}`,
}))

export type ForecastRange = '3M' | '6M' | '1Y'
/** the readings each range shows: April on, January on, or all 35 */
export const crmForecast: Record<ForecastRange, typeof YEAR> = {
  '3M': YEAR.slice(-8),
  '6M': YEAR.slice(-17),
  '1Y': YEAR,
}
