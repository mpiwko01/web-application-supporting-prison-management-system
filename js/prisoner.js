function updatePrisonerPanel(inPrison) {

	const buttons = document.querySelectorAll('.delete-prisoner');
	buttons.forEach((button) => {
		const prisonerId = button.getAttribute("data-id");
		console.log(prisonerId);
		//var response = "Jesteś pewny, że chcesz usunąć więźnia o ID: " + prisonerId + "?";
		openTable();
		//showMessageForRemove(".popup-content1", "alert-popup", response);
		var formData = new FormData();
		formData.append("prisonerId", prisonerId);

		var xhr = new XMLHttpRequest();
		xhr.open("POST", "select_sentence_info.php", true);

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

	});

	const buttonBox = document.querySelector('.button-box');

	if (inPrison == 1) {
		const editButton = document.createElement('input');
        editButton.type = 'submit';
        editButton.className = 'btn btn-add bg-dark text-light mx-2';
        editButton.value = 'Edytuj';
        editButton.onclick = addPrisonerToDatabase;

        const deleteButton = document.createElement('input');
        deleteButton.type = 'submit';
        deleteButton.className = 'btn btn-add bg-dark text-light mx-2 delete-prisoner';
        deleteButton.value = 'Usuń';
        deleteButton.onclick = openRemovePopup;

        buttonBox.appendChild(editButton);
        buttonBox.appendChild(deleteButton);
	}
	else if (inPrison == 0) {
		const message = document.createElement('span');
        message.textContent = 'Więzień opuścił więzienie.'; //tu bedzie jeszcze pobrana data 
        buttonBox.appendChild(message);
	}
}

function displayPrisonerInfo(ID) {
	
	const prisoner = prisonerData[ID];

	const prisonerName = document.querySelector(".space_name");
	const prisonerSurname = document.querySelector(".space_surname");
	const prisonerSex = document.querySelector(".space_sex");
	const prisonerBirthDate = document.querySelector(".space_birth_date");
	const prisonerAge = document.querySelector(".space_age");
	const prisonerCell = document.querySelector(".space_cell");
	const prisonerStreet = document.querySelector(".space_street");
	const prisonerHouseNumber = document.querySelector(".space_house_number");
	const prisonerCity = document.querySelector(".space_city");
	const prisonerZipCode = document.querySelector(".space_zip_code");
	const prisonerCrime = document.querySelector(".space_crime");
	const prisonerStartDate = document.querySelector(".space_start_date");
	const prisonerEndDate = document.querySelector(".space_end_date");

	const prisonerInPrison = prisoner.inPrison;
	console.log(prisonerInPrison);

	prisonerName.textContent = prisoner.name;
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
	prisonerStreet.textContent = prisoner.street;
	prisonerHouseNumber.textContent = prisoner.houseNumber;
	prisonerCity.textContent = prisoner.city;
	prisonerZipCode.textContent = prisoner.zipCode;
	prisonerCrime.textContent = prisoner.crime;
	prisonerStartDate.textContent = prisoner.startDate;
	prisonerEndDate.textContent = prisoner.endDate; 

	// Wyświetlenie popupu
	updatePrisonerPanel(prisonerInPrison);
	const popup = document.querySelector(".prisoner-popup");
	popup.classList.remove("d-none");
	console.log(ID);

	const deleteButtons = document.querySelectorAll(".delete-prisoner");

	deleteButtons.forEach((button) => {
		button.setAttribute("data-id", ID);
		console.log(ID); //przekazujemy id do guzika usuwania
	});
}

