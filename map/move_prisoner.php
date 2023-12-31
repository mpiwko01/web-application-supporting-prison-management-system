<?php

session_start();

include '../general_php/conditions.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (isset($_POST['search1']) && !empty($_POST['search1']) && isset($_POST['date1']) && !empty($_POST['date1'])) {

        $searchValue = $_POST['search1'];
        $selectedDate = $_POST['date1'];
        $selectedCell = $_POST['cell1'];
        $_SESSION['selectedCell'] = $selectedCell;

        $searchValueParts = explode(', ', $searchValue);
        $name = $searchValueParts[0]; 

        $prisoner_id = $searchValueParts[1]; 

        $dbconn = mysqli_connect("mysql.agh.edu.pl:3306", "anetabru", "Aneta30112001", "anetabru");

        $count = prisonerCount($dbconn, $prisoner_id, $selectedCell, $selectedDate);
        $sex = prisonerSex($dbconn, $prisoner_id, $selectedCell, $selectedDate);

        $suggestion = false;

        if ($count == 2 || $sex == 1 || $sex == 2 || !prisonerAge($dbconn, $prisoner_id, $selectedCell, $selectedDate) || !crimeSeverity($dbconn, $prisoner_id, $selectedCell, $selectedDate) || !FloorCheckSex($dbconn, $prisoner_id,$selectedCell) || !FloorCheckReoffender($dbconn, $prisoner_id,$selectedCell) || !correctDate($dbconn, $prisoner_id, $selectedCell, $selectedDate)) {
            echo "Więzień $name nie może zostać przeniesiony do celi nr $selectedCell, ponieważ:<br><br>";
            $suggestion = true;
        }
        
        if ($count == 2) echo "- osiągnięto w niej limit miejsc<br>";
        

        if (!FloorCheckReoffender($dbconn, $prisoner_id,$selectedCell)) {
            $reoffender = whichFloorReoffender($dbconn, $prisoner_id, $selectedCell);
            if ($reoffender == 2) echo "- wybrane piętro przeznaczone jest dla recydywistów<br>";
            else if ($reoffender == 1) echo "- wybrane piętro nie jest przeznaczone dla recydywistów<br>";
        }
    
        if (!prisonerAge($dbconn, $prisoner_id, $selectedCell, $selectedDate)) echo "- wiek więźnia jest niezgodny z wiekiem osadzonych w wybranej celi<br>";  
       
        if (!presentCell($dbconn, $prisoner_id, $selectedCell)) echo "Więzień już znajduje się w podanej celi.<br>";

        if (!crimeSeverity($dbconn, $prisoner_id, $selectedCell, $selectedDate)) echo "- więzień ma inną wagę przestępstwa niż osadzeni w wybranej celi<br>";

        if (!FloorCheckSex($dbconn, $prisoner_id,$selectedCell)) echo "- wybrane piętro nie jest przeznaczone dla danej płci<br>";

        if (!correctDate($dbconn, $prisoner_id, $selectedCell, $selectedDate)) echo "- wybrana data jest nieprawidłowa<br><br>";

        if ($suggestion) {
            $availableCells = suggestion($dbconn, $prisoner_id, $selectedDate);
            echo "<br><br>Dostępne cele: ";
            echo implode(", ", $availableCells);
        }

        //gdy wszytsko dobrze
        if ($count != 2 && $sex == 0 && prisonerAge($dbconn, $prisoner_id, $selectedCell, $selectedDate) && presentCell($dbconn, $prisoner_id, $selectedCell) && correctDate($dbconn, $prisoner_id, $selectedCell, $selectedDate) && crimeSeverity($dbconn, $prisoner_id, $selectedCell, $selectedDate) && FloorCheckSex($dbconn, $prisoner_id,$selectedCell) && FloorCheckReoffender($dbconn, $prisoner_id,$selectedCell)) {

            $query_update = "UPDATE cell_history SET `to_date`=? WHERE `prisoner_id`=? AND to_date IS NULL";
            $stmt = $dbconn->prepare($query_update);
            $stmt->bind_param("ss", $selectedDate, $prisoner_id);
            $result_update = $stmt->execute();

            $query = "INSERT INTO cell_history VALUES (?,?,?,?)";
            $toDate = NULL;
            $stmt = $dbconn->prepare($query);
            $stmt->bind_param("ssss", $prisoner_id, $selectedCell,$selectedDate, $toDate);
            $result = $stmt->execute();

            if ($result && $result_update) echo "Więzień został przeniesiony do celi.";
        }
    }
    else echo "Wypełnij wszystkie pola!";
}
?>