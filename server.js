const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer"); // Import multer for handling file uploads
const EmployeeModel = require("./models/register");
const DepModel = require("./models/adddepartment");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://vaibhavi:root@myofficeweb.2swe34j.mongodb.net/");

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Upload files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  },
});

const upload = multer({ storage });

// Handle registration with image upload
app.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const imageUrl = req.file ? req.file.path : ""; // Get the uploaded image path

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(1)
    const user = await EmployeeModel.create({
      username,
      email,
      password: hashedPassword,
      role,
      image: imageUrl, // Save the image path in the database
    });
    res.json(user);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find the user by email in the database
    const user = await EmployeeModel.findOne({ email });

    console.log(user)
    // If no user found, return an error
    if (!user) {
      return res.status(404).json({ message: false });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log(passwordMatch)
    if (!passwordMatch) {
      console.log(2)
      return res.status(401).json({ message: "Incorrect password" });
    }


    return res.json({ message: true, data: user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/employees", async (req, res) => {
  try {
    // Fetch all employees from the database
    const employees = await EmployeeModel.find();
    res.json(employees); // Send the employees data as JSON response
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Send an error response if something goes wrong
  }

});


app.post("/adddepartment", async (req, res) => {
  try {
    const { department } = req.body;

    // Check if department name is empty or null
    if (!department) {
      return res.status(400).json({ message: "Department name cannot be empty" });
    }

    // Convert department name to uppercase for consistency
    const dept = department.toUpperCase();

    // Check if the department already exists
    const existingDepartment = await DepModel.findOne({ department: dept });
    if (existingDepartment) {
      return res.json({ message: "Department already exists" });
    }
    
    // Create a new department
    const newDepartment = await DepModel.create({ department: dept });

    res.status(201).json({ message: "Department added successfully", department: newDepartment });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/departments", async (req, res) => {
  try {
    // Fetch department names from the departments collection
    const departments = await DepModel.find({}, { department: 1, _id: 0 }); // Only fetch the 'department' field and exclude '_id'

    // Extract department names from the fetched data
    const departmentNames = departments.map(department => department.department);
    console.log(departmentNames)
    res.json(departmentNames); // Send the list of department names in the response
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Update employee's department
app.put("/employees/:id", async (req, res) => {
  try {
    console.log("in put")
    const { id } = req.params;
    const { department } = req.body;

    // Find the employee by ID and update the department
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id,
      { department },
      { new: true } // Return the updated employee data
    );

    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee department:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
