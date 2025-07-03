const FORM = document.getElementById("car-form");
const SUGGESTIONS_DIV = document.getElementById("suggestions");
const MAKE_SELECT = document.getElementById("make");
const MODEL_SELECT = document.getElementById("model");
const BODY_TYPE_SELECT = document.getElementById("body-type");
const TRANSMISSION_SELECT = document.getElementById("transmission");
const FUEL_TYPE_SELECT = document.getElementById("fuel-type");
const CLEAR_BUTTON = document.getElementById("clear-btn");
const SEARCH_INPUT = document.getElementById("search");
const SEARCH_SUGGESTIONS = document.getElementById("search-suggestions");
const COMPARE_BUTTON = document.getElementById("compare-btn");
const PRICE_INPUT = document.getElementById("price");
const COMPARE_MODAL = new bootstrap.Modal(
  document.getElementById("compareModal")
);
const COMPARE_TABLE = document.getElementById("compare-table");

let carsData = [];
let selectedCars = []; // Karşılaştırma için seçilen araçlar

async function loadCars() {
  try {
    const response = await fetch("cars_g.json");
    if (!response.ok) {
      throw new Error("Araç verileri yüklenemedi.");
    }
    carsData = await response.json();
    return carsData;
  } catch (error) {
    console.error("Hata:", error);
    throw error;
  }
}

// Markaları dinamik olarak yükle
function populateMakes(cars, maxPrice = null) {
  MAKE_SELECT.innerHTML = '<option value="">Tüm Markalar</option>';
  let filteredCars = [...cars];
  if (maxPrice) {
    filteredCars = filteredCars.filter((car) => car.fiyat <= maxPrice);
  }
  const makes = [...new Set(filteredCars.map((car) => car.marka))].sort();
  makes.forEach((make) => {
    const option = document.createElement("option");
    option.value = make;
    option.textContent = make;
    MAKE_SELECT.appendChild(option);
  });
}

// Modelleri dinamik olarak yükle
function populateModels(selectedMake, cars, maxPrice = null) {
  MODEL_SELECT.innerHTML = '<option value="">Tüm Modeller</option>';
  MODEL_SELECT.disabled = !selectedMake;
  if (selectedMake) {
    let filteredCars = cars.filter((car) => car.marka === selectedMake);
    if (maxPrice) {
      filteredCars = filteredCars.filter((car) => car.fiyat <= maxPrice);
    }
    const models = [...new Set(filteredCars.map((car) => car.model))].sort();
    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      MODEL_SELECT.appendChild(option);
    });
  }
}

// Kasa tiplerini dinamik olarak yükle
function populateBodyTypes(
  cars,
  selectedMake,
  selectedModel,
  searchTerm,
  maxPrice = null
) {
  BODY_TYPE_SELECT.innerHTML = '<option value="">Tüm Kasa Tipleri</option>';
  let filteredCars = [...cars];
  if (searchTerm) {
    const inputParts = searchTerm.toLowerCase().split(" ");
    const inputMake = inputParts[0];
    const inputModel = inputParts.slice(1).join(" ");
    filteredCars = filteredCars.filter((car) => {
      const carMake = car.marka.toLowerCase();
      const carModel = car.model.toLowerCase();
      return (
        carMake.includes(inputMake) &&
        (!inputModel || carModel.includes(inputModel))
      );
    });
  }
  if (selectedMake) {
    filteredCars = filteredCars.filter((car) => car.marka === selectedMake);
  }
  if (selectedModel) {
    filteredCars = filteredCars.filter((car) => car.model === selectedModel);
  }
  if (maxPrice) {
    filteredCars = filteredCars.filter((car) => car.fiyat <= maxPrice);
  }
  const bodyTypes = [
    ...new Set(filteredCars.map((car) => car.kasa_tipi)),
  ].sort();
  bodyTypes.forEach((bodyType) => {
    const option = document.createElement("option");
    option.value = bodyType;
    option.textContent = bodyType;
    BODY_TYPE_SELECT.appendChild(option);
  });
  return filteredCars; // Fiyat kontrolü için filtrelenmiş araçları döndür
}

