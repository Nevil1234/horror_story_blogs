<?php
// Start the session
session_start();

// Database connection details
$host = 'localhost:3306';    // Database host
$dbname = 'ghostly_tales'; // Your database name
$db_username = 'root';     // Database username
$db_password = '';         // Database password (use your own credentials)

// Create a new database connection
$conn = new mysqli($host, $db_username, $db_password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare a SQL statement to prevent SQL injection
    $stmt = $conn->prepare('SELECT password FROM users WHERE username = ?');
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->store_result();

    // Check if the user exists
    if ($stmt->num_rows > 0) {
        // Bind the result
        $stmt->bind_result($hashed_password);
        $stmt->fetch();

        // Verify the password
        if (password_verify($password, $hashed_password)) {
            // Password is correct, set session and redirect to posts.html
            $_SESSION['username'] = $username; // Storing the logged-in user's username in the session
            header('Location: posts.html');
            exit; // Stop further execution after redirection
        } else {
            // Incorrect password
            echo "<script>alert('Incorrect password. Please try again.'); window.location.href = 'login.html';</script>";
        }
    } else {
        // Username does not exist
        echo "<script>alert('Username does not exist.'); window.location.href = 'login.html';</script>";
    }

    // Close the statement
    $stmt->close();
}

// Close the database connection
$conn->close();
?>
