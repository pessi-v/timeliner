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
- **TimelineEvent**: Join table for many-to-many relationship (allows events to belong to multiple timelines)

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
- Smooth zoom and pan with unified viewport

✅ **Interactive Controls:**
- Zoom in/out buttons (changes time range, not visual scale)
- Mouse wheel zoom
- Click-and-drag panning (everything moves together)
- Event details modal
- Dynamic time axis with appropriate tick marks

✅ **Timeline Merging:**
- Combine 2 or more timelines into a new merged timeline
- All events from selected timelines are included
- Original timelines remain unchanged
- Duplicate events appear only once
- Customizable name, description, and color for merged timeline

✅ **Visual Enhancements:**
- Color-coded events
- Automatic label positioning
- Responsive to different time scales
- Dynamic scale indicator (minutes/hours/days/months/years/decades)
- Dynamic time axis labels based on zoom level

## Sample Timelines

The seed data creates four example timelines:

1. **World War II** - Demonstrates year/month granularity over a 6-year span
2. **September 11, 2001** - Demonstrates hour/minute granularity within a single day
3. **The Sassanid Empire** - Demonstrates ancient dates and multi-century spans
4. **Modern Tech Era** - Demonstrates ongoing events extending into the future

## Key Features Explained

### Zoom & Pan Semantics
- **Zoom In** = Narrower time range with more granularity (e.g., from years to months)
- **Zoom Out** = Wider time range with less granularity (e.g., from days to years)
- **Pan** = Slide the time window left or right
- All elements (axis, events, labels) move together as a unified viewport

### Dynamic Time Axis
The time axis automatically adjusts tick marks and labels based on the visible time range:
- **< 1 hour**: 5-minute intervals
- **< 1 day**: 1-hour intervals
- **< 1 week**: 6-hour intervals
- **< 30 days**: Daily intervals
- **< 1 year**: Monthly intervals
- **< 10 years**: Yearly intervals
- **10+ years**: Decade intervals

### Merging Timelines
The merge feature allows you to:
1. Select 2 or more existing timelines
2. Create a new timeline that includes all events from selected timelines
3. Optionally customize the merged timeline's name, description, and color
4. View all events together on a single unified timeline

**How it works:**
- Uses the many-to-many relationship (TimelineEvent join table)
- Events can belong to multiple timelines
- Merging doesn't duplicate events - they're shared
- Original timelines are preserved

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
- SVG for timeline visualization (rendered dynamically via Stimulus)
- DOM for modals and interactive elements
- Stimulus for JavaScript behavior
- Tailwind for styling
- All rendering happens client-side based on data passed from Rails

### Viewport-Based Rendering
- Timeline tracks a viewport in time-space (`viewStart` to `viewEnd` timestamps)
- All positions calculated relative to current viewport
- Zoom changes the viewport width (time range)
- Pan shifts the viewport position
- Everything re-renders on viewport changes

## Next Steps

To make this production-ready:

1. **Add CRUD for Events**: Controller and forms to create/edit events
2. **Advanced Event Management**: Bulk edit, delete, and organize events
3. **Filtering & Search**: Filter events by type, date range, keywords, or tags
4. **Export**: Export timelines as images, PDFs, or JSON
5. **Permissions**: User authentication and timeline sharing
6. **Event Categories/Tags**: Organize events with categories
7. **Virtualization**: For timelines with thousands of events
8. **Responsive Design**: Mobile-friendly version with touch gestures
9. **Undo/Redo**: Timeline editing history
10. **Smart Zoom Levels**: Pre-defined zoom presets for common ranges
11. **Event Dependencies**: Link related events together
12. **Templates**: Pre-built timeline templates for common use cases

## Code Structure

```
app/
├── components/
│   ├── timeline_component.rb
│   └── timeline_component.html.erb
├── controllers/
│   └── timelines_controller.rb
│       ├── index (list all timelines)
│       ├── show (view timeline)
│       ├── new/create (create timeline)
│       ├── merge_form (select timelines to merge)
│       └── merge (perform merge)
├── javascript/
│   └── controllers/
│       └── timeline_controller.js (SVG rendering & interaction)
├── models/
│   ├── timeline.rb
│   ├── event.rb
│   └── timeline_event.rb
└── views/
    └── timelines/
        ├── index.html.erb
        ├── show.html.erb
        ├── new.html.erb
        └── merge_form.html.erb
```

## Usage Examples

### Viewing a Timeline
Navigate to any timeline to see all its events rendered on an interactive SVG canvas. Use zoom controls or mouse wheel to change granularity, click and drag to pan.

### Merging Timelines
1. Click "Merge Timelines" from the main timeline list
2. Select 2 or more timelines (e.g., "World War II" + "Modern Tech Era")
3. Optionally customize the merged timeline's details
4. Click "Merge Timelines" to create the combined view
5. The new timeline shows events from all selected timelines on a unified axis

### Example Merge Use Cases
- Combine "September 11, 2001" with other terrorist attack timelines
- Merge multiple war timelines to see historical conflicts together
- Combine personal project timelines to see full portfolio timeline
- Merge company milestone timelines from different departments