// Vites tiplerini dinamik olarak yükle
function populateTransmissions(
  cars,
  selectedMake,
  selectedModel,
  selectedBodyType,
  searchTerm,
  maxPrice = null
) {
  TRANSMISSION_SELECT.innerHTML = '<option value="">Tüm Vites Tipleri</option>';
  let filteredCars = [...cars];
  if (searchTerm) {
    const inputParts = searchTerm.toLowerCase().split(" ");
    const inputMake = inputParts[0];
    const inputModel = inputParts.slice(1).join(" ");
    filteredCars = filteredCars.filter((car) => {
      const carMake = car.marka.toLowerCase();
      const carModel = car.model.toLowerCase();
      return (
        carMake.includes(inputMake) &&
        (!inputModel || carModel.includes(inputModel))
      );
    });
  }
  if (selectedMake) {
    filteredCars = filteredCars.filter((car) => car.marka === selectedMake);
  }
  if (selectedModel) {
    filteredCars = filteredCars.filter((car) => car.model === selectedModel);
  }
  if (selectedBodyType) {
    filteredCars = filteredCars.filter(
      (car) => car.kasa_tipi === selectedBodyType
    );
  }
  if (maxPrice) {
    filteredCars = filteredCars.filter((car) => car.fiyat <= maxPrice);
  }
  const transmissions = [
    ...new Set(filteredCars.map((car) => car.vites_tipi)),
  ].sort();
  transmissions.forEach((transmission) => {
    const option = document.createElement("option");
    option.value = transmission;
    option.textContent = transmission;
    TRANSMISSION_SELECT.appendChild(option);
  });
  return filteredCars; // Fiyat kontrolü için filtrelenmiş araçları döndür
}

// Yakıt tiplerini dinamik olarak yükle
function populateFuelTypes(
  cars,
  selectedMake,
  selectedModel,
  selectedBodyType,
  selectedTransmission,
  searchTerm,
  maxPrice = null
) {
  FUEL_TYPE_SELECT.innerHTML = '<option value="">Tüm Yakıt Tipleri</option>';
  let filteredCars = [...cars];
  if (searchTerm) {
    const inputParts = searchTerm.toLowerCase().split(" ");
    const inputMake = inputParts[0];
    const inputModel = inputParts.slice(1).join(" ");
    filteredCars = filteredCars.filter((car) => {
      const carMake = car.marka.toLowerCase();
      const carModel = car.model.toLowerCase();
      return (
        carMake.includes(inputMake) &&
        (!inputModel || carModel.includes(inputModel))
      );
    });
  }
  if (selectedMake) {
    filteredCars = filteredCars.filter((car) => car.marka === selectedMake);
  }
  if (selectedModel) {
    filteredCars = filteredCars.filter((car) => car.model === selectedModel);
  }
  if (selectedBodyType) {
    filteredCars = filteredCars.filter(
      (car) => car.kasa_tipi === selectedBodyType
    );
  }
  if (selectedTransmission) {
    filteredCars = filteredCars.filter(
      (car) => car.vites_tipi === selectedTransmission
    );
  }
  if (maxPrice) {
    filteredCars = filteredCars.filter((car) => car.fiyat <= maxPrice);
  }
  const fuelTypes = [
    ...new Set(filteredCars.map((car) => normalizeFuelType(car.yakit_tipi))),
  ].sort();
  fuelTypes.forEach((fuelType) => {
    const option = document.createElement("option");
    option.value = fuelType;
    option.textContent = fuelType;
    FUEL_TYPE_SELECT.appendChild(option);
  });
  return filteredCars; // Fiyat kontrolü için filtrelenmiş araçları döndür
}

// Fiyat inputunu güncelle
function updatePriceInput(filteredCars) {
  if (filteredCars.length > 0) {
    const minPrice = Math.min(...filteredCars.map((car) => car.fiyat));
    PRICE_INPUT.setAttribute("min", minPrice);
    PRICE_INPUT.placeholder = `En az ${minPrice.toLocaleString("tr-TR")} TL`;
  } else {
    PRICE_INPUT.removeAttribute("min");
    PRICE_INPUT.placeholder = "Örn: 1500000 TL";
  }
}

