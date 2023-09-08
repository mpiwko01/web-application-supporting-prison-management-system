<?php
session_start();

if ((!isset($_SESSION['zalogowany'])) && ($_SESSION['zalogowany']!==1))
{
    //$_SESSION['login'] = $login;
    header('Location: logpage.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web prison management system - Home page</title>
    <link rel="stylesheet" href="./style/map.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/a6f2b46177.js" crossorigin="anonymous"></script>
</head>

<body>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-3 sticky-top">
        <div class="container ">
            <a class="navbar-brand" href="#"><i class="fa-solid fa-magnifying-glass"></i>SearchJail</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav ms-auto text-uppercase">
                    <a class="nav-link px-lg-3" href="#home">Wyszukaj więźnia</a>
                    <a class="nav-link px-lg-3" href="./calendar/calendar.html">Kalendarz odwiedzin</a>
                    <a class="nav-link px-lg-3" href="map.php">Plan więzienia</a>
                    <a class="nav-link px-lg-3" href="panel.php">Konto</a>
                </div>
            </div>
        </div>
    </nav>

    <head>
        <div class="container py-5">
            <h1>MAPA WIĘZIENIA</h1>
            <div class="div-boxes">
                <div class="prison_cell col-12 col-md-4 col-lg-3">
                    <p>CELA NR 1</p>
                    <button>DODAJ WIĘŹNIA</button>
                    <span class="prisoner"></span>
                </div>
                <div class="prison_cell col-12 col-md-4 col-lg-3">
                    <p>CELA NR 2</p>
                    <button>DODAJ WIĘŹNIA</button>
                    <span class="prisoner"></span>
                </div>
                <div class="prison_cell col-12 col-md-4 col-lg-3">
                    <p>CELA NR 3</p>
                    <button>DODAJ WIĘŹNIA</button>
                    <span class="prisoner"></span>
                </div>
                <div class="prison_cell col-12 col-md-4 col-lg-3">
                    <p>CELA NR 4</p>
                    <button>DODAJ WIĘŹNIA</button>
                    <span class="prisoner"></span>
                </div>
                <div class="prison_cell col-12 col-md-4 col-lg-3">
                    <p>CENA NR 5</p>
                    <button>DODAJ WIĘŹNIA</button>
                    <span class="prisoner"></span>
                </div>
                <div class="prison_cell col-12 col-md-4 col-lg-3">
                    <p>CELA NR 6</p>
                    <button>DODAJ WIĘŹNIA</button>
                    <span class="prisoner"></span>
                </div>
            </div>
        </div>
    </head>

    <script src="./js/map.js"></script>

</body>
</html>