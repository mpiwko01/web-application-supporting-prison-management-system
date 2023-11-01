function load_data(query) {
	if (query.length > 2) {
		var form_data = new FormData();

		form_data.append("query", query);

		var ajax_request = new XMLHttpRequest();

		ajax_request.open("POST", "process_data.php");

		ajax_request.send(form_data);

		ajax_request.onreadystatechange = function () {
			if (ajax_request.readyState == 4 && ajax_request.status == 200) {
				var response = JSON.parse(ajax_request.responseText);

				var html = '<div class="list-group">';

				if (response.length > 0) {
					for (var count = 0; count < response.length; count++) {
						html +=
							'<a href="#" class="list-group-item list-group-item-action">' +
							response[count].name +
							" " +
							response[count].surname +
							", " +
							response[count].prisoner_id +
							"</a>";
					}
				} else {
					html +=
						'<a href="#" class="list-group-item list-group-item-action disabled">Brak więźnia w bazie</a>';
				}

				html += "</div>";

				document.getElementById("search_result").innerHTML = html;
			}
		};
	} else {
		document.getElementById("search_result").innerHTML = "";
	}
}

//przycisk show table
const showButton = document.querySelector("#table-btn");

function openTable() {
	showButton.textContent = "Wyświetl wszystko";
	const table = document.querySelector(".table");
	table.classList.toggle("d-none");

	if (!table.classList.contains("d-none")) {
		showButton.textContent = "Schowaj wszystko";
	}
}

showButton.addEventListener("click", openTable);

//profil więźnia
const table = document.querySelector(".my-table");

// Dodaj nowy nagłówek do istniejącej tabeli
const headerRow = table.querySelector("tr");
const newHeaderCell = document.createElement("th");

newHeaderCell.textContent = "Profil więźnia";

headerRow.appendChild(newHeaderCell);

// Dodaj zawartość nowej kolumny do każdego wiersza z danymi
const popup = document.querySelector(".prisoner-popup");
const NrColumn = document.querySelector(".number");
const dataRows = table.querySelectorAll("tr");
const IdPrisoner = document.querySelectorAll(".id_data");

let allId = [];
IdPrisoner.forEach((id) => {
	const valueID = id.innerHTML;
	allId.push(valueID);
	console.log(valueID);
});
console.log(allId);

// Funkcja do pobierania danych więźnia z serwera
function fetchPrisonerData(prisonerId) {
	return fetch("./show_prisoner.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ allId: [prisonerId] }),
	})
		.then((response) => response.json())
		.catch((error) => {
			console.error("Błąd pobierania danych więźnia:", error);
		});
}

// Obiekt do przechowywania przygotowanych danych więźniów
const prisonerData = {};

// Przygotuj dane więźniów wcześniej
allId.forEach((prisonerId) => {
	fetchPrisonerData(prisonerId).then((data) => {
		prisonerData[prisonerId] = data[0];
	});
});

function showMessage(place, id, message) {
	const container = document.querySelector(place);
	container.style.flexDirection = "row";
	document.getElementById(id).style.display = "block";

	// Tworzenie nagłówka h5
	const header = document.createElement("h5");
	header.className = "pb-3";
	header.textContent = message;

	const closeButton = document.createElement("button");
	closeButton.type = "button";
	closeButton.className = "btn-close";
	closeButton.addEventListener("click", closePopup);

	container.innerHTML = "";
	container.appendChild(header);
	container.appendChild(closeButton);

	container.style.display = "flex";
	container.style.justifyContent = "space-between";
	container.parentNode.style.maxWidth = "fit-content";
	container.parentNode.style.margin = "0 auto";
}

function trimInput(inputValue) {
    var trimmedValue = inputValue.trim();
    return trimmedValue;   
}

function containsOnlyLetters(inputValue, allowNumbers) {
	if (allowNumbers) return /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż0-9-.]*$/.test(inputValue);
	else return /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż-]*$/.test(inputValue); //true- same wymienione dozwolone znaki
}