// Arama önerileri göster
function showSuggestions(input, cars) {
  SEARCH_SUGGESTIONS.innerHTML = "";
  SEARCH_SUGGESTIONS.style.display = "none";
  if (!input) return;
  const inputLower = input.toLowerCase();
  const suggestions = [];
  cars.forEach((car) => {
    const make = car.marka.toLowerCase();
    const model = car.model.toLowerCase();
    const makeModel = `${car.marka} ${car.model}`.toLowerCase();
    if (make.includes(inputLower) && !suggestions.includes(car.marka)) {
      suggestions.push(car.marka);
    }
    if (model.includes(inputLower) && !suggestions.includes(car.model)) {
      suggestions.push(car.model);
    }
    if (makeModel.includes(inputLower) && !suggestions.includes(makeModel)) {
      suggestions.push(`${car.marka} ${car.model}`);
    }
  });
  suggestions.slice(0, 10).forEach((suggestion) => {
    const div = document.createElement("div");
    div.textContent = suggestion;
    div.addEventListener("click", () => {
      SEARCH_INPUT.value = suggestion;
      SEARCH_SUGGESTIONS.innerHTML = "";
      SEARCH_SUGGESTIONS.style.display = "none";
      MAKE_SELECT.disabled = true;
      loadCars().then((cars) => {
        const maxPrice = PRICE_INPUT.value ? parseInt(PRICE_INPUT.value) : null;
        const filteredCars = populateBodyTypes(
          cars,
          null,
          null,
          suggestion,
          maxPrice
        );
        populateTransmissions(cars, null, null, null, suggestion, maxPrice);
        populateFuelTypes(cars, null, null, null, null, suggestion, maxPrice);
        updatePriceInput(filteredCars);
      });
    });
    SEARCH_SUGGESTIONS.appendChild(div);
  });
  if (suggestions.length > 0) {
    SEARCH_SUGGESTIONS.style.display = "block";
  }
}

// Alternatif öneriler oluştur
function suggestAlternatives(filters, cars) {
  let suggestions = [];
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
  if (filters.price) {
    const currentPrice = parseInt(filters.price);
    const higherPrice = currentPrice + 100000;
    let priceFiltered = cars.filter((car) => car.fiyat <= higherPrice);
    if (filters.search) {
      const inputParts = filters.search.toLowerCase().split(" ");
      const inputMake = inputParts[0];
      const inputModel = inputParts.slice(1).join(" ");
      priceFiltered = priceFiltered.filter((car) => {
        const carMake = car.marka.toLowerCase();
        const carModel = car.model.toLowerCase();
        return (
          carMake.includes(inputMake) &&
          (!inputModel || carModel.includes(inputModel))
        );
      });
    }
    if (filters.make) {
      priceFiltered = priceFiltered.filter(
        (car) => car.marka.toLowerCase() === filters.make.toLowerCase()
      );
    }
    if (filters.model) {
      priceFiltered = priceFiltered.filter(
        (car) => car.model.toLowerCase() === filters.model.toLowerCase()
      );
    }
    if (filters.bodyType) {
      priceFiltered = priceFiltered.filter(
        (car) => car.kasa_tipi.toLowerCase() === filters.bodyType.toLowerCase()
      );
    }
    if (filters.transmission) {
      priceFiltered = priceFiltered.filter(
        (car) =>
          car.vites_tipi.toLowerCase() === filters.transmission.toLowerCase()
      );
    }
    if (filters.fuelType) {
      priceFiltered = priceFiltered.filter(
        (car) =>
          normalizeFuelType(car.yakit_tipi).toLowerCase() ===
          filters.fuelType.toLowerCase()
      );
    }
    if (priceFiltered.length > 0) {
      suggestions.push(
        `Fiyat aralığınızı ${higherPrice.toLocaleString(
          "tr-TR"
        )} TL'ye çıkararak ${priceFiltered.length} araç bulabilirsiniz.`
      );
    }
  }
  if (filters.fuelType) {
    const otherFuelTypes = ["Benzin", "Dizel", "Hibrit", "Elektrik"].filter(
      (fuel) => fuel.toLowerCase() !== filters.fuelType.toLowerCase()
    );
    for (const fuelType of otherFuelTypes) {
      let fuelFiltered = cars.filter(
        (car) =>
          normalizeFuelType(car.yakit_tipi).toLowerCase() ===
          fuelType.toLowerCase()
      );
      if (filters.search) {
        const inputParts = filters.search.toLowerCase().split(" ");
        const inputMake = inputParts[0];
        const inputModel = inputParts.slice(1).join(" ");
        fuelFiltered = fuelFiltered.filter((car) => {
          const carMake = car.marka.toLowerCase();
          const carModel = car.model.toLowerCase();
          return (
            carMake.includes(inputMake) &&
            (!inputModel || carModel.includes(inputModel))
          );
        });
      }
      if (filters.make) {
        fuelFiltered = fuelFiltered.filter(
          (car) => car.marka.toLowerCase() === filters.make.toLowerCase()
        );
      }
      if (filters.model) {
        fuelFiltered = fuelFiltered.filter(
          (car) => car.model.toLowerCase() === filters.model.toLowerCase()
        );
      }
      if (filters.bodyType) {
        fuelFiltered = fuelFiltered.filter(
          (car) =>
            car.kasa_tipi.toLowerCase() === filters.bodyType.toLowerCase()
        );
      }
      if (filters.transmission) {
        fuelFiltered = fuelFiltered.filter(
          (car) =>
            car.vites_tipi.toLowerCase() === filters.transmission.toLowerCase()
        );
      }
      if (filters.price) {
        fuelFiltered = fuelFiltered.filter(
          (car) => car.fiyat <= parseInt(filters.price)
        );
      }
      if (fuelFiltered.length > 0) {
        suggestions.push(
          `Yakıt tipini "${fuelType}" olarak değiştirirseniz ${fuelFiltered.length} araç bulabilirsiniz.`
        );
        break;
      }
    }
  }
  if (suggestions.length === 0) {
    suggestions.push(
      "Daha geniş kriterler deneyin, örneğin marka veya kasa tipi kısıtlamasını kaldırın."
    );
  }
  return `
    <p class="text-center text-warning">
      Hiç araç bulunamadı. Seçtiğiniz kombinasyonlar için uygun araç yok.<br>
      <strong>Öneriler:</strong><br>
      ${suggestions.map((s) => `- ${s}`).join("<br>")}
    </p>`;
}

