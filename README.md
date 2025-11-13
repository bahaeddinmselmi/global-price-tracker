# International Product Price Tracker

A web app for tracking and comparing the prices of products across various international stores. Built with React, Vite, and TypeScript.

## Features

- **Product Search:** Find products from multiple sources and compare their prices internationally.
- **Price Analytics:** Visualize price trends over time with interactive charts (powered by Chart.js and react-chartjs-2).
- **Export Data:** Export price data to Excel format using ExcelJS and FileSaver.
- **Rich Filtering:** Use react-select for advanced product and data filtering.
- **Web Scraping:** Gathers price data using Cheerio and Linkedom for robust HTML parsing.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** TailwindCSS, PostCSS, clsx
- **Charts:** Chart.js, React Chart.js 2
- **Utilities:** Cheerio, Linkedom, ExcelJS, FileSaver
- **Linting/Formatting:** ESLint, Prettier

## Project Structure

- `/app`         – Core application code
- `/components`  – Reusable UI components
- `/constants`   – App-wide constants
- `/context`     – React context providers
- `/data`        – Static or mock data
- `/hooks`       – Custom React hooks
- `/services`    – API and data-fetching services
- `/supabase`    – Database integration (if Supabase used)
- `/assets`      – Static assets (images, etc.)
- `/types`       – TypeScript type definitions

## Getting Started

### Prerequisites

- Node.js (v18 or above recommended)
- npm or yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/bahaeddinmselmi/productsearch.git
cd productsearch
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

### Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm run lint` – Lint the codebase
- `npm run preview` – Preview the built app locally

## License

[MIT](LICENSE)

---

> For more details or to contribute, visit the [GitHub Repository](https://github.com/bahaeddinmselmi/productsearch).
