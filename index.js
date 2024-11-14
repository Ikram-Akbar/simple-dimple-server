require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const app = express();

/****
 *******************
    Middlewares :
 *******************
***/
app.use(cors({
  //check here any problem ? 

  origin: ['http://localhost:5173','http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

/****
 ************************
   Database Connection :
 ************************
****/

const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.1pple.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const servicesCollection = client.db("TechSolution").collection("services");
    const bookingCollection = client.db("TechSolution").collection("booking");
    const clientsEmailCollection = client.db("TechSolution").collection("clientsEmail");
    const customRequestCollection = client.db("TechSolution").collection("customRequest");

    const verifyJwt = (req, res, next) => {
      const jwToken = req.cookies.token; // Access the token from the specific cookie key
      console.log(jwToken);

      if (!jwToken) {
        return res.status(401).json({ message: 'Access denied, token missing!' });
      }

      // Verify the token
      jwt.verify(jwToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid token!' });
        }

        req.user = decoded;
        next();
      });
    };


    //Authentication : 
    app.post("/api/v1/jwt", async (req, res) => {
      try {
        const data = req.body;
        console.log(data);
        const token = jwt.sign(data, process.env.JWT_SECRET || "defaultSecret", { expiresIn: '1h' });

        res
          .cookie("token", token, {
            httpOnly: true,
            secure:false,
            sameSite:"none",
          })
          .send({ success: true });
        
      } catch (error) {
        console.error("Error creating token:", error);
        res.status(500).send({ error: "Failed to create token" });
      }
    });

   /*  // Filter services based on query parameters
    app.get("/api/v1/services/filter", async (req, res) => {
      try {
        const { category, minPrice, maxPrice, rating } = req.query;

        // Initialize an empty query object
        let query = {};

        // Conditionally add filters to the query object based on provided parameters
        if (category) {
          query.category = category;
        }

        if (minPrice || maxPrice) {
          query.price = {};
          if (minPrice) query.price.$gte = parseFloat(minPrice);
          if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (rating) {
          query.rating = { $gte: parseFloat(rating) };  // Assuming rating is a numeric field
        }

        // Fetch filtered services
        const filteredServices = await servicesCollection.find(query).toArray();

        res.status(200).json(filteredServices);
      } catch (error) {
        console.error("Error fetching filtered services:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }); */




    app.get("/api/v1/services", async (req, res) => {
      try {
        const result = await servicesCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).send({ message: "Failed to fetch services" });
      }
    });

    app.get("/api/v1/services/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await servicesCollection.findOne(query);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Service not found" });
        }
      } catch (err) {
        console.error("Error: ", err);
        res.status(500).send({ message: "Failed to fetch service" });
      }
    });

    app.get("/api/v1/all-booking", async (req, res) => {
      try {
        const bookings = await bookingCollection.find().toArray();
        res.status(200).json(bookings);
      } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
      }
    });

    
     app.get("/api/v1/booking",async (req, res) => {
      try {
        let query = {};
        if (req.query.email) {
          query = { email: req.query.email };
        }
        
        const result = await bookingCollection.find(query).toArray();
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }); 
    
    
    /* // Secure the booking route to allow access only to the logged-in user's data
    app.get("/api/v1/booking", verifyJwt, async (req, res) => {
      try {
        // Ensure that the email in the query matches the email in the token
        const queryEmail = req.query.email;
        const userEmail = req.user.email;

        if (queryEmail && queryEmail !== userEmail) {
          return res.status(403).json({ message: "Access denied!" });
        }

        // Query for the logged-in user's data only
        const query = { email: userEmail };
        const result = await bookingCollection.find(query).toArray();
        res.status(200).json(result);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }); */


    app.post("/api/v1/booking", async (req, res) => {
      try {
        const data = req.body;
        const result = await bookingCollection.insertOne(data);
        res.status(200).send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
      }
    });

    app.delete("/api/v1/booking/:id", async (req, res) => {
      try {
        const bookingId = req.params.id;
        const result = await bookingCollection.deleteOne({
          _id: new ObjectId(bookingId),
        });

        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Booking deleted successfully" });
        } else {
          res.status(404).json({ message: "Booking not found" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });


    // Contact-Us:

    app.get("/api/v1/contactEmail", async (req, res) => {
      try {
        const result = await clientsEmailCollection.find().toArray();
        res.send(result);
      } catch (err) {
        console.log("Error fetching contact emails:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });


    app.post("/api/v1/contactEmail", async (req, res) => {
      // console.log("Received contact form data:", req.body);
      try {
        const data = req.body;
        const result = await clientsEmailCollection.insertOne(data);
        res.status(200).json(result);
      } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Server error");
      }
    });


    //custom Request from Clients :

    // Get all custom requests
    app.get("/api/v1/custom-requests", async (req, res) => {
      try {
        const result = await customRequestCollection.find().toArray();
        res.status(200).json(result);
      } catch (err) {
        console.error("Error fetching custom requests:", err);
        res.status(500).send({ message: "Failed to fetch custom requests" });
      }
    });

    // Add a new custom request
    app.post("/api/v1/custom-requests", async (req, res) => {
      console.log(" post :- ", req.body);
      try {
        const data = req.body;
        const result = await customRequestCollection.insertOne(data);
        res.status(201).json(result);
      } catch (err) {
        console.error("Error adding custom request:", err);
        res.status(500).send("Server error");
      }
    });




    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Uncomment this line if you want the client to close after operations
    // await client.close();
  }
}

run().catch(console.dir);

/**
 ***************
  Basic Route For Server Connection :
 ***************
*/

app.get("/", (req, res) => {
  res.status(200).send({ message: "Server is Running ", isActive: true });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
