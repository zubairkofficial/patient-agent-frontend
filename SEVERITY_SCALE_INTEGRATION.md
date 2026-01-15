# Severity Scale API Integration

## Overview
The severity scale API has been successfully integrated into the admin section of the patient-agent-frontend. This allows admins to create, read, update, and delete severity scales used for symptom assessment.

## Files Created/Modified

### 1. **Service Layer** - `src/services/SeverityScale/severity-scale.service.ts`
- **Purpose**: API service for severity scale management
- **Methods**:
  - `getAll()` - Fetches all severity scales
  - `getById(id)` - Fetches a single severity scale
  - `create(createData)` - Creates a new severity scale
  - `update(id, updateData)` - Updates an existing severity scale
  - `delete(id)` - Deletes a severity scale
- **Features**:
  - Axios HTTP client with JWT token authentication
  - Error handling with descriptive messages
  - Singleton instance export for easy imports

### 2. **Admin Component** - `src/pages/Admin/SeverityScale/SeverityScale.tsx`
- **Purpose**: Full-featured admin interface for managing severity scales
- **Features**:
  - List all severity scales with search functionality
  - Create new severity scales with validation
  - Edit existing severity scales
  - Delete severity scales with confirmation
  - Manage multiple severity levels per scale
  - Color picker for severity levels
  - Loading states and error handling
  - Form validation
  - Toast notifications for user feedback

### 3. **Types** - Already existed in `src/types/SeverityScale.types.ts`
- `SeverityScale` - Main entity interface
- `SeverityLevel` - Individual severity level interface
- `SeverityScaleFormData` - Form input interface

### 4. **Routing** - Updated `src/App.tsx`
- Route: `/admin/severity-scale`
- Component: `SeverityScaleAdmin`
- Already configured in the admin layout with sidebar navigation

## API Endpoints

The service communicates with the following NestJS backend endpoints:

```
GET    /severity-scales          - Fetch all severity scales
GET    /severity-scales/:id      - Fetch single severity scale
POST   /severity-scales          - Create new severity scale
PATCH  /severity-scales/:id      - Update severity scale
DELETE /severity-scales/:id      - Delete severity scale
```

## Usage

### Importing the Service
```typescript
import { severityScaleService } from "@/services/SeverityScale/severity-scale.service";

// Fetch all scales
const scales = await severityScaleService.getAll();

// Create a new scale
const newScale = await severityScaleService.create({
  name: "Pain Scale",
  description: "Measure patient pain levels",
  levels: [
    { level: 1, label: "Mild", description: "Slight discomfort", color: "#22c55e" }
  ]
});
```

## Component Features

### Admin Interface
1. **Header Section**
   - Title and description
   - "Create Severity Scale" button

2. **Search Bar**
   - Search by name or description

3. **Severity Scales Grid/List**
   - Display all scales with levels preview
   - Edit and Delete buttons
   - Color-coded severity levels
   - Metadata (creation/update dates)

4. **Form Modal**
   - Create new or edit existing scales
   - Dynamic level management
   - Color selection with color picker and hex input
   - Form validation
   - Loading states

## Key Features

- ✅ Full CRUD operations
- ✅ Real-time data sync with backend
- ✅ Form validation with error messages
- ✅ Loading and submitting states
- ✅ Toast notifications
- ✅ Search/filter functionality
- ✅ Color customization for severity levels
- ✅ Confirmation dialogs for destructive actions
- ✅ JWT token authentication
- ✅ Error handling and user feedback

## Integration Points

1. **Sidebar Navigation** - Already configured to `/admin/severity-scale`
2. **Admin Layout** - Inherits from AdminLayout component
3. **Authentication** - Uses stored JWT token from localStorage
4. **UI Components** - Uses existing Button and Input components

## Notes

- All API calls include JWT authentication headers
- Errors are caught and displayed as toast notifications
- Loading states prevent user interactions during API calls
- Form validation ensures data integrity before submission
- Color values are stored in hex format (#RRGGBB)
