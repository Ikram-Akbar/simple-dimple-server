
# SimpleDimple API Server

This is an Express server that connects to a MongoDB database to manage services, bookings, client emails, and custom requests for TechSolution. The server provides a REST API for interacting with these collections.

## Technologies Used

- Node.js - JavaScript runtime for server-side programming.
- Express.js - Web framework for handling routes and middleware.
- MongoDB - NoSQL database for storing collections.
- dotenv - For managing environment variables.
- CORS - Middleware to allow cross-origin requests.

## Installation

1. Clone the Repository :` https://github.com/Ikram-Akbar/simple-dimple-server`
2. Install dependencies:

   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```plaintext
   DB_USER=<your-mongodb-username>
   DB_PASS=<your-mongodb-password>
   PORT=5000
   ```
4. Start the server:

   ```bash
   npm start
   ```

### API Endpoint

---



##### 1. Service Endpoints

- **GET /api/v1/services**Returns all services.
- **GET /api/v1/services/:id**
  Returns a specific service by its ID.

##### 2. Booking Endpoints

- **GET /api/v1/all-booking**Returns all bookings.
- **GET /api/v1/booking**Returns bookings filtered by email (query parameter `email`).
- **POST /api/v1/booking**Adds a new booking. Accepts JSON data in the request body.
- **DELETE /api/v1/booking/:id**
  Deletes a booking by ID.

##### 3. Contact Email Endpoints

- **GET /api/v1/contactEmail**Returns all client emails submitted via the contact form.
- **POST /api/v1/contactEmail**
  Adds a new email submission from the contact form.

##### 4. Custom Request Endpoints

- **GET /api/v1/custom-requests**Returns all custom service requests submitted by clients.
- **POST /api/v1/custom-requests**
  Adds a new custom service request. Accepts JSON data in the request body.

##### Basic Route for Server Health Check

- **GET /**
  Returns a message confirming that the server is running.

#### Database Structure

- **services** - Contains documents for various services offered by TechSolution.
- **booking** - Stores booking details for users.
- **clientsEmail** - Holds email submissions from clients.
- **customRequest** - Contains custom requests made by clients for specific services.

#### Error Handling

The server includes basic error handling for all routes, sending appropriate status codes and error messages if an operation fails.

#### Development

To run the server locally:

1. Clone this repository.
2. Configure the `.env` file as described.
3. Run `npm start` and access the server at `http://localhost:5000`.

#### License

This project is open source and available under the MIT License.
