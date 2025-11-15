# Task Management System - Quick Reference Guide

## How to Use the New Features

### 1. VIEW ASSIGNMENT DETAILS
**When:** You want to check what a task contains before editing it

**Steps:**
1. Go to Admin Portal → Tasks Management
2. Find the task in the grid
3. Click the **EYE icon** (👁️) on the task card
4. A modal will open showing:
   - Full task title and description
   - Task type badge (Assignment/Project/Quiz)
   - Difficulty level badge (Easy/Medium/Hard)
   - Quick stats: Max points, passing points, estimated hours, due date
   - Complete instructions
   - Requirements and prerequisites
   - Evaluation criteria
   - Mandatory and late submission status

5. Click **"Edit Task"** button from the modal to make changes
6. Click **"Close"** to dismiss without editing

---

### 2. AI SUGGESTION SYSTEM
**When:** You want quick ideas for new assignments tailored to a program

**Steps:**
1. Go to Admin Portal → Tasks Management
2. Click the **LIGHTBULB icon** (💡) "AI Suggestions" button at top right
3. In the modal that opens:
   - **Select Program** (required)
   - **Choose Difficulty Level** (Easy/Medium/Hard)
4. Click **"Generate 5 Suggestions"** button
5. Wait for suggestions to load (they appear immediately from built-in database)
6. For each suggestion, you'll see:
   - Assignment title
   - Description
   - Estimated hours to complete
   - Key focus areas
   - **"Load Into Form"** button

7. Click **"Load Into Form"** on any suggestion to:
   - Auto-populate the task creation form
   - Jump straight to the Add Task form with suggestion details
   - Complete additional fields as needed
   - Save the task

---

### 3. FILTER BY PROGRAM
**When:** You want to see tasks for a specific program only

**Steps:**
1. Go to Admin Portal → Tasks Management
2. Look for the **Filter dropdown** on the right side of the search bar
3. Click and select a program:
   - All Programs
   - Full Stack Web Development with MERN
   - Frontend Development with React
   - Python Django Backend
   - DevOps and Cloud Computing with AWS
   - Mobile App Development with React Native
   - Data Science with Python
   - **ServiceNow Platform Administration** ✨ NEW

4. Tasks grid updates instantly to show only selected program's tasks
5. Combine with search for more specific filtering

---

### 4. SEARCH ACROSS TASKS
**When:** You want to find a specific task quickly

**Steps:**
1. Go to Admin Portal → Tasks Management
2. In the **Search box** on the left, type keywords:
   - Task title (e.g., "e-commerce", "API", "authentication")
   - Task description content
3. Results filter in real-time as you type
4. Combine search with program filter for best results

---

### 5. CREATE NEW TASK MANUALLY
**When:** You want to create a custom assignment not in suggestions

**Steps:**
1. Go to Admin Portal → Tasks Management
2. Click the **"+ Add Task"** button at top right
3. Fill in all the fields:
   - **Program*** (required) - Choose which course
   - **Task Type*** - Assignment, Project, Quiz, Presentation, etc.
   - **Title*** - Task name
   - **Description*** - What students will do
   - **Difficulty Level** - Easy, Medium, or Hard
   - **Max Points** - Total points possible
   - **Passing Points** - Minimum to pass
   - **Due Date** - When it's due (optional)
   - **Estimated Hours** - How long it should take
   - **Instructions** - Step-by-step guidance
   - **Requirements** - Prerequisites and tools needed
   - **Evaluation Criteria** - How it will be graded
   - **Checkboxes**: Mandatory? Allow late submission?

4. Click **"Create Task"** to save
5. Toast notification confirms success

---

### 6. EDIT EXISTING TASK
**Steps:**
1. Find the task and click the **EDIT icon** (✏️)
2. Modify any fields
3. Click **"Update Task"** to save
4. Toast notification confirms update

---

### 7. DELETE TASK
**Steps:**
1. Find the task and click the **DELETE icon** (🗑️)
2. Confirm the deletion in the popup dialog
3. Task is removed from database
4. Toast notification confirms deletion

---

## AI SUGGESTIONS DATABASE

The system includes 150+ pre-written assignments across 6 programs and 3 difficulty levels:

