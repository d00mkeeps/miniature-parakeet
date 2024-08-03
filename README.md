# supercoach

## TODO:

Organise file tree as follows:

miniature-parakeet/
├── app/ # Next.js frontend with App Router
│ ├── ai/
│ │ └── page.tsx
│ ├── api/ # API routes
│ │ └── parse-timeframe/
│ │ └── route.ts
│ ├── auth/
│ │ └── callback/
│ │ └── route.ts
│ ├── home/
│ │ └── page.tsx
│ ├── login/
│ │ ├── page.tsx
│ │ └── submit-button.tsx
│ ├── profile/
│ │ └── page.tsx
│ ├── program/
│ │ └── page.tsx
│ ├── workout/
│ │ └── new/
│ │ └── page.tsx
│ ├── layout.tsx
│ ├── page.tsx
│ └── globals.css
├── backend/ # FastAPI backend (structure remains the same)
│ ├── api/
│ │ ├── **init**.py
│ │ └── endpoints/
│ │ ├── **init**.py
│ │ ├── timeframe.py
│ │ └── goals.py
│ ├── core/
│ │ ├── **init**.py
│ │ ├── config.py
│ │ └── logging.py
│ ├── models/
│ │ ├── **init**.py
│ │ ├── timeframe.py
│ │ └── goal.py
│ ├── services/
│ │ ├── **init**.py
│ │ ├── timeframe_parser.py
│ │ ├── workout_data.py
│ │ └── ai_coach.py
│ ├── utils/
│ │ ├── **init**.py
│ │ └── formatting.py
│ ├── main.py
│ └── requirements.txt
├── components/ # Shared frontend components
│ ├── auth/
│ ├── exercise/
│ │ ├── atoms/
│ │ ├── molecules/
│ │ └── organisms/
│ ├── profile/
│ │ ├── atoms/
│ │ ├── molecules/
│ │ └── organisms/
│ ├── program/
│ │ ├── atoms/
│ │ ├── molecules/
│ │ └── organisms/
│ └── shared/
│ ├── atoms/
│ ├── molecules/
│ └── organisms/
├── lib/ # Shared frontend utilities and hooks
│ ├── context/
│ ├── hooks/
│ └── utils/
│ ├── supabase/
│ └── supabaseFunctions/
├── public/ # Static assets
├── styles/ # Global styles
├── types/ # TypeScript type definitions
├── .gitignore
├── README.md
├── middleware.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json

### Main changes:

- Backend is better organised
- Utils, hooks, and context are now in a lib directory.
- Slightly reorganise the supabase-related files.