// Karşılaştırma tablosu oluştur
function createCompareTable(cars) {
  if (cars.length === 0) {
    COMPARE_TABLE.innerHTML = `<p class="text-center">Karşılaştırmak için araç seçin.</p>`;
    return;
  }
  let tableHTML = `
    <table class="table compare-table">
      <thead>
        <tr>
          <th></th>
          ${cars
            .map(
              (car) => `
            <th>
              <img src="${car.resim_url}" alt="${car.marka} ${
                car.model
              }" onerror="this.src='https://placehold.co/500x220?text=${encodeURIComponent(
                `${car.marka} ${car.model}`
              )}&font=poppins'">
              <h6>${car.marka} ${car.model}</h6>
            </th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Fiyat</td>
          ${cars
            .map((car) => `<td>${car.fiyat.toLocaleString("tr-TR")} TL</td>`)
            .join("")}
        </tr>
        <tr>
          <td>Yakıt Tipi</td>
          ${cars.map((car) => `<td>${car.yakit_tipi}</td>`).join("")}
        </tr>
        <tr>
          <td>Kasa Tipi</td>
          ${cars.map((car) => `<td>${car.kasa_tipi}</td>`).join("")}
        </tr>
        <tr>
          <td>Vites Tipi</td>
          ${cars.map((car) => `<td>${car.vites_tipi}</td>`).join("")}
        </tr>
      </tbody>
    </table>`;
  COMPARE_TABLE.innerHTML = tableHTML;
}

// Karşılaştırma butonunu güncelle
function updateCompareButton() {
  COMPARE_BUTTON.disabled = selectedCars.length < 2;
}

// Marka seçimi değiştiğinde
MAKE_SELECT.addEventListener("change", async (e) => {
  const selectedMake = e.target.value;
  SEARCH_INPUT.disabled = selectedMake !== "" || PRICE_INPUT.value !== "";
  const cars = await loadCars();
  const maxPrice = PRICE_INPUT.value ? parseInt(PRICE_INPUT.value) : null;
  populateModels(selectedMake, cars, maxPrice);
  const filteredCars = populateBodyTypes(
    cars,
    selectedMake,
    MODEL_SELECT.value,
    SEARCH_INPUT.value,
    maxPrice
  );
  populateTransmissions(
    cars,
    selectedMake,
    MODEL_SELECT.value,
    BODY_TYPE_SELECT.value,
    SEARCH_INPUT.value,
    maxPrice
  );
  populateFuelTypes(
    cars,
    selectedMake,
    MODEL_SELECT.value,
    BODY_TYPE_SELECT.value,
    TRANSMISSION_SELECT.value,
    SEARCH_INPUT.value,
    maxPrice
  );
  updatePriceInput(filteredCars);
});

// Model seçimi değiştiğinde
MODEL_SELECT.addEventListener("change", async (e) => {
  const selectedModel = e.target.value;
  const selectedMake = MAKE_SELECT.value;
  const cars = await loadCars();
  const maxPrice = PRICE_INPUT.value ? parseInt(PRICE_INPUT.value) : null;
  const filteredCars = populateBodyTypes(
    cars,
    selectedMake,
    selectedModel,
    SEARCH_INPUT.value,
    maxPrice
  );
  populateTransmissions(
    cars,
    selectedMake,
    selectedModel,
    BODY_TYPE_SELECT.value,
    SEARCH_INPUT.value,
    maxPrice
  );
  populateFuelTypes(
    cars,
    selectedMake,
    selectedModel,
    BODY_TYPE_SELECT.value,
    TRANSMISSION_SELECT.value,
    SEARCH_INPUT.value,
    maxPrice
  );
  updatePriceInput(filteredCars);
});

// Kasa tipi seçimi değiştiğinde
BODY_TYPE_SELECT.addEventListener("change", async (e) => {
  const selectedBodyType = e.target.value;
  const selectedMake = MAKE_SELECT.value;
  const selectedModel = MODEL_SELECT.value;
  const cars = await loadCars();
  const maxPrice = PRICE_INPUT.value ? parseInt(PRICE_INPUT.value) : null;
  const filteredCars = populateTransmissions(
    cars,
    selectedMake,
    selectedModel,
    selectedBodyType,
    SEARCH_INPUT.value,
    maxPrice
  );
  populateFuelTypes(
    cars,
    selectedMake,
    selectedModel,
    selectedBodyType,
    TRANSMISSION_SELECT.value,
    SEARCH_INPUT.value,
    maxPrice
  );
  updatePriceInput(filteredCars);
});

// Vites tipi seçimi değiştiğinde
TRANSMISSION_SELECT.addEventListener("change", async (e) => {
  const selectedTransmission = e.target.value;
  const selectedMake = MAKE_SELECT.value;
  const selectedModel = MODEL_SELECT.value;
  const selectedBodyType = BODY_TYPE_SELECT.value;
  const cars = await loadCars();
  const maxPrice = PRICE_INPUT.value ? parseInt(PRICE_INPUT.value) : null;
  const filteredCars = populateFuelTypes(
    cars,
    selectedMake,
    selectedModel,
    selectedBodyType,
    selectedTransmission,
    SEARCH_INPUT.value,
    maxPrice
  );
  updatePriceInput(filteredCars);
});

// Arama çubuğuna yazıldığında
SEARCH_INPUT.addEventListener("input", async (e) => {
  const searchValue = e.target.value.trim();
  MAKE_SELECT.disabled = searchValue !== "";
  const cars = await loadCars();
  const maxPrice = PRICE_INPUT.value ? parseInt(PRICE_INPUT.value) : null;
  showSuggestions(searchValue, cars);
  const filteredCars = populateBodyTypes(
    cars,
    MAKE_SELECT.value,
    MODEL_SELECT.value,
    searchValue,
    maxPrice
  );
  populateTransmissions(
    cars,
    MAKE_SELECT.value,
    MODEL_SELECT.value,
    BODY_TYPE_SELECT.value,
    searchValue,
    maxPrice
  );
  populateFuelTypes(
    cars,
    MAKE_SELECT.value,
    MODEL_SELECT.value,
    BODY_TYPE_SELECT.value,
    TRANSMISSION_SELECT.value,
    searchValue,
    maxPrice
  );
  updatePriceInput(filteredCars);
});

// Fiyat inputu değiştiğinde
PRICE_INPUT.addEventListener("blur", async () => {
  const maxPrice = PRICE_INPUT.value ? parseInt(PRICE_INPUT.value) : null;
  SEARCH_INPUT.disabled = maxPrice !== null; // Fiyat girilirse arama çubuğunu devre dışı bırak
  if (maxPrice) {
    const cars = await loadCars();
    let filteredCars = [...cars];
    if (MAKE_SELECT.value) {
      filteredCars = filteredCars.filter(
        (car) => car.marka === MAKE_SELECT.value
      );
    }
    if (MODEL_SELECT.value) {
      filteredCars = filteredCars.filter(
        (car) => car.model === MODEL_SELECT.value
      );
    }
    if (SEARCH_INPUT.value) {
      const inputParts = SEARCH_INPUT.value.toLowerCase().split(" ");
      const inputMake = inputParts[0];
      const inputModel = inputParts.slice(1).join(" ");
      filteredCars = filteredCars.filter((car) => {
        const carMake = car.marka.toLowerCase();
        const carModel = car.model.toLowerCase();
        return (
          carMake.includes(inputMake) &&
          (!inputModel || carModel.includes(inputModel))
        );
      });
    }
    filteredCars = filteredCars.filter((car) => car.fiyat <= maxPrice);
    if (filteredCars.length > 0) {
      const minPrice = Math.min(...filteredCars.map((car) => car.fiyat));
      if (maxPrice < minPrice) {
        PRICE_INPUT.value = "";
        SEARCH_INPUT.disabled = false; // Fiyat sıfırlanırsa arama çubuğunu aktif et
        alert(
          `Girdiğiniz fiyat, filtrelenen araçların minimum fiyatından (${minPrice.toLocaleString(
            "tr-TR"
          )} TL) düşük. Lütfen daha yüksek bir fiyat girin.`
        );
      } else {
        // Fiyat geçerliyse markaları güncelle
        populateMakes(cars, maxPrice);
        populateModels(MAKE_SELECT.value, cars, maxPrice);
        populateBodyTypes(
          cars,
          MAKE_SELECT.value,
          MODEL_SELECT.value,
          SEARCH_INPUT.value,
          maxPrice
        );
        populateTransmissions(
          cars,
          MAKE_SELECT.value,
          MODEL_SELECT.value,
          BODY_TYPE_SELECT.value,
          SEARCH_INPUT.value,
          maxPrice
        );
        populateFuelTypes(
          cars,
          MAKE_SELECT.value,
          MODEL_SELECT.value,
          BODY_TYPE_SELECT.value,
          TRANSMISSION_SELECT.value,
          SEARCH_INPUT.value,
          maxPrice
        );
      }
    } else {
      PRICE_INPUT.value = "";
      SEARCH_INPUT.disabled = false; // Fiyat sıfırlanırsa arama çubuğunu aktif et
      alert(
        "Bu fiyat aralığında araç bulunamadı. Lütfen daha yüksek bir fiyat girin veya diğer filtreleri kontrol edin."
      );
    }
  }
});

// Arama önerileri dışına tıklayınca kapat
document.addEventListener("click", (e) => {
  if (!SEARCH_SUGGESTIONS.contains(e.target) && e.target !== SEARCH_INPUT) {
    SEARCH_SUGGESTIONS.innerHTML = "";
    SEARCH_SUGGESTIONS.style.display = "none";
  }
});

// Seçimleri temizle
CLEAR_BUTTON.addEventListener("click", async () => {
  FORM.reset();
  MODEL_SELECT.disabled = true;
  MODEL_SELECT.innerHTML = '<option value="">Önce Marka Seçin</option>';
  MAKE_SELECT.disabled = false;
  SEARCH_INPUT.disabled = false; // Temizle butonunda arama çubuğunu aktif et
  SUGGESTIONS_DIV.innerHTML = "";
  SEARCH_SUGGESTIONS.innerHTML = "";
  SEARCH_SUGGESTIONS.style.display = "none";
  PRICE_INPUT.removeAttribute("min");
  PRICE_INPUT.placeholder = "Örn: 1500000 TL";
  selectedCars = [];
  updateCompareButton();
  document
    .querySelectorAll(".compare-checkbox input")
    .forEach((checkbox) => (checkbox.checked = false));
  const cars = await loadCars();
  populateMakes(cars);
  populateBodyTypes(cars);
  populateTransmissions(cars);
  populateFuelTypes(cars);
});

// Karşılaştırma butonu
COMPARE_BUTTON.addEventListener("click", () => {
  if (selectedCars.length >= 2) {
    createCompareTable(selectedCars);
    COMPARE_MODAL.show();
  }
});

// Görsel yükleme hatası için yardımcı fonksiyon
function hookImageError(imgElement, fallbackUrl) {
  imgElement.src = fallbackUrl;
  imgElement.onerror = null;
}

// Yakıt tipi normalizasyonu
function normalizeFuelType(fuel) {
  if (!fuel) return fuel;
  const fuelLower = fuel.toLowerCase();
  if (fuelLower.includes("benzin")) return "Benzin";
  if (fuelLower.includes("dizel")) return "Dizel";
  if (fuelLower.includes("hibrit")) return "Hibrit";
  if (fuelLower.includes("elektrik")) return "Elektrik";
  return fuelLower;
}

// Form gönderildiğinde
FORM.addEventListener("submit", async (e) => {
  e.preventDefault();
  SUGGESTIONS_DIV.innerHTML = `
    <div class="text-center">
      <div class="loading-spinner"></div>
      <p>Öneriler hazırlanıyor...</p>
    </div>`;
  const filters = {
    search: SEARCH_INPUT.value.trim(),
    make: MAKE_SELECT.value,
    model: MODEL_SELECT.value,
    bodyType: BODY_TYPE_SELECT.value,
    transmission: TRANSMISSION_SELECT.value,
    fuelType: normalizeFuelType(FUEL_TYPE_SELECT.value),
    price: PRICE_INPUT.value,
  };
  try {
    const cars = await loadCars();
    let filteredCars = [...cars];
    if (filters.search) {
      const inputParts = filters.search.toLowerCase().split(" ");
      const inputMake = inputParts[0];
      const inputModel = inputParts.slice(1).join(" ");
      filteredCars = filteredCars.filter((car) => {
        const carMake = car.marka.toLowerCase();
        const carModel = car.model.toLowerCase();
        return (
          carMake.includes(inputMake) &&
          (!inputModel || carModel.includes(inputModel))
        );
      });
    }
    if (filters.make) {
      filteredCars = filteredCars.filter(
        (car) => car.marka.toLowerCase() === filters.make.toLowerCase()
      );
    }
    if (filters.model) {
      filteredCars = filteredCars.filter(
        (car) => car.model.toLowerCase() === filters.model.toLowerCase()
      );
    }
    if (filters.bodyType) {
      filteredCars = filteredCars.filter(
        (car) => car.kasa_tipi.toLowerCase() === filters.bodyType.toLowerCase()
      );
    }
    if (filters.transmission) {
      filteredCars = filteredCars.filter(
        (car) =>
          car.vites_tipi.toLowerCase() === filters.transmission.toLowerCase()
      );
    }
    if (filters.fuelType) {
      filteredCars = filteredCars.filter(
        (car) =>
          normalizeFuelType(car.yakit_tipi).toLowerCase() ===
          filters.fuelType.toLowerCase()
      );
    }
    if (filters.price) {
      filteredCars = filteredCars.filter(
        (car) => car.fiyat <= parseInt(filters.price)
      );
    }
    if (filteredCars.length === 0) {
      const minPrice = filters.price
        ? Math.min(...filteredCars.map((car) => car.fiyat))
        : null;
      if (filters.price && minPrice && parseInt(filters.price) < minPrice) {
        SUGGESTIONS_DIV.innerHTML = `
          <p class="text-center text-warning">
            Girdiğiniz fiyat (${parseInt(filters.price).toLocaleString(
              "tr-TR"
            )} TL), filtrelenen araçların minimum fiyatından (${minPrice.toLocaleString(
          "tr-TR"
        )} TL) düşük. Lütfen daha yüksek bir fiyat girin.
          </p>`;
      } else {
        SUGGESTIONS_DIV.innerHTML = suggestAlternatives(filters, cars);
      }
      return;
    }
    const shuffledCars = filteredCars.sort(() => 0.5 - Math.random());
    const selectedCarsForDisplay = shuffledCars.slice(
      0,
      Math.min(6, shuffledCars.length)
    );
    SUGGESTIONS_DIV.innerHTML = "";
    selectedCars = []; // Yeni öneriler yüklendiğinde seçili araçları sıfırla
    updateCompareButton();
    for (const car of selectedCarsForDisplay) {
      const carName = `${car.marka} ${car.model}`;
      const imageUrl = car.resim_url;
      const fallbackImage = `https://placehold.co/500x220?text=${encodeURIComponent(
        carName
      )}&font=poppins`;
      let explanation = `Bu ${carName} tam senlik! 🚗 `;
      if (filters.search) {
        explanation += `Aramanıza (${filters.search}) mükemmel uyuyor. `;
      }
      if (filters.make) {
        explanation += `${filters.make} kalitesiyle öne çıkıyor. `;
      }
      if (filters.model) {
        explanation += `${filters.model} modeli tam istediğin gibi. `;
      }
      if (filters.bodyType) {
        explanation += `${filters.bodyType} kasa tipi sevenler için ideal. `;
      }
      if (filters.transmission) {
        explanation += `${filters.transmission} vitesle sürüş keyfi. `;
      }
      if (filters.fuelType) {
        explanation += `${filters.fuelType} yakıtla ekonomik. `;
      }
      if (filters.price) {
        explanation += `Bütçene uygun: ${filters.price} TL altında. `;
      }
      explanation += `Hadi, yola çıkmaya ne dersin?`;
      const carCard = document.createElement("div");
      carCard.classList.add("col-md-4", "car-card");
      carCard.innerHTML = `
        <div class="card h-100 shadow-sm">
          <input type="checkbox" class="compare-checkbox" data-car='${JSON.stringify(
            car
          )}'>
          <img src="${imageUrl}" class="card-img-top" alt="${carName}">
          <div class="car-info card-body">
            <h3 class="card-title">${carName}</h3>
            <p class="card-text">Fiyat: ${car.fiyat.toLocaleString(
              "tr-TR"
            )} TL</p>
            <p class="card-text">Yakıt: ${car.yakit_tipi}</p>
            <p class="card-text">Kasa: ${car.kasa_tipi}</p>
            <p class="card-text">Vites: ${car.vites_tipi}</p>
            <a href="#" class="youtube-btn">Videoyu İzle</a>
            <div class="explanation-toggle">Neden Önerildi?</div>
            <div class="explanation">${explanation}</div>
          </div>
        </div>
      `;
      const imgElement = carCard.querySelector("img");
      imgElement.addEventListener("error", () => {
        hookImageError(imgElement, fallbackImage);
      });
      carCard.addEventListener("click", (e) => {
        if (
          e.target.classList.contains("youtube-btn") ||
          e.target.classList.contains("explanation-toggle") ||
          e.target.classList.contains("compare-checkbox")
        ) {
          return;
        }
        window.open(car.site_detay_url, "_blank");
      });
      const youtubeBtn = carCard.querySelector(".youtube-btn");
      youtubeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            `${carName} official video`
          )}`,
          "_blank"
        );
      });
      const toggle = carCard.querySelector(".explanation-toggle");
      const explanationDiv = carCard.querySelector(".explanation");
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        explanationDiv.style.display =
          explanationDiv.style.display === "block" ? "none" : "block";
      });
      const checkbox = carCard.querySelector(".compare-checkbox");
      checkbox.addEventListener("change", (e) => {
        e.stopPropagation();
        const carData = JSON.parse(checkbox.dataset.car);
        if (checkbox.checked) {
          if (selectedCars.length > 6) {
            checkbox.checked = false;
            alert("En fazla 6 araç karşılaştırabilirsiniz!");
            return;
          }
          selectedCars.push(carData);
        } else {
          selectedCars = selectedCars.filter(
            (c) => c.marka !== carData.marka || c.model !== carData.model
          );
        }
        updateCompareButton();
      });
      SUGGESTIONS_DIV.appendChild(carCard);
    }
  } catch (error) {
    SUGGESTIONS_DIV.innerHTML = `<p class="text-center text-danger">Araç verileri alınamadı: ${error.message}</p>`;
    console.error("Hata:", error);
  }
});

// Tüm select box'ları başlangıçta doldur
loadCars().then((cars) => {
  populateMakes(cars);
  populateBodyTypes(cars);
  populateTransmissions(cars);
  populateFuelTypes(cars);
});
