document.addEventListener("DOMContentLoaded", () => {
    // 팝업 관련 요소
    const popup = document.getElementById("popup");
    const popupAssetType = document.getElementById("popupAssetType");
    const popupInputFields = document.getElementById("popupInputFields");
    const popupConfirmButton = document.getElementById("popupConfirmButton");
    const popupCancelButton = document.getElementById("popupCancelButton");

    // 재산 목록 및 총합
    const assetList = document.getElementById("assetList");
    const totalAssetValue = document.getElementById("totalAssetValue");

    // 상속인 추가 관련 요소
    const heirContainer = document.getElementById("heirContainer");
    const addHeirButton = document.getElementById("addHeirButton");

    // 팝업 열기/닫기
    const openPopup = () => {
        popup.style.display = "block";
        updatePopupFields("cash"); // 기본값으로 현금 필드 표시
    };

    const closePopup = () => {
        popup.style.display = "none";
    };

    // 팝업 내 재산 유형 선택 시 입력 필드 업데이트
    popupAssetType.addEventListener("change", (event) => {
        updatePopupFields(event.target.value);
    });

    // 입력 필드 생성 함수
    const updatePopupFields = (type) => {
        let fields = "";
        switch (type) {
            case "cash":
                fields = `
                    <label for="popupAmount">현금 금액 (원):</label>
                    <input type="text" id="popupAmount" class="amount-input" placeholder="예: 10,000,000">
                `;
                break;
            case "realEstate":
                fields = `
                    <label for="popupAmount">부동산 평가액 (원):</label>
                    <input type="text" id="popupAmount" class="amount-input" placeholder="예: 100,000,000">
                `;
                break;
            case "stock":
                fields = `
                    <label for="popupQuantity">주식 매수량:</label>
                    <input type="number" id="popupQuantity" placeholder="예: 100">
                    <label for="popupPrice">주식 1주당 가격 (원):</label>
                    <input type="text" id="popupPrice" class="amount-input" placeholder="예: 10,000">
                `;
                break;
            case "others":
                fields = `
                    <label for="popupAmount">기타 재산 평가액 (원):</label>
                    <input type="text" id="popupAmount" class="amount-input" placeholder="예: 50,000,000">
                `;
                break;
        }
        popupInputFields.innerHTML = fields;
    };

    // 팝업 확인 버튼 이벤트
    popupConfirmButton.addEventListener("click", () => {
        const type = popupAssetType.value;
        let amount = 0;

        if (type === "stock") {
            const quantity = parseInt(document.getElementById("popupQuantity").value) || 0;
            const price = parseInt(document.getElementById("popupPrice").value.replace(/,/g, "")) || 0;
            amount = quantity * price;
        } else {
            amount = parseInt(document.getElementById("popupAmount").value.replace(/,/g, "")) || 0;
        }

        if (amount <= 0 || isNaN(amount)) {
            alert("올바른 금액을 입력하세요.");
            return;
        }

        // 재산 목록 추가
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${popupAssetType.options[popupAssetType.selectedIndex].text}: ${amount.toLocaleString()} 원
            <button type="button" class="delete-asset">삭제</button>
        `;
        assetList.appendChild(listItem);

        // 총합 업데이트
        updateTotal(amount);

        // 삭제 버튼 이벤트
        listItem.querySelector(".delete-asset").addEventListener("click", () => {
            updateTotal(-amount);
            listItem.remove();
        });

        closePopup();
    });

    popupCancelButton.addEventListener("click", closePopup);

    // 총합 업데이트 함수
    const updateTotal = (amount) => {
        const currentTotal = parseInt(totalAssetValue.textContent.replace(/,/g, "")) || 0;
        totalAssetValue.textContent = (currentTotal + amount).toLocaleString();
    };

    // 재산 추가 버튼 이벤트
    document.getElementById("addAssetButton").addEventListener("click", openPopup);

    // 상속인 추가 버튼 이벤트
    addHeirButton.addEventListener("click", () => {
        const heirEntry = document.createElement("div");
        heirEntry.classList.add("heir-entry");
        heirEntry.innerHTML = `
            <input type="text" placeholder="이름">
            <select>
                <option value="spouse">배우자</option>
                <option value="child">자녀</option>
                <option value="other">기타</option>
            </select>
            <input type="number" placeholder="상속 비율 (%)">
            <button type="button" class="delete-heir">삭제</button>
        `;
        heirContainer.appendChild(heirEntry);

        // 삭제 버튼 이벤트 추가
        heirEntry.querySelector(".delete-heir").addEventListener("click", () => {
            heirEntry.remove();
        });
    });

    // 계산하기 버튼 이벤트
    document.getElementById("calculateButton").addEventListener("click", () => {
        const mode = document.getElementById("calculationMode").value;

        if (mode === "individual") {
            alert("개인 계산 로직 실행");
        } else if (mode === "total") {
            alert("전체 계산 로직 실행");
        }
    });

    // 금액 입력 필드 콤마 추가
    document.addEventListener("input", (event) => {
        if (event.target.classList.contains("amount-input")) {
            const rawValue = event.target.value.replace(/[^0-9]/g, "");
            event.target.value = rawValue ? parseInt(rawValue, 10).toLocaleString() : "";
        }
    });
});
