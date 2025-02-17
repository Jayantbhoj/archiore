'use client';

import React from 'react';
import { FocusCards } from './ui/FocusCards';


const exploreCategories = [
  {
    title: 'Site Analysis',
    src: '/site-analysis.jpg',
  },
  {
    title: 'Site Plan',
    src: '/site-plan.jpg',
  },
  {
    title: 'Zoning',
    src: '/zoning.jpg',
  },
  {
    title: 'Section',
    src: '/section.jpg',
  },
  {
    title: 'Elevation',
    src: '/elevations.jpg',
  },
  {
    title: 'Floor Plan',
    src: '/floor-plans.jpg',
  },
];

export default function ExploreCards() {
  return (
    <div className="min-h-screen bg-myWhite dark:bg-neutral-950 py-16 px-4 md:px-12">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Discover Architectural Sheets
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Browse through various categories to explore architectural designs.
        </p>
      </div>
      <FocusCards cards={exploreCategories} />
    </div>
  );
}
