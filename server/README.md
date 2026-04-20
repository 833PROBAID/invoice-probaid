# 833PROBAID Invoice API

Simple Node.js Express API with MongoDB for managing invoices.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update MongoDB connection string if needed

3. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running locally, or use MongoDB Atlas
   ```

4. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

Base URL: `https://invoice.833probate.com/api`

### Invoices

- **GET** `/invoices` - Get all invoices with pagination and filtering
  - Query params:
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 10)
    - `search` - Search in invoiceNumber, billingContact, companyName, email
    - `startDate` - Filter by start date
    - `endDate` - Filter by end date
    
- **GET** `/invoices/suggestions/:field` - Get autocomplete suggestions
  - Params:
    - `field` - Field name (billingContact, companyName, email, etc.)
  - Query params:
    - `query` - Search query for filtering suggestions

- **GET** `/invoices/:id` - Get single invoice by ID
- **POST** `/invoices` - Create new invoice
- **PUT** `/invoices/:id` - Update invoice
- **DELETE** `/invoices/:id` - Delete invoice

### Health Check

- **GET** `/health` - Check if server is running

## Example Usage

### Create Invoice
```bash
curl -X POST https://invoice.833probate.com/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-19",
    "invoiceNumber": "INV-2024-001",
    "billingContact": "John Smith, Executor",
    "companyName": "Smith Family Trust",
    "serviceFee": "2500.00",
    "totalDue": "2500.00"
  }'
```

### Get All Invoices
```bash
curl https://invoice.833probate.com/api/invoices
```

### Get Invoices with Pagination
```bash
curl "https://invoice.833probate.com/api/invoices?page=1&limit=10"
```

### Search Invoices
```bash
curl "https://invoice.833probate.com/api/invoices?search=Smith"
```

### Filter by Date Range
```bash
curl "https://invoice.833probate.com/api/invoices?startDate=2024-01-01&endDate=2024-12-31"
```

### Get Suggestions for Autocomplete
```bash
# Get all suggestions for a field
curl https://invoice.833probate.com/api/invoices/suggestions/companyName

# Get filtered suggestions
curl "https://invoice.833probate.com/api/invoices/suggestions/companyName?query=Smith"
```

### Update Invoice
```bash
curl -X PUT https://invoice.833probate.com/api/invoices/{id} \
  -H "Content-Type: application/json" \
  -d '{"totalDue": "3000.00"}'
```

### Delete Invoice
```bash
curl -X DELETE https://invoice.833probate.com/api/invoices/{id}
```
