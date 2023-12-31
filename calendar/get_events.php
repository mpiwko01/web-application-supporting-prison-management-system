<?php

$mysqli = new mysqli("mysql.agh.edu.pl:3306", "anetabru", "Aneta30112001", "anetabru");

$query = "SELECT calendar_events.event_id as event_id, calendar_events.visitor as visitor, calendar_events.event_start as event_start, calendar_events.event_end as event_end, calendar_events.type as event_type, calendar_events.prisoner_id as prisoner_id, prisoners.name as name, prisoners.surname as surname FROM calendar_events INNER JOIN prisoners ON prisoners.prisoner_id = calendar_events.prisoner_id;";
$result = $mysqli->query($query);

$events = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $fullName = $row['name'] . " " . $row['surname'];
        $color = "";
        $start = $row['event_start'];
        $end = $row['event_end'];
        if ($row['event_type'] == "Przepustka"){ // Przepustka jest wyjątkowym typem eventu
            $color = '#db00ff';
            
            $start = explode(" ", $start)[0]; // Biorę tylko datę rozpoczęcia
            $end = explode(" ", $end)[0]; // Biorę tylko datę zakończenia

            // Aby poprawnie wyświetlić okres przepustki dodawany jest 1 dzień do daty końcowej
            $end = strtotime($end);
            $end = $end + 86400;
            $end = date("Y-m-d", $end);

            $fullName = "PRZEPUSTKA: " . $fullName;
        }
        else if ($row['event_type'] == "Rodzina") $color = "#008000";
        else if ($row['event_type'] == "Znajomy") $color = "#3788d8";
        else if ($row['event_type'] == "Prawnik") $color = "#ff0000";
        else $color = "#F57811";
        $event = array(
            'title' => $fullName,
            'prisoner_id' => $row['prisoner_id'],
            'start' => $start,
            'end' => $end,
            'visitors' => $row['visitor'],
            'type' => $row['event_type'],
            'color' => $color,
            'id' => $row['event_id'],
        );
        $events[] = $event;   
    }
}

header('Content-Type: application/json');

echo json_encode($events);

?>
