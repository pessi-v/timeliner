# Timeline Proof of Concept

## Setup Instructions

1. **Install dependencies:**
   ```bash
   bundle install
   ```

2. **Create and migrate the database:**
   ```bash
   bin/rails db:create
   bin/rails db:migrate
   ```

3. **Load sample data:**
   ```bash
   bin/rails db:seed
   ```

4. **Start the Rails server:**
   ```bash
   bin/dev
   ```

5. **Visit the application:**
   Open your browser to `http://localhost:3000`

## What's Included

### Models
- **Timeline**: Container for events
- **Event**: Individual timeline events with three types:
  - `point`: Single moment in time (e.g., Hiroshima bombing)
  - `range`: Event with duration (e.g., WW2 battle)
  - `ongoing`: Events still happening (e.g., AI Revolution)
- **TimelineEvent**: Join table for many-to-many relationship

### ViewComponents
- **TimelineComponent**: Main SVG-based timeline visualization

### Features Demonstrated

✅ **Multiple Time Scales:**
- Ancient history (Sassanid Empire: 224-651 AD)
- Modern history (WWII: 1939-1945)
- Hour-minute precision (9/11 attacks)
- Ongoing events into the future

✅ **SVG Rendering:**
- Point events shown as circles
- Range events shown as rectangles
- Ongoing events shown with arrows
- Smooth zoom and pan

✅ **Interactive Controls:**
- Zoom in/out buttons
- Mouse wheel zoom
- Click-and-drag panning
- Event details modal

✅ **Visual Enhancements:**
- Color-coded events
- Automatic label positioning
- Responsive to different time scales
- Scale indicator (hours/days/months/years/decades)

## Sample Timelines

The seed data creates four example timelines:

1. **World War II** - Demonstrates year/month granularity over a 6-year span
2. **September 11, 2001** - Demonstrates hour/minute granularity within a single day
3. **The Sassanid Empire** - Demonstrates ancient dates and multi-century spans
4. **Modern Tech Era** - Demonstrates ongoing events extending into the future

## Architecture Decisions

### Why SVG?
- **Scalability**: Perfect for zoom operations
- **Precision**: Exact positioning based on timestamps
- **Performance**: Handles thousands of events efficiently
- **Visual Flexibility**: Easy to draw custom shapes, lines, and labels

### Why ViewComponents?
- **Reusability**: Easy to embed timelines anywhere
- **Testability**: Components can be unit tested
- **Separation of Concerns**: Logic separated from templates
- **Encapsulation**: Self-contained with their own assets

### Hybrid Approach
- SVG for timeline visualization
- DOM for modals and interactive elements
- Stimulus for JavaScript behavior
- Tailwind for styling

## Next Steps

To make this production-ready:

1. **Add CRUD for Events**: Controller and forms to create/edit events
2. **Timeline Merging**: Feature to combine multiple timelines
3. **Advanced Zoom**: Intelligent zoom levels that hide/show details
4. **Time Axis**: Dynamic tick marks and labels based on zoom level
5. **Export**: Export timelines as images or PDFs
6. **Filtering**: Filter events by type, date range, or keywords
7. **Virtualization**: For timelines with thousands of events
8. **Responsive Design**: Mobile-friendly version

## Code Structure

```
app/
├── components/
│   ├── timeline_component.rb
│   └── timeline_component.html.erb
├── controllers/
│   └── timelines_controller.rb
├── javascript/
│   └── controllers/
│       └── timeline_controller.js
├── models/
│   ├── timeline.rb
│   ├── event.rb
│   └── timeline_event.rb
└── views/
    └── timelines/
        ├── index.html.erb
        ├── show.html.erb
        └── new.html.erb
```
