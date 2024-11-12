Here's a simplified `README.md` file:

```markdown
# TechSolution API Server

A simple API server using Node.js, Express, and MongoDB for managing services, bookings, client emails, and custom requests.

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with:
   ```plaintext
   DB_USER=<your-mongodb-username>
   DB_PASS=<your-mongodb-password>
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## API Endpoints

### Services
- `GET /api/v1/services` - Get all services
- `GET /api/v1/services/:id` - Get a service by ID

### Bookings
- `GET /api/v1/all-booking` - Get all bookings
- `GET /api/v1/booking?email=<email>` - Get bookings by email
- `POST /api/v1/booking` - Add a new booking
- `DELETE /api/v1/booking/:id` - Delete a booking by ID

### Contact Emails
- `GET /api/v1/contactEmail` - Get all contact emails
- `POST /api/v1/contactEmail` - Add a new contact email

### Custom Requests
- `GET /api/v1/custom-requests` - Get all custom requests
- `POST /api/v1/custom-requests` - Add a new custom request

### Server Status
- `GET /` - Check if the server is running

## License
This project is open source under the MIT License.
```

This version is more straightforward and highlights the main points directly. Let me know if you'd like further adjustments!