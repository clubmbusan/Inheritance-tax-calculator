document.addEventListener("DOMContentLoaded", () => {
    // 팝업 요소
    const popup = document.getElementById("assetPopup");
    const popupCloseButton = document.getElementById("popupClose");
    const popupConfirmButton = document.getElementById("popupConfirm");
    const popupAssetType = document.getElementById("popupAssetType");
    const popupInputFields = document.getElementById("popupInputFields");

    // 재산 목록 및 총합
    const assetList = document.getElementById("assetList");
    const totalAssetValue = document.getElementById("totalAssetValue");

    // 상속인 목록
    const heirContainer = document.getElementById("heirContainer");
    const addHeirButton = document.getElementById("addHeirButton");

    // 팝업 열기/닫기
    const openPopup = () => {
        popup.style.display = "block";
        resetPopup();
    };

    const closePopup = () => {
        popup.style.display = "none";
    };

    // 팝업 초기화
    const resetPopup = () => {
        popupAssetType.value = "cash";
        popupInputFields.innerHTML = generateInputField("cash");
    };

    // 재산 유형에 따른 입력 필드 생성
    const generateInputField = (assetType) => {
        switch (assetType) {
            case "cash":
                return `
                    <label for="popupAmount">현금 금액 (원):</label>
                    <input type="text" id="popupAmount" class="amount-input" placeholder="예: 10,000,000">
                `;
            case "realEstate":
                return `
                    <label for="popupAmount">부동산 평가액 (원):</label>
                    <input type="text" id="popupAmount" class="amount-input" placeholder="예: 100,000,000">
                `;
            case "stock":
                return `
                    <label for="popupStockQuantity">주식 매수량:</label>
                    <input type="number" id="popupStockQuantity" placeholder="예: 100">
                    <label for="popupStockPrice">주식 1주당 가격 (원):</label>
                    <input type="text" id="popupStockPrice" class="amount-input" placeholder="예: 10,000">
                `;
            case "others":
                return `
                    <label for="popupAmount">기타 재산 평가액 (원):</label>
                    <input type="text" id="popupAmount" class="amount-input" placeholder="예: 50,000,000">
                `;
            default:
                return "";
        }
    };

    // 팝업 확인 버튼 클릭 시 데이터 추가
    popupConfirmButton.addEventListener("click", () => {
        const assetType = popupAssetType.value;
        let assetAmount = 0;

        if (assetType === "stock") {
            const quantity = parseInt(document.getElementById("popupStockQuantity").value || "0", 10);
            const price = parseInt(document.getElementById("popupStockPrice").value.replace(/,/g, "") || "0", 10);
            assetAmount = quantity * price;
        } else {
            assetAmount = parseInt(document.getElementById("popupAmount").value.replace(/,/g, "") || "0", 10);
        }

        if (!assetAmount || isNaN(assetAmount) || assetAmount <= 0) {
            alert("올바른 금액을 입력하세요.");
            return;
        }

        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${popupAssetType.options[popupAssetType.selectedIndex].text}: ${assetAmount.toLocaleString()} 원
            <button type="button" class="delete-asset action-button">삭제</button>
        `;
        assetList.appendChild(listItem);

        updateTotal(assetAmount);

        listItem.querySelector(".delete-asset").addEventListener("click", () => {
            updateTotal(-assetAmount);
            listItem.remove();
        });

        closePopup();
    });

    // 총합 업데이트
    const updateTotal = (amount) => {
        const currentTotal = parseInt(totalAssetValue.textContent.replace(/,/g, "")) || 0;
        totalAssetValue.textContent = (currentTotal + amount).toLocaleString();
    };

    // 금액 입력 필드에 콤마 추가
    document.addEventListener("input", (event) => {
        if (event.target.classList.contains("amount-input")) {
            const rawValue = event.target.value.replace(/[^0-9]/g, "");
            event.target.value = rawValue ? parseInt(rawValue, 10).toLocaleString() : "";
        }
    });

    // 재산 추가 버튼 이벤트
    document.getElementById("addAssetButton").addEventListener("click", openPopup);

    // 팝업 닫기 버튼 이벤트
    popupCloseButton.addEventListener("click", closePopup);

    // 상속인 추가 버튼 이벤트
    addHeirButton.addEventListener("click", () => {
        const newHeir = document.createElement("div");
        newHeir.classList.add("heir-entry");
        newHeir.innerHTML = `
            <input type="text" placeholder="이름">
            <select>
                <option value="spouse">배우자</option>
                <option value="child">자녀</option>
                <option value="other">기타</option>
            </select>
            <input type="number" placeholder="상속 비율 (%)">
            <button type="button" class="delete-heir action-button">삭제</button>
        `;
        heirContainer.appendChild(newHeir);

        // 삭제 버튼 이벤트
        newHeir.querySelector(".delete-heir").addEventListener("click", () => {
            newHeir.remove();
        });
    });
});