function containsOnlyNumbers(inputValue, allowLetters) {
	if (allowLetters) return /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż0-9/]*$/.test(inputValue); //jak numer domu to zezwalany na literki
	else return /^[0-9/]*$/.test(inputValue); //true- same wymienione dozwolone znaki
}

function capitalizeFirstLetter(inputValue) { //tylko gdy pierwszy znak jest litera
	var result;
    if (inputValue.length > 0) {
        result = inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();
    } else {
        result = inputValue;
    }
	return result;
}

function zipCodeCorrect(inputValue) {
    var regex = /^\d{2}-\d{3}$/;
    return regex.test(inputValue); //zwraca true gdy dobry format
}

function dateCorrect(startDate, endDate) {
    var startDate = new Date(startDate);
    var endDate = new Date(endDate);

    if (startDate < endDate) return true; 
    else return false; 
}

function addPrisonerToDatabase() {

	// Pobierz dane z formularza
	var name = document.querySelector('input[name="name_input"]').value;
	console.log(name);
	var surname = document.querySelector('input[name="surname_input"]').value;
	console.log(surname);
	var sex = document.querySelector(".sex_input").value;
	console.log(sex);
	var birthDate = document.querySelector(
		'input[name="birth_date_input"]'
	).value;
	console.log(birthDate);
	var street = document.querySelector('input[name="street_input"]').value;
	console.log(street);
	var houseNumber = document.querySelector(
		'input[name="house_number_input"]'
	).value;
	console.log(houseNumber);
	var city = document.querySelector('input[name="city_input"]').value;
	console.log(city);
	var zipCode = document.querySelector('input[name="zip_code_input"]').value;
	console.log(zipCode);
	var startDate = document.querySelector(
		'input[name="start_date_input"]'
	).value;
	console.log(startDate);
	var endDate = document.querySelector('input[name="end_date_input"]').value;
	console.log(endDate);
	var crime = document.querySelector(".crime_input").value;
	console.log(crime);

	//pobranie spanow na bledy w formularzu //poza płcią i czynem zabronionym bo sa tam domyslenie ustawione - nie ma szans na "błąd"
	var nameError = document.getElementById("name-error");
	var surnameError = document.getElementById("surname-error");
	var birthDateError = document.getElementById("birth_date-error");
	var streetError = document.getElementById("street-error");
	var houseNumberError = document.getElementById("house_number-error");
	var cityError = document.getElementById("city-error");
	var zipCodeError = document.getElementById("zip_code-error");
	var startDateError = document.getElementById("start_date-error");
	var endDateError = document.getElementById("end_date-error");

	//flagi do walidacji
	var validName = true;
	var validSurname = true;
	var validSex = true;
	var validBirthDate = true;
	var validStreet = true;
	var validHouseNumber = true;
	var validCity = true;
	var validZipCode = true;
	var validStartDate = true;
	var validEndDate = true;
	var validCrime = true;

	//walidacja imie - dozwolone litery, '-'
	if (name.trim() !== '') {
		if (!containsOnlyLetters(name, false)) {
			console.log("Input zawiera białe znaki.");
			nameError.innerText = "Niepoprawnie wprowadzone dane.";
			nameError.style.display = "block";
			validName = false;
		} else {
			var trimmedName = trimInput(name);
        	var resultName = capitalizeFirstLetter(trimmedName);
			nameError.style.display = "none";
			name = resultName;
		}
	}
	else {
		console.log("Pusty input.");
		nameError.innerText = "Uzupełnij pole!";
		nameError.style.display = "block";
		validName = false;
	}
	
	//walidacja nazwisko - dozwolone litery, '-'
	if (surname.trim() !== '') {
		if (!containsOnlyLetters(surname, false)) {
			console.log("Input zawiera białe znaki.");
			surnameError.innerText = "Niepoprawnie wprowadzone dane.";
			surnameError.style.display = "block";
			validSurname = false;
		} else {
			var trimmedSurname = trimInput(surname);
        	var resultSurname = capitalizeFirstLetter(trimmedSurname);
			surnameError.style.display = "none";
			surname = resultSurname;
		}
	}
	else {
		console.log("Pusty input.");
		surnameError.innerText = "Uzupełnij pole!";
		surnameError.style.display = "block";
		validSurname = false;
	}

	//walidacja data urodzenia
	if (!birthDate) { //po prostu czy nie jest pusta data
		console.log("Pusty input.");
		birthDateError.innerText = "Uzupełnij pole!";
		birthDateError.style.display = "block";
		validBirthDate = false;
	} 
	
	//walidacja ulica - dozwolone litery, '-', spacje, numery
	if (street.trim() !== '') {
		if (!containsOnlyLetters(street, true)) {
			console.log("Input zawiera białe znaki.");
			streetError.innerText = "Niepoprawnie wprowadzone dane.";
			streetError.style.display = "block";
			validStreet = false;
		} else {
			var trimmedStreet = trimInput(street);
        	var resultStreet = capitalizeFirstLetter(trimmedStreet);
			streetError.style.display = "none";
			street = resultStreet;
		}
	}
	else {
		console.log("Pusty input.");
		streetError.innerText = "Uzupełnij pole!";
		streetError.style.display = "block";
		validStreet = false;
	}
	
	//walidacja numer domu - dozwolone litery, numery, '/'
	if (houseNumber.trim() !== '') {
		if (!containsOnlyNumbers(houseNumber, true)) {
			console.log("Input zawiera białe znaki.");
			houseNumberError.innerText = "Niepoprawnie wprowadzone dane.";
			HouseNumberError.style.display = "block";
			validHouseNumber = false;
		} else {
			var trimmedHouseNumber = trimInput(houseNumber);
        	var resultHouseNumber = capitalizeFirstLetter(trimmedHouseNumber);
			houseNumberError.style.display = "none";
			houseNumber = resultHouseNumber;
		}
	}
	else {
		console.log("Pusty input.");
		houseNumberError.innerText = "Uzupełnij pole!";
		houseNumberError.style.display = "block";
		validHouseNumber = false;
	}
	

	//walidacja miasto - dozwolone litery, '-'
	if (city.trim() !== '') {
		if (!containsOnlyLetters(city, false)) {
			console.log("Input zawiera białe znaki.");
			cityError.innerText = "Niepoprawnie wprowadzone dane.";
			cityError.style.display = "block";
			validCity = false;
		} else {
			var trimmedCity = trimInput(city);
        	var resultCity = capitalizeFirstLetter(trimmedCity);
			cityError.style.display = "none";
			city = resultCity;
		}
	}
	else {
		console.log("Pusty input.");
		cityError.innerText = "Uzupełnij pole!";
		cityError.style.display = "block";
		validCity = false;
	}
	

	//walidacja kod pocztowy - format XX-XXX
	if (zipCode.trim() !== '') {
		if (!zipCodeCorrect) {
			console.log("Input zawiera białe znaki.");
			zipCodeError.innerText = "Niepoprawnie wprowadzone dane.";
			zipCodeError.style.display = "block";
			validZipCode = false;
		} else {
			var trimmedZipCode = trimInput(zipCode);
        	var resultZipCode = capitalizeFirstLetter(trimmedZipCode);
			zipCodeError.style.display = "none";
			zipCode = resultZipCode;
		}
	}
	else {
		console.log("Pusty input.");
		zipCodeError.innerText = "Uzupełnij pole!";
		zipCodeError.style.display = "block";
		validZipCode = false;
	}

	//walidacja data poczatkowa
	if (!startDate) { //po prostu czy nie jest pusta data
		console.log("Pusty input.");
		startDateDateError.innerText = "Uzupełnij pole!";
		startDateDateError.style.display = "block";
		validStartDate = false;
	} 

	//walidacja data koncowa - czy pozniejsza niz startDate
	if (!endDate) { //po prostu czy nie jest pusta data
		console.log("Pusty input.");
		endDateDateError.innerText = "Uzupełnij pole!";
		endDateDateError.style.display = "block";
		validEndDate = false;
	} 
	else {
		if (!dateCorrect(startDate, endDate)) {
			console.log("Pusty input.");
			endDateError.innerText = "Data końcowa musi być późniejsza niż początkowa!";
			endDateError.style.display = "block";
			validEndDate = false;
		}	
	}

	if(validName && validSurname && validSex && validBirthDate && validStreet && validHouseNumber && validCity && validZipCode && validStartDate && validEndDate && validCrime) {
		// Wysyłanie danych na serwer
		var formData = new FormData();
		formData.append("name", name);
		formData.append("surname", surname);
		formData.append("sex", sex);
		formData.append("birthDate", birthDate);
		formData.append("street", street);
		formData.append("houseNumber", houseNumber);
		formData.append("city", city);
		formData.append("zipCode", zipCode);
		formData.append("startDate", startDate);
		formData.append("endDate", endDate);
		formData.append("crime", crime);

		var xhr = new XMLHttpRequest();
		xhr.open("POST", "add_prisoner_to_database.php", true);

		xhr.onload = function () {
			//console.log(xhr.status);
			if (xhr.status >= 200 && xhr.status < 300) {
				var response = xhr.responseText;
				//console.log(response);
				//showMessage(".popup-content", "popup", response);
			} else {
				//console.error("Błąd podczas wysyłania żądania.");
			}
		};
		xhr.send(formData);
	}

	
}

