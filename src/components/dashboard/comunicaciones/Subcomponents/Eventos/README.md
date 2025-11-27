# Event Management System

This document describes the newly created event management system for the EcoCircular platform.

## Structure Overview

The event management system has been implemented with a modular structure following the same pattern as the existing News component:

```
src/
├── api/
│   └── scheduleApi.js           # API functions for event operations
└── components/dashboard/comunicaciones/Subcomponents/Eventos/
    ├── index.jsx                # Main entry point
    ├── EventList.jsx            # Event listing and management
    ├── EventFormModal.jsx       # Create/edit event modal
    └── EventDetailModal.jsx     # View event details modal
```

## API Endpoints

The system integrates with the following endpoints:

- **POST** `/api/schedule` - Create new events
- **GET** `/api/schedule` - Retrieve events with pagination
- **GET** `/api/schedule/{id}` - Get specific event details
- **PUT** `/api/schedule/{id}` - Update existing events
- **DELETE** `/api/schedule/{id}` - Delete events
- **PATCH** `/api/schedule/{id}/publish` - Publish events
- **PATCH** `/api/schedule/{id}/unpublish` - Unpublish events

## Components

### EventList.jsx
- Main event management interface
- Displays events in a card-based grid layout
- Provides search and filtering capabilities (by category, status, type)
- Pagination support
- Actions: Create, Edit, View, Delete events

### EventFormModal.jsx
- Modal form for creating and editing events
- Supports both presencial and remote events
- Rich text editor for event descriptions (CKEditor)
- Date/time pickers with timezone support
- Location management (for presencial events)
- Meeting link management (for remote events)
- Registration settings with max attendees limit

### EventDetailModal.jsx
- Detailed view of individual events
- Shows all event information in an organized layout
- Status indicators (Active, Upcoming, Finished)
- Location or meeting link display
- Rich text description rendering

### API Module (scheduleApi.js)
- Centralized API functions for all event operations
- Error handling and response management
- Consistent with existing API patterns

## Event Data Structure

Events support the following fields:
- Basic info: title, description, category
- Scheduling: start_datetime, end_datetime, is_all_day, timezone
- Type: event_type (in_person/remote)
- Location: location_name, location_address, latitude, longitude
- Remote: meeting_link
- Registration: requires_registration, max_attendees
- Publishing: status (published/draft), published_at
- Timestamps: created_at, updated_at, deleted_at

## Integration

The system is integrated into the existing communications dashboard by:
1. Updating `Eventos.jsx` to use the new modular structure
2. Following the same patterns as the News component
3. Maintaining consistency with the overall application architecture

## Technical Notes

- The API client is imported as `api` from `./index` (not `apiClient`)
- The system follows the same axios instance pattern as `newsApi.js`
- All API calls use the same authentication and configuration as other components

## Usage

To access the event management:
1. Navigate to the Communications section in the dashboard
2. Select "Eventos" 
3. The new EventList interface will be displayed

## Features

- ✅ Complete CRUD operations for events
- ✅ Support for both presencial and remote events
- ✅ Rich text descriptions with CKEditor
- ✅ Advanced search and filtering
- ✅ Pagination for large datasets
- ✅ Responsive design
- ✅ Status management (draft/published)
- ✅ Registration management
- ✅ Timezone support
- ✅ Location coordinates
- ✅ Meeting links for remote events
- ✅ Event status indicators (Active, Upcoming, Finished)

The system is now ready to handle all event management requirements for the EcoCircular platform.