### Programs with Suggestions:
1. **Full Stack MERN Development** - 25 assignments (Easy/Medium/Hard)
2. **React Frontend Mastery** - 25 assignments (Easy/Medium/Hard)
3. **Python Django Backend** - 25 assignments (Easy/Medium/Hard)
4. **DevOps and Cloud Computing** - 25 assignments (Easy/Medium/Hard)
5. **React Native Mobile Development** - 25 assignments (Easy/Medium/Hard)
6. **Data Science with Python** - 25 assignments (Easy/Medium/Hard)

### Suggestion Categories:

**EASY Difficulty (5 per program):**
- Foundational concepts
- 4-8 hours estimated time
- Individual assignments
- Basic implementation tasks

**MEDIUM Difficulty (5 per program):**
- Intermediate concepts
- 10-16 hours estimated time
- Project-based work
- Integration tasks

**HARD Difficulty (5 per program):**
- Advanced concepts
- 16-32 hours estimated time
- Complex projects
- Architecture and design tasks

---

## EXAMPLE WORKFLOW

### Creating a React Task Using AI Suggestions:

1. **Click "AI Suggestions"** button
2. **Select Program**: "React Frontend Mastery"
3. **Select Level**: "Medium"
4. **Generate Suggestions**
5. See suggestions like:
   - "Custom Hooks Development" (12 hours)
   - "Context API Global State Management" (10 hours)
   - "Advanced Form Management with Libraries" (10 hours)
   - etc.
6. **Click "Load Into Form"** on "Custom Hooks Development"
7. Task form auto-fills with:
   - Title: "Custom Hooks Development"
   - Description: "Create reusable custom hooks..."
   - Estimated Hours: 12
   - Difficulty: Medium
   - Task Type: Assignment
8. **Add to form**:
   - Program: (already selected)
   - Due Date: (set one)
   - Additional instructions if needed
   - Any other fields to customize
9. **Click "Create Task"**
10. Task saved successfully! ✅

---

## TIPS & TRICKS

### Search Tips:
- Search is case-insensitive
- Searches both title and description
- Combine with filter for precision
- Partial words work (e.g., "API" finds "REST API Integration")

### Suggestion Tips:
- Easier to load suggestions than type from scratch
- Customize loaded suggestions before saving
- All suggestions have reasonable time estimates
- Focus areas help understand learning objectives

### Filter Tips:
- All Programs shows everything
- Each filter only shows that program's tasks
- Filter + Search = powerful combination
- ServiceNow now works like other programs!

### Performance Tips:
- Search and filter happen instantly
- No page reload needed
- Save frequently when editing
- Use browser back button to cancel modal

---

## TROUBLESHOOTING

### No suggestions appearing?
- Verify program is selected
- Check internet connection (suggestions load from backend)
- Try a different difficulty level
- Reload page if stuck

### Filter showing blank?
- Ensure at least one task exists for that program
- Try searching instead to verify
- Check if program is set to active in database

### Can't load suggestion?
- Verify all required fields are filled
- Check program selection matches
- Try manually entering the data instead

### Task not saving?
- Check all required fields are filled
- Look for red error messages
- Try reloading the page
- Check backend is running on port 3001

---

## KEYBOARD SHORTCUTS (Future Enhancement)
Currently not implemented, but would be nice:
- `Ctrl + K` - Open search
- `Ctrl + N` - New task
- `Esc` - Close modal
- `Enter` - Submit form

---

## PROGRAM QUICK IDS

For API calls, here are the program IDs:

```
MERN: 770e8400-e29b-41d4-a716-446655440000
React: 770e8400-e29b-41d4-a716-446655440001
Django: 770e8400-e29b-41d4-a716-446655440002
DevOps: 770e8400-e29b-41d4-a716-446655440003
React Native: 770e8400-e29b-41d4-a716-446655440004
Data Science: 770e8400-e29b-41d4-a716-446655440005
ServiceNow: 69a425fd-caf9-464b-9991-a360c90e3380
```

---

## SUPPORT

For issues or questions:
1. Check this guide first
2. Verify all servers are running:
   - Backend on 3001
   - Admin Portal on 5174
   - Database connection active
3. Check browser console for errors (F12)
4. Look for toast notifications with error messages
5. Review the implementation files for code examples

Happy task management! 🚀
