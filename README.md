# Campus Lost & Found Tracker

A simple full-stack CRUD web application where students can report lost items,
mark items as found, and update items to "Claimed" once returned.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (fetch API)
- **Backend:** Django + Django REST Framework
- **Database:** SQLite

## Project Structure
```
lost_found_tracker/
├── backend/
│   ├── manage.py
│   ├── lost_found/        (project settings, urls)
│   ├── items/              (the app: models, views, serializers, urls)
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## How to Run It

### 1. Set up the backend
Open a terminal in the `backend` folder and run:

```bash
# Create a virtual environment (recommended)
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt

# Set up the database (creates tables from the migration file already included)
python manage.py migrate

# (Optional) create an admin login to view data at /admin/
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

Your backend API is now running at: `http://127.0.0.1:8000/api/items/`

### 2. Open the frontend
In a **new** terminal, go to the `frontend` folder and run a simple local server
(opening index.html directly by double-clicking can cause issues with the API calls):

```bash
python -m http.server 5500
```

Then open your browser to: `http://127.0.0.1:5500`

You should now see the Lost & Found page. Try adding, editing, searching, and deleting items.

## API Endpoints
| Method | Endpoint              | Description             |
|--------|-----------------------|--------------------------|
| GET    | /api/items/            | List all items           |
| POST   | /api/items/            | Create a new item         |
| GET    | /api/items/{id}/       | Get one item              |
| PUT    | /api/items/{id}/       | Update an item            |
| DELETE | /api/items/{id}/       | Delete an item             |

You can add `?search=keyword` or `?status=Lost` to the list endpoint to filter results.

## Testing with Postman
1. Start the backend server.
2. Send a GET request to `http://127.0.0.1:8000/api/items/` to see the list.
3. Send a POST request with a JSON body like:
```json
{
  "item_name": "Blue Water Bottle",
  "description": "Has a sticker on it",
  "category": "Other",
  "location": "Library",
  "status": "Found",
  "contact_info": "9999999999"
}
```
4. Try PUT and DELETE with an existing item's id.

## Notes for the Project Report
- **Entity:** Item (a lost/found report)
- **Fields:** item_name, description, category, location, status, contact_info, date_reported
- **Validation:** item_name and contact_info cannot be empty (checked in the serializer)
- **Search/Filter:** by keyword and by status
- **Database:** SQLite file (db.sqlite3) is created automatically after running migrate
