document.addEventListener('DOMContentLoaded', function () {
    // HTML 요소 참조
    const calculationMode = document.getElementById('calculationMode');
    const individualMode = document.getElementById('individualMode');
    const groupMode = document.getElementById('groupMode');
    const assetType = document.getElementById('assetType');
    const assetInputField = document.getElementById('assetInputField');
    const propertyPopup = document.getElementById('propertyPopup');
    const addPropertyButton = document.getElementById('addPropertyButton');
    const closePopupButton = document.getElementById('closePopupButton');
    const confirmPopupButton = document.getElementById('confirmPopupButton');
    const popupFields = document.getElementById('popupFields');
    const heirList = document.getElementById('heirList');
    const addHeirButton = document.getElementById('addHeirButton');
    const calculateButton = document.getElementById('calculateButton');
    const result = document.getElementById('result');

    // 상속재산 및 상속인 정보 저장용
    let inheritanceAssets = [];
    let heirs = [];

    // 천 단위 콤마 적용 함수
    function formatWithCommas(value) {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function parseToNumber(value) {
        return parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    }

    function addCommaFormattingListener(inputField) {
        inputField.addEventListener('input', function (event) {
            const rawValue = parseToNumber(event.target.value).toString();
            event.target.value = formatWithCommas(rawValue);
        });
    }

    // 계산 모드 전환
    function toggleModes() {
        if (calculationMode.value === 'individual') {
            individualMode.style.display = 'block';
            groupMode.style.display = 'none';
        } else {
            individualMode.style.display = 'none';
            groupMode.style.display = 'block';
        }
    }

    // 재산 유형 선택에 따른 입력 필드 업데이트
    function updateAssetInput() {
        const type = assetType.value;
        if (type === 'cash') {
            assetInputField.innerHTML = `
                <label for="cashAmount">현금 금액 (원):</label>
                <input type="text" id="cashAmount" class="input-field amount-input" placeholder="예: 10,000,000">
            `;
        } else if (type === 'realEstate') {
            assetInputField.innerHTML = `
                <label for="realEstateValue">부동산 평가액 (원):</label>
                <input type="text" id="realEstateValue" class="input-field amount-input" placeholder="예: 100,000,000">
            `;
        }

        const amountInput = assetInputField.querySelector('.amount-input');
        if (amountInput) {
            addCommaFormattingListener(amountInput);
        }
    }

    // 팝업 열기 및 닫기
    addPropertyButton.addEventListener('click', function () {
        propertyPopup.style.display = 'block';
    });

    closePopupButton.addEventListener('click', function () {
        propertyPopup.style.display = 'none';
    });

    confirmPopupButton.addEventListener('click', function () {
        const propertyType = document.getElementById('popupPropertyType').value;
        const propertyAmount = parseToNumber(document.getElementById('popupAmount').value);

        if (!propertyAmount || propertyAmount <= 0) {
            alert('올바른 금액을 입력해주세요.');
            return;
        }

        // 재산 정보 저장
        inheritanceAssets.push({ type: propertyType, amount: propertyAmount });
        alert(`${propertyType} 재산이 추가되었습니다.`);
        propertyPopup.style.display = 'none';
    });

    // 상속인 추가
    addHeirButton.addEventListener('click', function () {
        const newHeir = document.createElement('div');
        newHeir.className = 'input-group';

        newHeir.innerHTML = `
            <input type="text" class="input-field" placeholder="이름 입력">
            <select class="input-field">
                <option value="spouse">배우자</option>
                <option value="child">자녀</option>
                <option value="other">기타</option>
            </select>
            <input type="number" class="input-field" placeholder="지분율 입력">
        `;

        heirList.appendChild(newHeir);
    });

    // 계산 버튼 클릭 이벤트
    calculateButton.addEventListener('click', function () {
        // 상속재산 총액 계산
        const totalInheritance = inheritanceAssets.reduce((sum, asset) => sum + asset.amount, 0);

        // 단체 모드에서 상속인별 계산
        if (calculationMode.value === 'group') {
            const heirsData = [];
            Array.from(heirList.children).forEach((heir) => {
                const name = heir.querySelector('input[type="text"]').value;
                const relationship = heir.querySelector('select').value;
                const sharePercentage = parseToNumber(heir.querySelector('input[type="number"]').value);

                if (name && sharePercentage > 0) {
                    heirsData.push({
                        name,
                        relationship,
                        sharePercentage,
                        shareAmount: Math.floor((sharePercentage / 100) * totalInheritance),
                    });
                }
            });

            if (heirsData.length === 0) {
                alert('상속인 정보를 입력해주세요.');
                return;
            }

            // 결과 출력
            result.innerHTML = `<h3>계산 결과</h3>`;
            heirsData.forEach((heir) => {
                result.innerHTML += `
                    <p>${heir.name} (${heir.relationship}): ${heir.sharePercentage}% = ${formatWithCommas(heir.shareAmount.toString())}원</p>
                `;
            });
        } else {
            // 개인 모드 공제 계산
            const relationship = document.getElementById('individualRelationship').value;
            let exemption = 0;

            if (relationship === 'spouse') {
                exemption = 600000000; // 배우자 공제
            } else if (relationship === 'child') {
                exemption = 50000000; // 자녀 공제
            } else {
                exemption = 10000000; // 기타 공제
            }

            const taxableAmount = Math.max(totalInheritance - exemption, 0);

            result.innerHTML = `
                <h3>계산 결과</h3>
                <p>상속재산 총액: ${formatWithCommas(totalInheritance.toString())} 원</p>
                <p>공제액: ${formatWithCommas(exemption.toString())} 원</p>
                <p>과세표준: ${formatWithCommas(taxableAmount.toString())} 원</p>
            `;
        }
    });

    // 초기화
    calculationMode.addEventListener('change', toggleModes);
    assetType.addEventListener('change', updateAssetInput);
    toggleModes(); // 초기 모드 설정
    updateAssetInput(); // 초기 입력 필드 설정
});
