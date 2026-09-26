// Inbox for EmailMediumList, kept outside the component so switching
// densities (which remounts the list for its crossfade) keeps read and
// starred state.
import { ref } from 'vue'
import avatar1 from '../assets/list/mail-avatar-1.png'
import avatar2 from '../assets/list/mail-avatar-2.png'
import avatar3 from '../assets/list/mail-avatar-3.png'
import avatar4 from '../assets/list/mail-avatar-4.png'
import avatar5 from '../assets/list/mail-avatar-5.png'

export interface Mail {
  id: number
  sender: string
  avatar: string
  date: string
  subject: string
  preview: string
  unread: boolean
  starred: boolean
}

export const mails = ref<Mail[]>([
  {
    id: 1,
    sender: 'Ava Martinez',
    avatar: avatar1,
    date: 'Sep 2 2024',
    subject: 'Client Meeting Presentation – Final Draft Submission',
    preview:
      'We are finalizing the presentation for the upcoming client meeting. Kindly review the attached final draft and share any last-minute changes you would like to incorporate ([Attachment: Client_Meeting_Presentation.pdf]).',
    unread: true,
    starred: false,
  },
  {
    id: 2,
    sender: 'Chloe Nguyen',
    avatar: avatar2,
    date: 'Sep 2 2024',
    subject: 'Employee Training Schedule – Confirmation Needed',
    preview:
      'Please find attached the proposed employee training schedule for the upcoming quarter. Your confirmation on the training dates and topics is required at your earliest convenience ([Attachment: Employee_Training_Schedule.pdf]).',
    unread: true,
    starred: false,
  },
  {
    id: 3,
    sender: 'Liam Patel',
    avatar: avatar3,
    date: 'Sep 3 2024',
    subject: 'Website Redesign Proposal – Initial Concepts',
    preview:
      'Attached are the initial design concepts for the upcoming website redesign project. Feedback on layout and color schemes would be greatly appreciated ([Attachment: Website_Redesign_Concepts.pdf]).',
    unread: true,
    starred: false,
  },
  {
    id: 4,
    sender: 'Jack Thompson',
    avatar: avatar4,
    date: 'Sep 2 2024',
    subject: 'Quarterly Sales Report – Data Analysis and Trends',
    preview:
      'The quarterly sales report highlighting key data analysis and trends is ready for your review. Please find the report attached for your perusal ([Attachment: Quarterly_Sales_Report.pdf]).',
    unread: false,
    starred: false,
  },
  {
    id: 5,
    sender: 'Emma Johnson',
    avatar: avatar5,
    date: 'Sep 3 2024',
    subject: 'Budget Review Meeting – Agenda and Documents',
    preview:
      'Please review the agenda and supporting documents for the budget review meeting scheduled next week. Your inputs will help streamline the discussion ([Attachment: Budget_Review_Agenda.pdf]).',
    unread: false,
    starred: false,
  },
])