function load_data(query) {

	if (query.length > 2) {
		var form_data = new FormData();

		form_data.append("query", query);

		var ajax_request = new XMLHttpRequest();

		ajax_request.open("POST", "process_data3.php");

		ajax_request.send(form_data);

		ajax_request.onreadystatechange = function () {
			if (ajax_request.readyState == 4 && ajax_request.status == 200) {
				var response = JSON.parse(ajax_request.responseText);

				var html = '<div class="list-group">';

				if (response.length > 0) {
					for (var count = 0; count < response.length; count++) {
						html +=
						'<input type="submit" class="list-group-item list-group-item-action" name="prisoner_open" value="' +
						response[count].name +
						" " +
						response[count].surname +
						" " +
						response[count].prisoner_id +
						'">' +
						'<input type="hidden"  name="prisoner_add_id" value="' +
						response[count].prisoner_id +
						'">';
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

function handleSearchResultClick(event) {
	const target = event.target;

	if (target.name === "prisoner_open") {
		// Pobierz wartość klikniętej sugestii
		const suggestionValue = target.value;
		console.log(suggestionValue);

		const targetID = suggestionValue.split(" ")[2];

		console.log(targetID);

		// Zaktualizuj pole wprowadzania wybraną sugestią
		const searchBox = document.querySelector('input[name="search_box"]');
		
		// Wyczyść wyniki wyszukiwania
		searchBox.value = "";
		searchBox.placeholder = "Wpisz imię i nazwisko szukanego więźnia";
		document.getElementById("search_result").innerHTML = "";
		document.getElementById("search").innerHTML = "";
		searchBox.placeholder = "Wpisz imię i nazwisko szukanego więźnia";

		fetchPrisonerData(targetID);
		displayPrisonerInfo(targetID);
	}
}

document
	.getElementById("search_result")
	.addEventListener("click", handleSearchResultClick);

//przycisk show table
const showButton = document.querySelector("#table-btn");

function openRemovePopup () {
	togglePopup('prisoner-popup'); //chowamy popup wieznia
	const buttons = document.querySelectorAll('.delete-prisoner');
	buttons.forEach((button) => {
		const prisonerId = button.getAttribute("data-id");
		console.log(prisonerId);
		var response = "Jesteś pewny, że chcesz usunąć więźnia o ID: " + prisonerId + "?";
		openTable();
		showMessageForRemove(".popup-content1", "alert-popup", response);
	});
		

}

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

function showMessageForRemove(place, id, message) {
	const container = document.querySelector(place);
	container.style.flexDirection = "column"; // Ustawia układ pionowy dla elementów

	document.getElementById(id).style.display = "block";

	// Tworzenie nagłówka h5
	const header = document.createElement("h5");
	header.className = "pb-3";
	header.textContent = message;

	// Tworzenie kontenera na guziki
	const buttonContainer = document.createElement("div");
	buttonContainer.style.display = "flex";
	buttonContainer.style.flexDirection = "row"; // Ustawia układ kolumnowy dla guzików
	buttonContainer.style.alignItems = "center"; // Wyśrodkowuje guziki w poziomie

	const buttonDelete = document.createElement("button");
	buttonDelete.type = "submit";
	buttonDelete.textContent = "Usuń";
	buttonDelete.className = "btn btn-add bg-dark text-light mx-2 delete-prisoner";
	buttonDelete.addEventListener("click", removePrisonerFromDatabase);

	const buttonCancel = document.createElement("button");
	buttonCancel.type = "button";
	buttonCancel.textContent = "Anuluj";
	buttonCancel.className = "btn btn-add bg-dark text-light mx-2 delete-prisoner";
	buttonCancel.addEventListener("click", closeAlert);

	container.innerHTML = "";
	container.appendChild(header);
	buttonContainer.appendChild(buttonDelete);
	buttonContainer.appendChild(buttonCancel);
	container.appendChild(buttonContainer);

	const closeButton = document.createElement("button");
	closeButton.type = "button";
	closeButton.className = "btn-close";
	closeButton.addEventListener("click", closeAlert);
	container.appendChild(closeButton);

	container.style.display = "flex";
	container.style.alignItems = "center"; // Wyśrodkowuje zawartość w pionie
	container.parentNode.style.maxWidth = "fit-content";
	container.parentNode.style.margin = "0 auto";
}


function trimInput(inputValue) {
    var trimmedValue = inputValue.trim();
    return trimmedValue;   
}

//zezwala na spacje
function containsOnlyLetters(inputValue, allowNumbers) {
    if (allowNumbers) return /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż0-9.\s-]*$/.test(inputValue);
    else return /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s-]*$/.test(inputValue); //true - same dozwolone znaki
}

function containsOnlyNumbers(inputValue, allowLetters) {
    if (allowLetters) return /^(?=.*\d)[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż0-9/]*$/.test(inputValue);
    else return /^(?=.*\d)[0-9/]*$/.test(inputValue); //true - przynajmniej jedna cyfra
}

function capitalizeFirstLetter(inputValue) {
    if (inputValue.length > 0) {
        const words = inputValue.split(/[\s-]+/);
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
        }
        return words.join("-");
    } else {
        return inputValue;
    }
}

function zipCodeCorrect(inputValue) {
    var regex = /^\d{2}-\d{3}$/;
    return regex.test(inputValue);
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
	name = trimInput(name);
	if (name.trim() !== '') {
		if (!containsOnlyLetters(name, false)) {
			nameError.innerText = "Niepoprawnie wprowadzone dane.";
			nameError.style.display = "block";
			validName = false;
		} else {
        	var resultName = capitalizeFirstLetter(name);
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
	surname = trimInput(surname);
	if (surname.trim() !== '') {
		if (!containsOnlyLetters(surname, false)) {
			surnameError.innerText = "Niepoprawnie wprowadzone dane.";
			surnameError.style.display = "block";
			validSurname = false;
		} else {
        	var resultSurname = capitalizeFirstLetter(surname);
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
	
	//walidacja ulica - dozwolone litery, '-', '/', '.', spacje, numery
	street = trimInput(street);
	if (street.trim() !== '') {
		console.log(street);
		if (!containsOnlyLetters(street, true)) {
			streetError.innerText = "Niepoprawnie wprowadzone dane.";
			streetError.style.display = "block";
			validStreet = false;
		} else {
        	var resultStreet = capitalizeFirstLetter(street);
			streetError.style.display = "none";
			street = resultStreet;
			console.log(street);
		}
	}
	else {
		console.log("Pusty input.");
		streetError.innerText = "Uzupełnij pole!";
		streetError.style.display = "block";
		validStreet = false;
	}
	
	//walidacja numer domu - dozwolone litery, numery, '/'
	houseNumber = trimInput(houseNumber);
	if (houseNumber.trim() !== '') {
		if (!containsOnlyNumbers(houseNumber, true)) {
			houseNumberError.innerText = "Niepoprawnie wprowadzone dane.";
			houseNumberError.style.display = "block";
			validHouseNumber = false;
		} else {
        	var resultHouseNumber = capitalizeFirstLetter(houseNumber);
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
	city = trimInput(city);
	if (city.trim() !== '') {
		console.log(city)
		if (!containsOnlyLetters(city, false)) {
			cityError.innerText = "Niepoprawnie wprowadzone dane.";
			cityError.style.display = "block";
			validCity = false;
		} else {
        	var resultCity = capitalizeFirstLetter(city);
			cityError.style.display = "none";
			city = resultCity;
			console.log(city)
		}
	}
	else {
		console.log("Pusty input.");
		cityError.innerText = "Uzupełnij pole!";
		cityError.style.display = "block";
		validCity = false;
	}
	

	//walidacja kod pocztowy - format XX-XXX
	zipCode = trimInput(zipCode);
	if (zipCode.trim() !== '') {
		console.log(zipCode);
		if (!zipCodeCorrect(zipCode)) {
			zipCodeError.innerText = "Niepoprawnie wprowadzone dane.";
			zipCodeError.style.display = "block";
			validZipCode = false;
		} else {
        	var resultZipCode = capitalizeFirstLetter(zipCode);
			zipCodeError.style.display = "none";
			zipCode = resultZipCode;
			console.log(zipCode);
		}
	}
	else {
		console.log("Pusty input.");
		zipCodeError.innerText = "Uzupełnij pole!";
		zipCodeError.style.display = "block";
		validZipCode = false;
	}

	//walidacja data poczatkowa - czy pozniejsza niz birthDate
	if (!startDate) { //po prostu czy nie jest pusta data
		console.log("Pusty input.");
		startDateError.innerText = "Uzupełnij pole!";
		startDateError.style.display = "block";
		validStartDate = false;
	} 
	else {
		if (!dateCorrect(birthDate, startDate)) {
			endDateError.innerText = "Data początkowa nie może być wcześniejsza niż data urodzenia!";
			startDateError.style.display = "block";
			validStartDate = false;
		}	
	} 

	//walidacja data koncowa - czy pozniejsza niz startDate
	if (!endDate) { //po prostu czy nie jest pusta data
		console.log("Pusty input.");
		endDateError.innerText = "Uzupełnij pole!";
		endDateError.style.display = "block";
		validEndDate = false;
	} 
	else {
		if (!dateCorrect(startDate, endDate)) {
			endDateError.innerText = "Data końcowa musi być późniejsza niż początkowa!";
			endDateError.style.display = "block";
			validEndDate = false;
		}	
	}

	console.log("Imie: " + validName);
	console.log("Nazwisko: " + validSurname);
	console.log("Płeć: " + validSex);
	console.log("Data urodzenia: " + validBirthDate);
	console.log("Ulica: " + validStreet);
	console.log("Numer domu: " + validHouseNumber);
	console.log("Miasto: " + validCity);
	console.log("Kod pocztowy: " + validZipCode);
	console.log("Data początkowa: " + validStartDate);
	console.log("Data końcowa: " + validEndDate);
	console.log("Czyn zabroniony: " + validCrime);

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
				showMessage(".popup-content", "popup", response);
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
			fetchPrisonerData(prisonerId);
			button.addEventListener("click", () => {
				displayPrisonerInfo(prisonerId);
			});
			console.log(prisonerId);

		});
	}
}); 

function removePrisonerFromDatabase() {

	const buttons = document.querySelectorAll('.delete-prisoner');
	buttons.forEach((button) => {
		const prisonerId = button.getAttribute("data-id");
		console.log(prisonerId);

		var formData = new FormData();
		formData.append("prisonerId", prisonerId);
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "remove_prisoner_from_database.php", true);

		xhr.onload = function () {
			//console.log(xhr.status);
			if (xhr.status >= 200 && xhr.status < 300) {
				var response = xhr.responseText;
				//console.log(response);
				closeAlert();
				showMessage(".popup-content", "popup", response);
			} else {
				//console.error("Błąd podczas wysyłania żądania.");
			}
		};
		xhr.send(formData);
	});

		
};

const deleteButtons = document.querySelectorAll('.delete-prisoners');

// Iteruj po każdym przycisku "Usuń" i przypisz obsługę kliknięcia
deleteButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    // Pobierz ID więźnia z atrybutu "data-id"
    const prisonerId = button.getAttribute("data-id");
    console.log(prisonerId);
  });
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

function clearButtonBox() {
	const buttonBox = document.querySelector('.button-box');
	buttonBox.innerHTML = '';
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

function closeAlert() {
	const alertPopup = document.querySelector(".alert-popup");
	alertPopup.style.display = "none";
}
