document.addEventListener('DOMContentLoaded', () => {
    const inheritanceType = document.getElementById('inheritanceType');
    const personalSection = document.getElementById('personalSection');
    const groupSection = document.getElementById('groupSection');
    const addAssetButton = document.getElementById('addAssetButton');
    const assetContainer = document.getElementById('assetContainer');
    const addHeirButton = document.getElementById('addHeirButton');
    const heirContainer = document.getElementById('heirContainer');
    const calculateButton = document.getElementById('calculateButton');
    const result = document.getElementById('result');

    // 콤마 추가 함수
    function formatNumberWithCommas(value) {
        const numericValue = value.replace(/[^0-9]/g, ''); // 숫자 외 문자 제거
        return parseInt(numericValue || '0', 10).toLocaleString();
    }

    // 입력 필드에 콤마 추가
    function addCommaFormatting(inputField) {
        inputField.addEventListener('input', () => {
            inputField.value = formatNumberWithCommas(inputField.value);
        });
    }
   
    // 상속 유형에 따른 섹션 표시/숨김
    inheritanceType.addEventListener('change', () => {
        if (inheritanceType.value === 'personal') {
            personalSection.style.display = 'block';
            groupSection.style.display = 'none';
        } else {
            personalSection.style.display = 'none';
            groupSection.style.display = 'block';
        }
    });

    // 숫자 입력 필드에 콤마 추가 함수
    function formatNumberWithCommas(value) {
        const numericValue = value.replace(/[^0-9]/g, ''); // 숫자 외 문자 제거
        return parseInt(numericValue || '0', 10).toLocaleString();
    }

    // 금액 필드 이벤트 리스너 추가 함수
    function addCommaFormatting(inputField) {
        inputField.addEventListener('input', () => {
            const formattedValue = formatNumberWithCommas(inputField.value);
            inputField.value = formattedValue;
        });
    }

    // 재산 유형 선택 시 필드 업데이트
    function updateAssetFields(assetType, container) {
    const cashField = container.querySelector('.cashField');
    const realEstateField = container.querySelector('.realEstateField');
    const stockQuantityField = container.querySelector('.stockQuantityField');
    const stockPriceField = container.querySelector('.stockPriceField');
    const stockTotalField = container.querySelector('.stockTotalField');
    const othersField = container.querySelector('.othersField');

    cashField.style.display = 'none';
    realEstateField.style.display = 'none';
    stockQuantityField.style.display = 'none';
    stockPriceField.style.display = 'none';
    stockTotalField.style.display = 'none';
    othersField.style.display = 'none';

    if (assetType === 'cash') {
        cashField.style.display = 'block';
        addCommaFormatting(cashField);
    } else if (assetType === 'realEstate') {
        realEstateField.style.display = 'block';
        addCommaFormatting(realEstateField);
    } else if (assetType === 'stock') {
        stockQuantityField.style.display = 'block';
        stockPriceField.style.display = 'block';
        stockTotalField.style.display = 'block'; // 총 금액 필드 표시
        addCommaFormatting(stockPriceField);
    } else if (assetType === 'others') {
        othersField.style.display = 'block';
        addCommaFormatting(othersField);
    }
}

      // 재산 추가 버튼 이벤트
addAssetButton.addEventListener('click', () => {
    const newAsset = document.createElement('div');
    newAsset.className = 'asset-entry';
    newAsset.innerHTML = `
        <label for="assetType">재산 유형:</label>
        <select class="assetType">
            <option value="cash" selected>현금</option>
            <option value="realEstate">부동산</option>
            <option value="stock">주식</option>
            <option value="others">기타</option>
        </select>
        <div class="assetFields">
            <input type="text" class="cashField assetValue" placeholder="금액 (원)" style="display: block;">
            <input type="text" class="realEstateField assetValue" placeholder="평가액 (원)" style="display: none;">
            <input type="number" class="stockQuantityField" placeholder="주식 수량" style="display: none;">
            <input type="text" class="stockPriceField" placeholder="주당 가격 (원)" style="display: none;">
            <input type="text" class="stockTotalField" placeholder="총 금액 (원)" readonly style="display: none;">
            <input type="text" class="othersField assetValue" placeholder="금액 (원)" style="display: none;">
        </div>
    `;
    assetContainer.appendChild(newAsset);

    // 새로 추가된 재산 유형 드롭다운 이벤트 추가
    const newAssetType = newAsset.querySelector('.assetType');
    newAssetType.addEventListener('change', () => {
        updateAssetFields(newAssetType.value, newAsset);
    });

    // 주식 필드의 총 금액 자동 계산
    const stockQuantityField = newAsset.querySelector('.stockQuantityField');
    const stockPriceField = newAsset.querySelector('.stockPriceField');
    const stockTotalField = newAsset.querySelector('.stockTotalField');

    if (stockQuantityField && stockPriceField && stockTotalField) {
        stockQuantityField.addEventListener('input', () => {
            const quantity = parseInt(stockQuantityField.value || '0', 10);
            const price = parseInt(stockPriceField.value.replace(/,/g, '') || '0', 10);
            stockTotalField.value = (quantity * price).toLocaleString();
        });

        stockPriceField.addEventListener('input', () => {
            const quantity = parseInt(stockQuantityField.value || '0', 10);
            const price = parseInt(stockPriceField.value.replace(/,/g, '') || '0', 10);
            stockTotalField.value = (quantity * price).toLocaleString();
        });

        addCommaFormatting(stockPriceField); // 주당 가격 필드에 콤마 추가
    }

    // 콤마 추가 이벤트 등록
    const cashField = newAsset.querySelector('.cashField');
    const realEstateField = newAsset.querySelector('.realEstateField');
    const othersField = newAsset.querySelector('.othersField');

    addCommaFormatting(cashField);
    addCommaFormatting(realEstateField);
    addCommaFormatting(stockPriceField);
    addCommaFormatting(othersField);
});

    // 초기화: 기존 재산 항목에 필드 변경 이벤트 추가
    assetContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('assetType')) {
            const assetType = event.target.value;
            const parentContainer = event.target.closest('.asset-entry');
            updateAssetFields(assetType, parentContainer);
        }
    });

    // 상속인 추가 버튼 이벤트
    addHeirButton.addEventListener('click', () => {
        const newHeir = document.createElement('div');
        newHeir.className = 'heir-entry';
        newHeir.innerHTML = `
            <input type="text" placeholder="이름">
            <select>
                <option value="spouse">배우자</option>
                <option value="child">자녀</option>
                <option value="other">기타</option>
            </select>
            <input type="number" placeholder="상속 비율 (%)">
        `;
        heirContainer.appendChild(newHeir);
    });

       // 계산하기 버튼
    calculateButton.addEventListener('click', () => {
    // 모든 재산 정보 가져오기
    const assets = Array.from(document.querySelectorAll('.asset-entry')).map(asset => {
        const type = asset.querySelector('.assetType').value; // 재산 유형
        let value = 0;

        // 현금, 부동산, 기타는 assetValue에서 값을 가져옴
        const valueField = asset.querySelector('.assetValue');
        if (valueField) {
            value = parseInt(valueField.value.replace(/,/g, '') || '0', 10);
        }

        // 주식은 수량과 주당 가격을 곱해야 함
        if (type === 'stock') {
            const quantityField = asset.querySelector('.stockQuantityField');
            const priceField = asset.querySelector('.stockPriceField');
            const quantity = parseInt(quantityField.value || '0', 10);
            const price = parseInt(priceField.value.replace(/,/g, '') || '0', 10);
            value = quantity * price;
        }

        return { type, value }; // 재산 유형과 계산된 금액 반환
    });

    // 모든 재산의 합계 계산
    const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
result.innerHTML = `<p>총 재산 금액: ${totalAssetValue.toLocaleString()} 원</p>`;
    });
});
    // 개인분 또는 전체분 계산
    if (inheritanceType.value === 'personal') {
        const relationship = document.getElementById('relationshipPersonal').value;
        let exemption = 500000000; // 기본 공제

        // 관계별 추가 공제
        if (relationship === 'spouse') exemption += 3000000000;
        else if (relationship === 'adultChild') exemption += 50000000;
        else if (relationship === 'minorChild') exemption += 520000000; // 미성년자 5억 + 추가 2천
        else if (relationship === 'parent') exemption += 50000000;
        else if (relationship === 'sibling') exemption += 50000000;
        else exemption += 10000000;

        // 과세 금액 및 상속세 계산
        const taxableAmount = Math.max(totalAssetValue - exemption, 0);
        const tax = calculateTax(taxableAmount);

        // 결과 출력
        result.innerHTML = `
            <h3>계산 결과 (개인분)</h3>
            <p>총 재산 금액: ${totalAssetValue.toLocaleString()} 원</p>
            <p>공제 금액: ${exemption.toLocaleString()} 원</p>
            <p>과세 금액: ${taxableAmount.toLocaleString()} 원</p>
            <p>상속세: ${tax.toLocaleString()} 원</p>
        `;
    }
});

// 상속세 계산 함수
function calculateTax(taxableAmount) {
    const taxBrackets = [
        { limit: 100000000, rate: 0.1, deduction: 0 },
        { limit: 500000000, rate: 0.2, deduction: 10000000 },
        { limit: 1000000000, rate: 0.3, deduction: 60000000 },
        { limit: Infinity, rate: 0.4, deduction: 160000000 }
    ];

    let totalTax = 0;
    for (const bracket of taxBrackets) {
        if (taxableAmount > bracket.limit) {
            totalTax += (bracket.limit) * bracket.rate;
        } else {
            totalTax += (taxableAmount) * bracket.rate - bracket.deduction;
            break;
        }
    }
    return Math.max(totalTax, 0);
}
});
