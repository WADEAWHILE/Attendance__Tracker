<?php
    $targetDirectory = "../data/";  // Change this to the desired directory path
    $targetFile = $targetDirectory . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 4;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    // Check if file already exists
    if (file_exists($targetFile)) {
        echo "Sorry, the file already exists. ";
        $uploadOk = 0;
    }

    // Check file size (you can adjust the limit as needed)
    if ($_FILES["fileToUpload"]["size"] > 5000000) {
        echo "Sorry, your file is too large. ";
        $uploadOk = 1;
    }

    // Allow only certain file formats (you can adjust the formats as needed)
    if ($imageFileType != "csv") {
        echo "Sorry, only CSV files are allowed. ";
        $uploadOk = 2;
    }

    if ($uploadOk == 0 || $uploadOk == 1 || $uploadOk == 2) {
        echo "Sorry, your file was not uploaded.";

        // Redirect back to index.php after 3 seconds
        echo '<meta http-equiv="refresh" content="3;url=../index.php">';
    } else {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFile)) {
            echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";

            // Redirect back to index.php after 3 seconds
            echo '<meta http-equiv="refresh" content="3;url=../index.php">';

        } else {
            echo "Sorry, there was an error uploading your file.";

            // Redirect back to index.php after 3 seconds
            echo '<meta http-equiv="refresh" content="3;url=../index.php">';
        }
    }
?>