// Nasłuchiwanie przycisków "Zobacz" wierszy tabeli
dataRows.forEach((row, index) => {
	if (index !== 0) {
		const allNumber = document.createElement("td");
		allNumber.textContent = `${index}.`;
		// Pominięcie pierwszego wiersza (nagłówka)
		const newColumn = document.createElement("td");
		newColumn.innerHTML = '<button class="show_prisoner">Zobacz</button>';
		row.appendChild(newColumn);
		row.insertBefore(allNumber, row.firstChild);

		const ShowButtons = newColumn.querySelectorAll(".show_prisoner");
		ShowButtons.forEach((button) => {
			const row = button.closest("tr");
			const prisonerId = row.querySelector(".id_data").textContent;

			button.addEventListener("click", function () {
				// Pobierz przygotowane dane więźnia i wyświetl je
				const prisoner = prisonerData[prisonerId];

				const prisonerName = document.querySelector(".space_name");
				const prisonerSurname = document.querySelector(".space_surname");
				const prisonerSex = document.querySelector(".space_sex");
				const prisonerBirthDate = document.querySelector(".space_birth_date");
				const prisonerAge = document.querySelector(".space_age");
				const prisonerCell = document.querySelector(".space_cell");

				prisonerName.textContent = prisoner.name;
				prisonerSurname.textContent = prisoner.surname;
				prisonerSurname.textContent = prisoner.surname;
				prisonerSex.textContent =
					prisoner.sex === "F" ? "kobieta" : "mężczyzna";
				prisonerBirthDate.textContent = prisoner.birthDate;

				const birthDateConverted = new Date(prisoner.birthDate);
				const currentDate = new Date();
				const age =
					currentDate.getFullYear() - birthDateConverted.getFullYear();
				prisonerAge.textContent = age;

				prisonerCell.textContent = prisoner.cellNumber;

				// Wyświetlenie popupu
				popup.classList.remove("d-none");
			});
		});
	}
});

function togglePopup(popupClassName) {
	const popup = document.querySelector(`.${popupClassName}`);
	if (popup.classList.contains("d-none")) {
		popup.classList.remove("d-none");
	} else {
		popup.classList.add("d-none");
	}
	//popup.innerHTML = originalPopupContent;
}

var originalPopupContent = document.querySelector(".popup-content").innerHTML;

function closePopup() {
	document.getElementById("popup").style.display = "none";
	var popupContent = document.querySelector(".popup-content");
	popupContent.innerHTML = originalPopupContent;
	popupContent.style.display = "flex";
	popupContent.style.flexDirection = "column";
	popupContent.parentNode.style.maxWidth = "none";
}

function openPopup() {
	document.querySelector(".pop").classList.remove("d-none");
}

function addPopup() {
	const Popup = document.querySelector(".add-popup");
	Popup.style.display = "block";
}

function closeAddPopup() {
	const addPopup = document.querySelector(".add-popup");
	addPopup.style.display = "none";
}
