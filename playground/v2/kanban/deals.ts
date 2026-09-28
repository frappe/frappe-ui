// The deals board from the file's core screen (espresso-2.0 › Core screens ›
// deals-kanban, 31739:28633): five stages, each a column of deal cards. The
// org logos are the file's own image fills.
export interface Deal {
  org: string
  date: string
  email: string
  /** the deal owner's initial, on a 16px gray disc */
  initial: string
  agent: string
  phone: string
  /** file name under assets/kanban */
  logo: string
}

export interface Stage {
  name: string
  deals: Deal[]
}

export const STAGES: Stage[] = [
  {
    name: 'Qualification',
    deals: [
      {
        org: 'Gumroad',
        date: '16 May, 2025',
        email: 'sandeep@gumroad.com',
        initial: 'S',
        agent: 'sandeep@gumroad.com',
        phone: '+91 9526883323',
        logo: 'logo-gumroad.png',
      },
      {
        org: 'Github',
        date: '16 May, 2025',
        email: 'Johnmonroe@github.com',
        initial: 'J',
        agent: 'John Monroe',
        phone: '+91 7845728889',
        logo: 'logo-github.png',
      },
      {
        org: 'Evergreen',
        date: '16 May, 2025',
        email: 'dave@evergreen.com',
        initial: 'J',
        agent: 'John Monroe',
        phone: '+91 7845728889',
        logo: 'logo-evergreen.png',
      },
    ],
  },
  {
    name: 'Demo',
    deals: [
      {
        org: 'Figma',
        date: '17 May, 2025',
        email: 'designer@figma.com',
        initial: 'D',
        agent: 'Designer Name',
        phone: '+91 9123456789',
        logo: 'logo-figma.png',
      },
      {
        org: 'Spotify',
        date: '18 May, 2025',
        email: 'team@spotify.com',
        initial: 'T',
        agent: 'Team Leader',
        phone: '+91 9876543210',
        logo: 'logo-spotify.png',
      },
      {
        org: 'Google',
        date: '19 May, 2025',
        email: 'admin@google.com',
        initial: 'A',
        agent: 'Admin User',
        phone: '+91 9988776655',
        logo: 'logo-google.png',
      },
      {
        org: 'Adobe',
        date: '20 May, 2025',
        email: 'support@adobe.com',
        initial: 'S',
        agent: 'Software Engineer',
        phone: '+91 9456123456',
        logo: 'logo-adobe.png',
      },
      {
        org: 'Github',
        date: '21 May, 2025',
        email: 'contact@github.com',
        initial: 'M',
        agent: 'Marketing Specialist',
        phone: '+91 9988112233',
        logo: 'logo-github.png',
      },
    ],
  },
  {
    name: 'Proposal',
    deals: [
      {
        org: 'Miro',
        date: '17 May, 2025',
        email: 'designer@miro.com',
        initial: 'D',
        agent: 'Admin',
        phone: '+91 9123456789',
        logo: 'logo-miro.png',
      },
      {
        org: 'Zapier',
        date: '18 May, 2025',
        email: 'team@spotify.com',
        initial: 'T',
        agent: 'Team Leader',
        phone: '+91 9876543210',
        logo: 'logo-zapier.png',
      },
    ],
  },
  {
    name: 'Negotiation',
    deals: [
      {
        org: 'Telegram',
        date: '17 May, 2025',
        email: 'designer@telegram.com',
        initial: 'J',
        agent: 'John',
        phone: '+91 9123456789',
        logo: 'logo-telegram.png',
      },
      {
        org: 'Squarespace',
        date: '18 May, 2025',
        email: 'team@squarespace.com',
        initial: 'T',
        agent: 'Team Leader',
        phone: '+91 9876543210',
        logo: 'logo-squarespace.png',
      },
      {
        org: 'Chatgpt',
        date: '19 May, 2025',
        email: 'design@chatgpt.com',
        initial: 'A',
        agent: 'Alice',
        phone: '+91 9988776655',
        logo: 'logo-chatgpt.png',
      },
      {
        org: 'Outlook',
        date: '20 May, 2025',
        email: 'creative@outlook.com',
        initial: 'M',
        agent: 'Mark',
        phone: '+91 8899776655',
        logo: 'logo-outlook.png',
      },
      {
        org: 'Hourglass',
        date: '21 May, 2025',
        email: 'support@hourglass.com',
        initial: 'K',
        agent: 'Katherine',
        phone: '+91 7766554433',
        logo: 'logo-hourglass.png',
      },
      {
        org: 'InVision',
        date: '22 May, 2025',
        email: 'info@invisionapp.com',
        initial: 'D',
        agent: 'Daniel',
        phone: '+91 6655443322',
        logo: 'logo-invision.png',
      },
    ],
  },
  {
    name: 'Read to close',
    deals: [
      {
        org: 'Stripe',
        date: '17 May, 2025',
        email: 'designer@telegram.com',
        initial: 'J',
        agent: 'John',
        phone: '+91 9123456789',
        logo: 'logo-stripe.png',
      },
      {
        org: 'Facebook',
        date: '18 May, 2025',
        email: 'team@squarespace.com',
        initial: 'T',
        agent: 'Team Leader',
        phone: '+91 9876543210',
        logo: 'logo-facebook.png',
      },
      {
        org: 'Zoom',
        date: '22 May, 2025',
        email: 'info@invisionapp.com',
        initial: 'D',
        agent: 'Daniel',
        phone: '+91 6655443322',
        logo: 'logo-zoom.png',
      },
    ],
  },
]
