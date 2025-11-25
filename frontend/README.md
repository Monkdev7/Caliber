# Caliber - Job Scraper Frontend

A modern, responsive React + Vite frontend for the Caliber job scraping application. Built with Tailwind CSS and Lucide React icons.

## Features

✨ **Modern UI/UX**

- Clean, professional design with gradient backgrounds
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Dark mode ready

🔍 **Job Search & Filtering**

- Real-time search across job titles and companies
- Advanced filtering by title, company, location, and source
- Toggle filters on/off with a single click

📊 **Data Management**

- Display scraped jobs from multiple sources (LinkedIn, Naukri)
- Export jobs to CSV format
- Statistics dashboard showing total jobs, sources, and companies

🚀 **Scraping Controls**

- One-click job scraping for LinkedIn and Naukri
- Loading states and error handling
- Real-time updates

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or pnpm

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Create `.env.local` file (copy from `.env.example`):

```bash
cp .env.example .env.local
```

4. Update API URL in `.env.local` if needed:

```
VITE_API_URL=http://localhost:5000/api
```

### Development

Start the development server:

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
# or
pnpm build
```

Preview the production build:

```bash
npm run preview
# or
pnpm preview
```

### Linting

Check code with ESLint:

```bash
npm run lint
# or
pnpm lint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Navigation header with scrape buttons
│   │   ├── JobCard.jsx       # Individual job listing card
│   │   └── FilterPanel.jsx   # Advanced filtering panel
│   ├── App.jsx               # Main app component
│   ├── App.css               # App styles and animations
│   ├── main.jsx              # React entry point
│   └── index.css             # Global Tailwind styles
├── public/                   # Static assets
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## API Integration

The frontend communicates with the backend API at the URL specified in `VITE_API_URL`.

### API Endpoints Used

- `GET /api/jobs` - Fetch all jobs
- `POST /api/scrape` - Trigger job scraping

### Example Request

```javascript
// Fetch jobs
const response = await axios.get(`${API_URL}/jobs`);

// Trigger scraping
const response = await axios.post(`${API_URL}/scrape`, {
  source: "linkedin", // or 'naukri'
});
```

## Components

### Header

Navigation component with logo and scrape buttons. Responsive design for mobile and desktop.

### JobCard

Displays individual job with:

- Job title and company
- Location, salary, experience level
- Posted date
- Source badge
- Apply link

### FilterPanel

Advanced filtering options:

- Filter by job title
- Filter by company
- Filter by location
- Filter by source (LinkedIn/Naukri)
- Clear all filters button

## Styling

- **Tailwind CSS** - Utility classes for responsive design
- **Custom animations** - Fade-in and slide-up effects
- **Component classes** - Reusable Tailwind components
  - `.btn-primary` - Primary button style
  - `.btn-secondary` - Secondary button style
  - `.card` - Card component with shadow
  - `.input-field` - Form input styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] User authentication and saved jobs
- [ ] Email notifications for new jobs
- [ ] Advanced search with AI
- [ ] Dark mode toggle
- [ ] Job comparison feature
- [ ] Salary history charts
- [ ] Social sharing

## Contributing

Contributions are welcome! Please follow the existing code style and create a new branch for features.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or feedback, please open an issue in the repository.
