<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance Tracker</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="attendance-container">
        <h1>Attendance</h1>
        <p>for</p>
        
        <label for="attendance__name"></label>
        <input type="text" id="attendance__name" title="attendance__name" placeholder="enter your event name" oninput="checkInput()">

        <a href="template/attendance__template.csv" id="template">Download Template</a>

        <form id="uploadForm" action="processing/upload.php" method="POST" enctype="multipart/form-data">
            <input type="file" id="fileToUpload"  title="fileToUpload" name="fileToUpload" >
            <input type="submit" value="Upload File" name="submit">
        </form>
        
        <label for="data__list">Choose your attendance list:</label>
        <select id="data__list" onchange="load__Data__List(this.value);">
            <option value="select">Select</option>
            <?php
                $dataFolder = "data/";  // Change this to the path of your data folder
                $files = scandir($dataFolder);
                
                foreach ($files as $file) {
                    if (is_file($dataFolder . $file)) {
                        echo '<option value="' . $file . '">' . $file . '</option>';
                    }
                }
            ?>
            <option value="manual">Manual</option>
        </select>
        
        <ul id="attendee-list">

        </ul>
        
        <button type="submit" id="submit-button">Download Attendance</button>

        <div id="developer">&copy; 2023 WADEAWHILE</div>
    </div>
    <script src="js/script.js"></script>
</body>
</html>
