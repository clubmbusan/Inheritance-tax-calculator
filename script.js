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

    // 상단 필드: 재산 유형 변경 이벤트 등록
    const topAssetType = document.querySelector('.assetType'); // 상단 재산 유형 필드
    const topAssetContainer = document.querySelector('.asset-entry'); // 상단 컨테이너

    if (topAssetType && topAssetContainer) {
        topAssetType.addEventListener('change', (event) => {
            updateAssetFields(event.target.value, topAssetContainer);
        });
    }

    // 숫자에 콤마를 추가하는 함수
    function formatNumberWithCommas(value) {
        return parseInt(value.replace(/[^0-9]/g, '') || '0', 10).toLocaleString();
    }

    // 입력 필드에 콤마 추가 이벤트 등록
    function addCommaFormatting(inputField) {
        inputField.addEventListener('input', () => {
            const numericValue = inputField.value.replace(/,/g, '');
            if (!isNaN(numericValue)) {
                inputField.value = formatNumberWithCommas(numericValue);
            }
        });
    }

    // 재산 유형에 따른 입력 필드 표시/숨김 함수
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
        } else if (assetType === 'realEstate') {
            realEstateField.style.display = 'block';
        } else if (assetType === 'stock') {
            stockQuantityField.style.display = 'block';
            stockPriceField.style.display = 'block';
            stockTotalField.style.display = 'block';
        } else if (assetType === 'others') {
            othersField.style.display = 'block';
        }
    }

    // 초기화: 모든 .assetValue 필드에 이벤트 등록
    document.querySelectorAll('.assetValue').forEach(addCommaFormatting);
}); // DOMContentLoaded 닫는 중괄호 및 소괄호

   
// 재산 항목 생성
    function createAssetEntry() {
        const newAsset = document.createElement('div');
        newAsset.className = 'asset-entry';
        newAsset.innerHTML = `
            <label>재산 유형:</label>
            <select class="assetType">
                <option value="cash">현금</option>
                <option value="realEstate">부동산</option>
                <option value="stock">주식</option>
                <option value="others">기타</option>
            </select>
            <div class="assetFields">
                <input type="text" class="cashField assetValue" placeholder="금액 (원)" style="display: block;">
                <input type="text" class="realEstateField assetValue" placeholder="평가액 (원)" style="display: none;">
                <input type="number" class="stockQuantityField" placeholder="주식 수량" style="display: none;">
                <input type="text" class="stockPriceField" placeholder="주당 가격 (원)" style="display: none;">
                <input type="text" class="stockTotalField assetValue" placeholder="금액 (원)" style="display: none;" readonly>
                <input type="text" class="othersField assetValue" placeholder="금액 (원)" style="display: none;">
            </div>
        `;
        assetContainer.appendChild(newAsset);

        // 추가 필드에 이벤트 등록
        addCommaFormatting(newAsset.querySelector('.cashField'));
        addCommaFormatting(newAsset.querySelector('.realEstateField'));
        addCommaFormatting(newAsset.querySelector('.othersField'));

        // 주식 계산 로직
        const stockQuantityField = newAsset.querySelector('.stockQuantityField');
        const stockPriceField = newAsset.querySelector('.stockPriceField');
        const stockTotalField = newAsset.querySelector('.stockTotalField');
        stockQuantityField.addEventListener('input', updateStockTotal);
        stockPriceField.addEventListener('input', updateStockTotal);

        function updateStockTotal() {
            const quantity = parseInt(stockQuantityField.value || '0', 10);
            const price = parseInt(stockPriceField.value.replace(/,/g, '') || '0', 10);
            stockTotalField.value = formatNumberWithCommas((quantity * price).toString());
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
            <input type="number" class="stockQuantityField" placeholder="주식 매수" style="display: none;">
            <input type="text" class="stockPriceField" placeholder="주당 가격 (원)" style="display: none;">
            <input type="text" class="stockTotalField" placeholder="금액 (원)" style="display: none;" readonly>
            <input type="text" class="othersField assetValue" placeholder="기타 금액 (원)" style="display: none;">
        </div>
    `;

    assetContainer.appendChild(newAsset);

    // 재산 유형 선택 이벤트 연결
    const newAssetType = newAsset.querySelector('.assetType');
    newAssetType.addEventListener('change', (event) => {
        updateAssetFields(event.target.value, newAsset);
    });
});

    // 상속인 항목 생성
    addHeirButton.addEventListener('click', () => {
        const newHeir = document.createElement('div');
        newHeir.className = 'heir-entry';
        newHeir.innerHTML = `
            <input type="text" placeholder="이름">
            <select>
                <option value="spouse">배우자</option>
                <option value="adultChild">성년 자녀</option>
                <option value="minorChild">미성년 자녀</option>
                <option value="parent">부모</option>
                <option value="sibling">형제자매</option>
                <option value="other">기타</option>
            </select>
            <input type="number" placeholder="상속 비율 (%)">
        `;
        heirContainer.appendChild(newHeir);
    });

    // 모드 전환 이벤트
    inheritanceType.addEventListener('change', () => {
        if (inheritanceType.value === 'personal') {
            personalSection.style.display = 'block';
            groupSection.style.display = 'none';
        } else {
            personalSection.style.display = 'none';
            groupSection.style.display = 'block';
        }
    });

    // 계산 로직
    calculateButton.addEventListener('click', () => {
        const totalAssetValue = Array.from(document.querySelectorAll('.assetValue')).reduce((sum, field) => {
            const value = parseInt(field.value.replace(/,/g, '') || '0', 10);
            return sum + value;
        }, 0);

        if (inheritanceType.value === 'personal') {
            calculatePersonalMode(totalAssetValue);
        } else {
            calculateGroupMode(totalAssetValue);
        }
    });

    // 개인 모드 계산
    function calculatePersonalMode(totalAssetValue) {
        const relationship = document.getElementById('relationshipPersonal').value;
        let exemption = 500000000; // 기본 공제
        if (relationship === 'spouse') exemption += 3000000000; // 배우자 공제
        else if (relationship === 'adultChild') exemption += 50000000;
        else if (relationship === 'minorChild') exemption += 20000000;
        else exemption += 10000000;

        const taxableAmount = Math.max(totalAssetValue - exemption, 0);
        const tax = calculateTax(taxableAmount);

        result.innerHTML = `
            <h3>계산 결과 (개인 모드)</h3>
            <p>총 재산 금액: ${formatNumberWithCommas(totalAssetValue.toString())} 원</p>
            <p>공제 금액: ${formatNumberWithCommas(exemption.toString())} 원</p>
            <p>과세 금액: ${formatNumberWithCommas(taxableAmount.toString())} 원</p>
            <p>상속세: ${formatNumberWithCommas(tax.toString())} 원</p>
        `;
    }

    // 전체 모드 계산
    function calculateGroupMode(totalAssetValue) {
        const heirs = Array.from(document.querySelectorAll('.heir-entry')).map(heir => {
            const name = heir.querySelector('input[type="text"]').value;
            const relationship = heir.querySelector('select').value;
            const share = parseFloat(heir.querySelector('input[type="number"]').value) || 0;
            const heirAssetValue = (totalAssetValue * share) / 100;

            let exemption = 500000000; // 기본 공제
            if (relationship === 'spouse') exemption += 3000000000;
            else if (relationship === 'adultChild') exemption += 50000000;
            else if (relationship === 'minorChild') exemption += 20000000;
            else exemption += 10000000;

            const taxableAmount = Math.max(heirAssetValue - exemption, 0);
            const tax = calculateTax(taxableAmount);

            return { name, share, assetValue: heirAssetValue, exemption, taxableAmount, tax };
        });

        result.innerHTML = `
            <h3>계산 결과 (전체 모드)</h3>
            ${heirs.map(heir => `
                <p>
                    <strong>${heir.name}</strong>: ${formatNumberWithCommas(heir.assetValue.toString())} 원<br>
                    공제 금액: ${formatNumberWithCommas(heir.exemption.toString())} 원<br>
                    과세 금액: ${formatNumberWithCommas(heir.taxableAmount.toString())} 원<br>
                    상속세: ${formatNumberWithCommas(heir.tax.toString())} 원
                </p>
            `).join('')}
        `;
    }

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
                totalTax += bracket.limit * bracket.rate;
            } else {
                totalTax += taxableAmount * bracket.rate - bracket.deduction;
                break;
            }
        }
        return Math.max(totalTax, 0);
    }
});
